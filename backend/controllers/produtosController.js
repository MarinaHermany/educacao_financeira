import { db } from '../database/conexao.js';

export async function listarProdutos(req, res) {
  try {
    if (!db) {
      return res.status(500).json({ mensagem: 'Banco de dados indisponível.' });
    }

    const [produtos] = await db.execute('SELECT * FROM produtos ORDER BY id DESC');
    return res.status(200).json(produtos);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ mensagem: 'Erro ao listar produtos.' });
  }
}

export async function buscarProdutoPorId(req, res) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ mensagem: 'ID inválido.' });
    }

    if (!db) {
      return res.status(500).json({ mensagem: 'Banco de dados indisponível.' });
    }

    const [produtos] = await db.execute('SELECT * FROM produtos WHERE id = ?', [id]);

    if (!produtos[0]) {
      return res.status(404).json({ mensagem: 'Produto não encontrado.' });
    }

    return res.status(200).json(produtos[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ mensagem: 'Erro ao buscar produto.' });
  }
}

export async function cadastrarProduto(req, res) {
  try {
    const { nome, descricao = '', categoria = '', preco, estoque } = req.body || {};

    if (!nome || !preco || estoque === undefined || estoque === null) {
      return res.status(400).json({ mensagem: 'Nome, preço e estoque são obrigatórios.' });
    }

    const precoNumero = Number(preco);
    const estoqueNumero = Number(estoque);

    if (!Number.isFinite(precoNumero) || precoNumero < 0) {
      return res.status(400).json({ mensagem: 'Preço inválido.' });
    }

    if (!Number.isInteger(estoqueNumero) || estoqueNumero < 0) {
      return res.status(400).json({ mensagem: 'Estoque inválido.' });
    }

    if (!db) {
      return res.status(500).json({ mensagem: 'Banco de dados indisponível.' });
    }

    const [resultado] = await db.execute(
      'INSERT INTO produtos (nome, descricao, categoria, preco, estoque) VALUES (?, ?, ?, ?, ?)',
      [String(nome).trim(), String(descricao).trim(), String(categoria).trim(), precoNumero, estoqueNumero]
    );

    const [produtoCriado] = await db.execute('SELECT * FROM produtos WHERE id = ?', [resultado.insertId]);

    return res.status(201).json({ mensagem: 'Produto cadastrado com sucesso.', produto: produtoCriado[0] });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ mensagem: 'Erro ao cadastrar produto.' });
  }
}

export async function atualizarProduto(req, res) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ mensagem: 'ID inválido.' });
    }

    const { nome, descricao = '', categoria = '', preco, estoque } = req.body || {};

    if (!nome || !preco || estoque === undefined || estoque === null) {
      return res.status(400).json({ mensagem: 'Nome, preço e estoque são obrigatórios.' });
    }

    const precoNumero = Number(preco);
    const estoqueNumero = Number(estoque);

    if (!Number.isFinite(precoNumero) || precoNumero < 0) {
      return res.status(400).json({ mensagem: 'Preço inválido.' });
    }

    if (!Number.isInteger(estoqueNumero) || estoqueNumero < 0) {
      return res.status(400).json({ mensagem: 'Estoque inválido.' });
    }

    if (!db) {
      return res.status(500).json({ mensagem: 'Banco de dados indisponível.' });
    }

    const [atual] = await db.execute('SELECT id FROM produtos WHERE id = ?', [id]);

    if (!atual[0]) {
      return res.status(404).json({ mensagem: 'Produto não encontrado.' });
    }

    await db.execute(
      'UPDATE produtos SET nome = ?, descricao = ?, categoria = ?, preco = ?, estoque = ? WHERE id = ?',
      [String(nome).trim(), String(descricao).trim(), String(categoria).trim(), precoNumero, estoqueNumero, id]
    );

    const [produtoAtualizado] = await db.execute('SELECT * FROM produtos WHERE id = ?', [id]);

    return res.status(200).json({ mensagem: 'Produto atualizado com sucesso.', produto: produtoAtualizado[0] });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ mensagem: 'Erro ao atualizar produto.' });
  }
}

export async function excluirProduto(req, res) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ mensagem: 'ID inválido.' });
    }

    if (!db) {
      return res.status(500).json({ mensagem: 'Banco de dados indisponível.' });
    }

    const [produto] = await db.execute('SELECT id FROM produtos WHERE id = ?', [id]);

    if (!produto[0]) {
      return res.status(404).json({ mensagem: 'Produto não encontrado.' });
    }

    await db.execute('DELETE FROM produtos WHERE id = ?', [id]);
    return res.status(200).json({ mensagem: 'Produto excluído com sucesso.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ mensagem: 'Erro ao excluir produto.' });
  }
}
