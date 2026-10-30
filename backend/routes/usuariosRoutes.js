import express from 'express';
import { listarUsuarios, alterarNivelUsuario } from '../controllers/usuariosController.js';
import { autenticarToken } from '../middlewares/autenticarToken.js';
import { somenteAdmin } from '../middlewares/somenteAdmin.js';

const router = express.Router();

router.get('/', autenticarToken, somenteAdmin, listarUsuarios);
router.put('/:id/nivel', autenticarToken, somenteAdmin, alterarNivelUsuario);

export default router;
