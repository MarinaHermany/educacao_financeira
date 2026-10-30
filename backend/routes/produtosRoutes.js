import express from 'express';
import {
  listarProdutos,
  buscarProdutoPorId,
  cadastrarProduto,
  atualizarProduto,
  excluirProduto,
} from '../controllers/produtosController.js';
import { autenticarToken } from '../middlewares/autenticarToken.js';
import { somenteAdmin } from '../middlewares/somenteAdmin.js';

const router = express.Router();

router.get('/', autenticarToken, listarProdutos);
router.get('/:id', autenticarToken, buscarProdutoPorId);
router.post('/', autenticarToken, somenteAdmin, cadastrarProduto);
router.put('/:id', autenticarToken, somenteAdmin, atualizarProduto);
router.delete('/:id', autenticarToken, somenteAdmin, excluirProduto);

export default router;
