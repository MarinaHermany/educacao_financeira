import bcrypt from 'bcryptjs';
import { db } from '../database/conexao.js';
import { ambiente } from '../config/ambiente.js';

async function criarAdmin() {
  if (!db) {
    console.error('Banco de dados indisponível.');
    process.exit(1);
  }

  const nome = ambiente.adminNome;
  const email = ambiente.adminEmail;
  const senha = ambiente.adminSenha;

  if (!nome || !email || !senha) {
    console.error('Preencha ADMIN_NOME, ADMIN_EMAIL e ADMIN_SENHA no .env.');
    process.exit(1);
  }

  const [usuarios] = await db.execute('SELECT id FROM usuarios WHERE email = ?', [email]);

  if (usuarios.length > 0) {
    console.log('Administrador já cadastrado.');
    process.exit(0);
  }

  const senhaHash = await bcrypt.hash(senha, 10);

  await db.execute(
    'INSERT INTO usuarios (nome, email, senha, nivel) VALUES (?, ?, ?, ?)',
    [nome, email, senhaHash, 'admin']
  );

  console.log('Administrador criado com sucesso.');
  process.exit(0);
}

criarAdmin().catch((error) => {
  console.error('Erro ao criar administrador:', error);
  process.exit(1);
});
