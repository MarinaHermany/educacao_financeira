import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const diretorio = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(diretorio, '../.env') });

export const ambiente = {
  port: Number(process.env.PORT || 3000),
  jwtSecret: process.env.JWT_SECRET,
  dbHost: process.env.DB_HOST || 'localhost',
  dbPort: Number(process.env.DB_PORT || 3306),
  dbUser: process.env.DB_USER || 'root',
  dbPassword: process.env.DB_PASSWORD || '',
  dbName: process.env.DB_NAME || 'educacao_financeira',
  adminNome: process.env.ADMIN_NOME || '',
  adminEmail: process.env.ADMIN_EMAIL || '',
  adminSenha: process.env.ADMIN_SENHA || '',
};
