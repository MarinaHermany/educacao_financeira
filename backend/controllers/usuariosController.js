import { db } from '../database/conexao.js';
import { validarEmail, normalizarTexto } from '../utils/validacoes.js';

export async function atualizarMeuUsuario(req, res) {
  const nome = normalizarTexto(req.body?.nome);
  const email = normalizarTexto(req.body?.email).toLowerCase();
  if (!nome || nome.length > 120 || !validarEmail(email) || email.length > 120) {
    return res.status(400).json({ mensagem: 'Informe nome e e-mail válidos.' });
  }
  try {
    const [existentes] = await db.execute('SELECT id FROM usuarios WHERE email = ? AND id <> ?', [email, req.usuario.id]);
    if (existentes.length) return res.status(409).json({ mensagem: 'E-mail já cadastrado.' });
    await db.execute('UPDATE usuarios SET nome = ?, email = ? WHERE id = ?', [nome, email, req.usuario.id]);
    return res.status(200).json({ mensagem: 'Dados atualizados.', usuario: { ...req.usuario, nome, email } });
  } catch (error) {
    console.error('Falha ao atualizar perfil:', error.message);
    return res.status(500).json({ mensagem: 'Não foi possível atualizar seus dados.' });
  }
}

export async function listarUsuarios(req, res) {
  try {
    if (!db) {
      return res.status(500).json({ mensagem: 'Banco de dados indisponível.' });
    }

    const [usuarios] = await db.execute('SELECT id, nome, email, nivel, criado_em FROM usuarios ORDER BY id ASC');
    return res.status(200).json(usuarios);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ mensagem: 'Erro ao listar usuários.' });
  }
}

export async function alterarNivelUsuario(req, res) {
  try {
    const id = Number(req.params.id);
    const novoNivel = String(req.body?.nivel || '').toLowerCase();

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ mensagem: 'ID inválido.' });
    }

    if (id === Number(req.usuario.id)) {
      return res.status(400).json({ mensagem: 'Não é possível alterar o próprio nível.' });
    }

    if (novoNivel !== 'usuario' && novoNivel !== 'admin') {
      return res.status(400).json({ mensagem: 'Nível inválido. Use usuario ou admin.' });
    }

    if (!db) {
      return res.status(500).json({ mensagem: 'Banco de dados indisponível.' });
    }

    const [usuarios] = await db.execute('SELECT id, nome, email, nivel FROM usuarios WHERE id = ?', [id]);
    const usuario = usuarios[0];

    if (!usuario) {
      return res.status(404).json({ mensagem: 'Usuário não encontrado.' });
    }

    await db.execute('UPDATE usuarios SET nivel = ? WHERE id = ?', [novoNivel, id]);

    return res.status(200).json({
      mensagem: 'Nível atualizado com sucesso.',
      usuario: {
        ...usuario,
        nivel: novoNivel,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ mensagem: 'Erro ao alterar nível.' });
  }
}
