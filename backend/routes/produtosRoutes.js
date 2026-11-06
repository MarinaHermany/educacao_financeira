import express from 'express';

const router = express.Router();
router.use((req, res) => res.status(410).json({ mensagem: 'O catálogo comercial foi descontinuado.' }));
export default router;
