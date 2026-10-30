import db from './backend/database/conexao.js';
import bcrypt from 'bcryptjs';

const email = `teste_insert_${Date.now()}@teste.com`;
const senha = '12345678';
const hash = await bcrypt.hash(senha, 10);

try {
  const [result] = await db.execute(
    'INSERT INTO usuarios (nome, email, senha, nivel) VALUES (?, ?, ?, ?)',
    ['Teste', email, hash, 'usuario']
  );

  console.log('OK', result.insertId);
} catch (error) {
  console.error('ERR', error.message);
  console.error(error.sqlMessage || error.stack);
  process.exit(1);
}
