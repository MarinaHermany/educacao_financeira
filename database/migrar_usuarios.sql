-- Execute depois de database/educacao_financeira.sql se os usuários existentes
-- estiverem no banco antigo loja_jwt. A consulta preserva IDs e hashes de senha.
INSERT INTO educacao_financeira.usuarios (id, nome, email, senha, nivel, criado_em)
SELECT id, nome, email, senha, nivel, criado_em
FROM loja_jwt.usuarios
ON DUPLICATE KEY UPDATE
  nome = VALUES(nome),
  email = VALUES(email),
  senha = VALUES(senha),
  nivel = VALUES(nivel),
  criado_em = VALUES(criado_em);
