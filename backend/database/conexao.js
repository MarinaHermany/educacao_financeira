import mysql2 from 'mysql2/promise';
import { ambiente } from '../config/ambiente.js';

const mysqlConfig = {
  host: ambiente.dbHost,
  port: ambiente.dbPort,
  user: ambiente.dbUser,
  password: ambiente.dbPassword,
  database: ambiente.dbName,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

let pool = null;

try {
  pool = mysql2.createPool(mysqlConfig);
} catch (error) {
  console.warn('MySQL indisponível. Usando modo fallback local.');
}

export const db = pool;
export const hasMysql = Boolean(pool);
