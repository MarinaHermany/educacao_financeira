import jwt from 'jsonwebtoken';
import { db } from '../database/conexao.js';
import { ambiente } from '../config/ambiente.js';

export async function autenticarToken(req, res, next) {
  try {
    const cabecalho = req.headers.authorization;

    if (!cabecalho || !cabecalho.startsWith('Bearer ')) {
      return res.status(401).json({ mensagem: 'Token ausente ou inválido.' });
    }

    const token = cabecalho.split(' ')[1];
    const payload = jwt.verify(token, ambiente.jwtSecret);

    if (!db) {
      return res.status(500).json({ mensagem: 'Banco de dados indisponível.' });
    }

    const [usuarios] = await db.execute(
      'SELECT id, nome, email, nivel FROM usuarios WHERE id = ?',
      [payload.id]
    );

    const usuario = usuarios[0];

    if (!usuario) {
      return res.status(401).json({ mensagem: 'Usuário não encontrado.' });
    }

    req.usuario = usuario;
    return next();
  } catch (error) {
    return res.status(401).json({ mensagem: 'Token inválido ou expirado.' });
  }
}
