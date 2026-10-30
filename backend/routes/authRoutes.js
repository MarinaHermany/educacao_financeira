import express from 'express';
import { cadastrarUsuario, login, me } from '../controllers/authController.js';
import { autenticarToken } from '../middlewares/autenticarToken.js';

const router = express.Router();

router.post('/cadastro', cadastrarUsuario);
router.post('/login', login);
router.get('/me', autenticarToken, me);

export default router;
