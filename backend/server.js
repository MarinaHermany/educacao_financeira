import express from 'express';
import cors from 'cors';
import { ambiente } from './config/ambiente.js';
import authRoutes from './routes/authRoutes.js';
import produtosRoutes from './routes/produtosRoutes.js';
import usuariosRoutes from './routes/usuariosRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({
    nome: 'loja-jwt',
    status: 'online',
    mensagem: 'API da loja JWT funcionando.',
  });
});

app.use('/auth', authRoutes);
app.use('/produtos', produtosRoutes);
app.use('/usuarios', usuariosRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ mensagem: 'Erro interno do servidor.' });
});

app.listen(ambiente.port, () => {
  console.log(`API executando em http://localhost:${ambiente.port}`);
});
