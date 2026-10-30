CREATE DATABASE IF NOT EXISTS loja_jwt;
USE loja_jwt;

CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(120) NOT NULL,
  email VARCHAR(120) NOT NULL UNIQUE,
  senha VARCHAR(255) NOT NULL,
  nivel ENUM('usuario', 'admin') NOT NULL DEFAULT 'usuario',
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS produtos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(120) NOT NULL,
  descricao TEXT,
  categoria VARCHAR(100),
  preco DECIMAL(10,2) NOT NULL,
  estoque INT NOT NULL DEFAULT 0,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO usuarios (nome, email, senha, nivel)
VALUES
  ('Usuário Demo', 'usuario@loja.com', '$2b$10$6UKSzB5HH5/KJSK.8Ij4fO.aymQJ6yNtZgvOBPuxavt90nfwZntYO', 'usuario'),
  ('Administrador Demo', 'admin@loja.com', '$2b$10$OfjX8L2p9osQSd0KeJINhuxj/UXxA2Hys1KscWs75eNJLPWcwI29G', 'admin')
ON DUPLICATE KEY UPDATE
  nome = VALUES(nome),
  senha = VALUES(senha),
  nivel = VALUES(nivel);

INSERT INTO produtos (nome, descricao, categoria, preco, estoque)
VALUES
  ('Notebook', 'Notebook para estudo e trabalho', 'Eletrônicos', 3499.99, 8),
  ('Mouse', 'Mouse sem fio confortável', 'Periféricos', 89.90, 20),
  ('Teclado', 'Teclado mecânico com iluminação', 'Periféricos', 189.90, 12),
  ('Monitor', 'Monitor Full HD 24 polegadas', 'Eletrônicos', 899.00, 5),
  ('Headset', 'Headset com microfone', 'Acessórios', 129.90, 15),
  ('Webcam', 'Webcam HD para reuniões', 'Acessórios', 159.90, 10)
ON DUPLICATE KEY UPDATE
  descricao = VALUES(descricao),
  categoria = VALUES(categoria),
  preco = VALUES(preco),
  estoque = VALUES(estoque);
