import express from 'express';
import cors from 'cors';
import { ambiente } from './config/ambiente.js';
import authRoutes from './routes/authRoutes.js';
import usuariosRoutes from './routes/usuariosRoutes.js';
import educacaoRoutes from './routes/educacaoRoutes.js';

const app = express();

if (!ambiente.jwtSecret || ambiente.jwtSecret.length < 32) {
  throw new Error('Configure JWT_SECRET com pelo menos 32 caracteres em backend/.env.');
}

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({
    nome: 'trilha-financeira',
    status: 'online',
    mensagem: 'API da Trilha Financeira funcionando.',
  });
});

app.use('/auth', authRoutes);
app.use('/usuarios', usuariosRoutes);
app.use('/', educacaoRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ mensagem: 'Erro interno do servidor.' });
});

app.listen(ambiente.port, () => {
  console.log(`API executando em http://localhost:${ambiente.port}`);
});
