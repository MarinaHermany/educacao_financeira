import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../database/conexao.js';
import { ambiente } from '../config/ambiente.js';
import { validarEmail, validarSenha, normalizarTexto } from '../utils/validacoes.js';

export async function cadastrarUsuario(req, res) {
  try {
    const nome = normalizarTexto(req.body?.nome);
    const email = normalizarTexto(req.body?.email).toLowerCase();
    const senha = String(req.body?.senha ?? '');

    if (!nome || !email || !senha) {
      return res.status(400).json({ mensagem: 'Nome, e-mail e senha são obrigatórios.' });
    }

    if (!validarEmail(email)) {
      return res.status(400).json({ mensagem: 'E-mail inválido.' });
    }

    if (!validarSenha(senha)) {
      return res.status(400).json({ mensagem: 'A senha deve ter entre 8 e 72 caracteres.' });
    }

    if (!db) {
      return res.status(500).json({ mensagem: 'Banco de dados indisponível.' });
    }

    const [usuarios] = await db.execute('SELECT id FROM usuarios WHERE email = ?', [email]);

    if (usuarios.length > 0) {
      return res.status(409).json({ mensagem: 'E-mail já cadastrado.' });
    }

    const senhaHash = await bcrypt.hash(senha, 10);
    const [resultado] = await db.execute(
      'INSERT INTO usuarios (nome, email, senha, nivel) VALUES (?, ?, ?, ?)',
      [nome, email, senhaHash, 'usuario']
    );

    return res.status(201).json({
      mensagem: 'Usuário cadastrado com sucesso.',
      usuario: {
        id: resultado.insertId,
        nome,
        email,
        nivel: 'usuario',
      },
    });
  } catch (error) {
    console.error('ERRO ao cadastrar usuário:', error);
    return res.status(500).json({
      mensagem: error.message || 'Erro ao cadastrar usuário.',
      detalhe: process.env.NODE_ENV === 'production' ? undefined : error.stack,
      sqlMessage: process.env.NODE_ENV === 'production' ? undefined : error.sqlMessage,
    });
  }
}

export async function login(req, res) {
  try {
    const email = normalizarTexto(req.body?.email).toLowerCase();
    const senha = String(req.body?.senha ?? '');

    if (!email || !senha) {
      return res.status(400).json({ mensagem: 'E-mail e senha são obrigatórios.' });
    }

    if (!db) {
      return res.status(500).json({ mensagem: 'Banco de dados indisponível.' });
    }

    const [usuarios] = await db.execute(
      'SELECT id, nome, email, senha, nivel FROM usuarios WHERE email = ?',
      [email]
    );

    const usuario = usuarios[0];

    if (!usuario) {
      return res.status(401).json({ mensagem: 'E-mail ou senha inválidos.' });
    }

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

    if (!senhaCorreta) {
      return res.status(401).json({ mensagem: 'E-mail ou senha inválidos.' });
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, nivel: usuario.nivel },
      ambiente.jwtSecret,
      { expiresIn: '2h' }
    );

    return res.status(200).json({
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        nivel: usuario.nivel,
      },
    });
  } catch (error) {
    console.error('ERRO ao fazer login:', error);
    return res.status(500).json({
      mensagem: error.message || 'Erro ao tentar fazer login.',
      detalhe: process.env.NODE_ENV === 'production' ? undefined : error.stack,
      sqlMessage: process.env.NODE_ENV === 'production' ? undefined : error.sqlMessage,
    });
  }
}

export async function me(req, res) {
  return res.status(200).json({ usuario: req.usuario });
}
