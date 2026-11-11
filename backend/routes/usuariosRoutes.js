import express from 'express';
import { listarUsuarios, alterarNivelUsuario, atualizarMeuUsuario } from '../controllers/usuariosController.js';
import { autenticarToken } from '../middlewares/autenticarToken.js';
import { somenteAdmin } from '../middlewares/somenteAdmin.js';

const router = express.Router();

router.put('/me', autenticarToken, atualizarMeuUsuario);
router.get('/', autenticarToken, somenteAdmin, listarUsuarios);
router.put('/:id/nivel', autenticarToken, somenteAdmin, alterarNivelUsuario);

export default router;
