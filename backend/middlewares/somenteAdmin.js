export function somenteAdmin(req, res, next) {
  if (!req.usuario || req.usuario.nivel !== 'admin') {
    return res.status(403).json({ mensagem: 'Acesso restrito a administradores.' });
  }

  return next();
}
