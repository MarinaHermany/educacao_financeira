import express from 'express';
import { autenticarToken } from '../middlewares/autenticarToken.js';
import { listarInvestimentos, obterInicio, listarSimulacoes, registrarSimulacao, atualizarSimulacao, excluirSimulacao } from '../controllers/educacaoController.js';

const router = express.Router();
router.use(autenticarToken);
router.get('/inicio', obterInicio);
router.get('/investimentos', listarInvestimentos);
router.get('/simulacoes', listarSimulacoes);
router.post('/simulacoes', registrarSimulacao);
router.put('/simulacoes/:id', atualizarSimulacao);
router.delete('/simulacoes/:id', excluirSimulacao);
export default router;
