import { db } from '../database/conexao.js';

const SALDO_INICIAL = '10000.00';

async function garantirCarteira(conexao, usuarioId) {
  await conexao.execute(
    'INSERT INTO carteiras (usuario_id, saldo_virtual) VALUES (?, ?) ON DUPLICATE KEY UPDATE usuario_id = VALUES(usuario_id)',
    [usuarioId, SALDO_INICIAL]
  );
  const [linhas] = await conexao.execute('SELECT saldo_virtual FROM carteiras WHERE usuario_id = ?', [usuarioId]);
  return linhas[0];
}

export async function listarInvestimentos(req, res) {
  try {
    const [linhas] = await db.execute('SELECT id, nome, categoria, descricao FROM investimentos WHERE ativo = 1 ORDER BY id');
    return res.json(linhas);
  } catch (error) {
    console.error('Falha ao consultar categorias educativas:', error.message);
    return res.status(500).json({ mensagem: 'Não foi possível carregar as opções de simulação.' });
  }
}

export async function obterInicio(req, res) {
  try {
    const carteira = await garantirCarteira(db, req.usuario.id);
    const [[contagem]] = await db.execute('SELECT COUNT(*) AS total FROM simulacoes WHERE usuario_id = ?', [req.usuario.id]);
    return res.json({ saldoVirtual: carteira.saldo_virtual, totalSimulacoes: contagem.total });
  } catch (error) {
    console.error('Falha ao carregar resumo:', error.message);
    return res.status(500).json({ mensagem: 'Não foi possível carregar seu resumo.' });
  }
}

export async function listarSimulacoes(req, res) {
  try {
    const [linhas] = await db.execute(
      'SELECT s.id, s.investimento_id AS investimentoId, s.valor, s.resultado, s.criado_em AS criadoEm, i.nome AS investimentoNome, i.categoria FROM simulacoes s INNER JOIN investimentos i ON i.id = s.investimento_id WHERE s.usuario_id = ? ORDER BY s.criado_em DESC, s.id DESC',
      [req.usuario.id]
    );
    return res.json(linhas);
  } catch (error) {
    console.error('Falha ao consultar histórico:', error.message);
    return res.status(500).json({ mensagem: 'Não foi possível carregar seu histórico.' });
  }
}

export async function registrarSimulacao(req, res) {
  const investimentoId = Number(req.body?.investimentoId);
  const valor = Number(req.body?.valor);
  if (!Number.isInteger(investimentoId) || investimentoId <= 0) return res.status(400).json({ mensagem: 'Escolha uma categoria válida.' });
  if (!Number.isFinite(valor) || valor <= 0 || Math.round(valor * 100) !== valor * 100) {
    return res.status(400).json({ mensagem: 'Informe um valor positivo com até duas casas decimais.' });
  }

  let conexao;
  try {
    conexao = await db.getConnection();
    await conexao.beginTransaction();
    const [opcoes] = await conexao.execute('SELECT id FROM investimentos WHERE id = ? AND ativo = 1', [investimentoId]);
    if (!opcoes[0]) {
      await conexao.rollback();
      return res.status(404).json({ mensagem: 'A opção de simulação não está disponível.' });
    }
    await conexao.execute(
      'INSERT INTO carteiras (usuario_id, saldo_virtual) VALUES (?, ?) ON DUPLICATE KEY UPDATE usuario_id = VALUES(usuario_id)',
      [req.usuario.id, SALDO_INICIAL]
    );
    const [carteiras] = await conexao.execute('SELECT saldo_virtual FROM carteiras WHERE usuario_id = ? FOR UPDATE', [req.usuario.id]);
    const saldo = Number(carteiras[0].saldo_virtual);
    if (valor > saldo) {
      await conexao.rollback();
      return res.status(400).json({ mensagem: 'O valor excede seu saldo virtual disponível.' });
    }
    const novoSaldo = (saldo - valor).toFixed(2);
    await conexao.execute('UPDATE carteiras SET saldo_virtual = ? WHERE usuario_id = ?', [novoSaldo, req.usuario.id]);
    const mensagemResultado = 'Registro educativo salvo. Não foram usadas cotações reais nem calculada rentabilidade.';
    const [insercao] = await conexao.execute(
      'INSERT INTO simulacoes (usuario_id, investimento_id, valor, resultado) VALUES (?, ?, ?, ?)',
      [req.usuario.id, investimentoId, valor.toFixed(2), mensagemResultado]
    );
    await conexao.commit();
    return res.status(201).json({
      simulacao: { id: insercao.insertId, valor: valor.toFixed(2), resultado: mensagemResultado },
      saldoVirtual: novoSaldo,
    });
  } catch (error) {
    if (conexao) await conexao.rollback().catch(() => {});
    console.error('Falha ao registrar simulação:', error.message);
    return res.status(500).json({ mensagem: 'Não foi possível registrar a simulação.' });
  } finally {
    conexao?.release();
  }
}

function validarIdSimulacao(valor) {
  const id = Number(valor);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

export async function atualizarSimulacao(req, res) {
  const id = validarIdSimulacao(req.params.id);
  const investimentoId = Number(req.body?.investimentoId);
  const valor = Number(req.body?.valor);
  if (!id) return res.status(400).json({ mensagem: 'ID de simulação inválido.' });
  if (!Number.isInteger(investimentoId) || investimentoId <= 0) return res.status(400).json({ mensagem: 'Escolha uma categoria válida.' });
  if (!Number.isFinite(valor) || valor <= 0 || Math.round(valor * 100) !== valor * 100) {
    return res.status(400).json({ mensagem: 'Informe um valor positivo com até duas casas decimais.' });
  }

  let conexao;
  try {
    conexao = await db.getConnection();
    await conexao.beginTransaction();
    const [simulacoes] = await conexao.execute(
      'SELECT id, valor FROM simulacoes WHERE id = ? AND usuario_id = ? FOR UPDATE',
      [id, req.usuario.id]
    );
    if (!simulacoes[0]) {
      await conexao.rollback();
      return res.status(404).json({ mensagem: 'Simulação não encontrada.' });
    }
    const [opcoes] = await conexao.execute('SELECT id FROM investimentos WHERE id = ? AND ativo = 1', [investimentoId]);
    if (!opcoes[0]) {
      await conexao.rollback();
      return res.status(404).json({ mensagem: 'A opção de simulação não está disponível.' });
    }
    await conexao.execute(
      'INSERT INTO carteiras (usuario_id, saldo_virtual) VALUES (?, ?) ON DUPLICATE KEY UPDATE usuario_id = VALUES(usuario_id)',
      [req.usuario.id, SALDO_INICIAL]
    );
    const [[carteira]] = await conexao.execute('SELECT saldo_virtual FROM carteiras WHERE usuario_id = ? FOR UPDATE', [req.usuario.id]);
    const saldo = Number(carteira.saldo_virtual);
    const diferenca = valor - Number(simulacoes[0].valor);
    if (diferenca > saldo) {
      await conexao.rollback();
      return res.status(400).json({ mensagem: 'O valor excede seu saldo virtual disponível.' });
    }
    const novoSaldo = (saldo - diferenca).toFixed(2);
    await conexao.execute('UPDATE carteiras SET saldo_virtual = ? WHERE usuario_id = ?', [novoSaldo, req.usuario.id]);
    await conexao.execute('UPDATE simulacoes SET investimento_id = ?, valor = ? WHERE id = ? AND usuario_id = ?',
      [investimentoId, valor.toFixed(2), id, req.usuario.id]);
    await conexao.commit();
    return res.status(200).json({ mensagem: 'Simulação atualizada.', saldoVirtual: novoSaldo });
  } catch (error) {
    if (conexao) await conexao.rollback().catch(() => {});
    console.error('Falha ao atualizar simulação:', error.message);
    return res.status(500).json({ mensagem: 'Não foi possível atualizar a simulação.' });
  } finally {
    conexao?.release();
  }
}

export async function excluirSimulacao(req, res) {
  const id = validarIdSimulacao(req.params.id);
  if (!id) return res.status(400).json({ mensagem: 'ID de simulação inválido.' });
  let conexao;
  try {
    conexao = await db.getConnection();
    await conexao.beginTransaction();
    const [simulacoes] = await conexao.execute(
      'SELECT valor FROM simulacoes WHERE id = ? AND usuario_id = ? FOR UPDATE',
      [id, req.usuario.id]
    );
    if (!simulacoes[0]) {
      await conexao.rollback();
      return res.status(404).json({ mensagem: 'Simulação não encontrada.' });
    }
    await conexao.execute(
      'INSERT INTO carteiras (usuario_id, saldo_virtual) VALUES (?, ?) ON DUPLICATE KEY UPDATE usuario_id = VALUES(usuario_id)',
      [req.usuario.id, SALDO_INICIAL]
    );
    await conexao.execute('UPDATE carteiras SET saldo_virtual = saldo_virtual + ? WHERE usuario_id = ?',
      [simulacoes[0].valor, req.usuario.id]);
    await conexao.execute('DELETE FROM simulacoes WHERE id = ? AND usuario_id = ?', [id, req.usuario.id]);
    await conexao.commit();
    return res.status(200).json({ mensagem: 'Simulação excluída e saldo virtual devolvido.' });
  } catch (error) {
    if (conexao) await conexao.rollback().catch(() => {});
    console.error('Falha ao excluir simulação:', error.message);
    return res.status(500).json({ mensagem: 'Não foi possível excluir a simulação.' });
  } finally {
    conexao?.release();
  }
}
