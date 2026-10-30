import dotenv from 'dotenv';

dotenv.config({ path: './backend/.env' });

export const ambiente = {
  port: Number(process.env.PORT || 3000),
  jwtSecret: process.env.JWT_SECRET || 'loja-jwt-secret-dev',
  dbHost: process.env.DB_HOST || 'localhost',
  dbPort: Number(process.env.DB_PORT || 3306),
  dbUser: process.env.DB_USER || 'root',
  dbPassword: process.env.DB_PASSWORD || '',
  dbName: process.env.DB_NAME || 'loja_jwt',
  adminNome: process.env.ADMIN_NOME || 'Admin Local',
  adminEmail: process.env.ADMIN_EMAIL || 'admin@loja.com',
  adminSenha: process.env.ADMIN_SENHA || 'Admin@123',
};
