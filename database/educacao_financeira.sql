CREATE DATABASE IF NOT EXISTS educacao_financeira
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE educacao_financeira;

CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(120) NOT NULL,
  email VARCHAR(120) NOT NULL UNIQUE,
  senha VARCHAR(255) NOT NULL,
  nivel ENUM('usuario', 'admin') NOT NULL DEFAULT 'usuario',
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS investimentos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(120) NOT NULL UNIQUE,
  categoria VARCHAR(40) NOT NULL,
  descricao VARCHAR(500) NOT NULL,
  ativo BOOLEAN NOT NULL DEFAULT TRUE,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS carteiras (
  usuario_id INT PRIMARY KEY,
  saldo_virtual DECIMAL(12,2) NOT NULL DEFAULT 10000.00,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_carteiras_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS simulacoes (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  investimento_id INT NOT NULL,
  valor DECIMAL(12,2) NOT NULL,
  resultado VARCHAR(500) NOT NULL,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_simulacoes_usuario_data (usuario_id, criado_em),
  CONSTRAINT fk_simulacoes_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  CONSTRAINT fk_simulacoes_investimento FOREIGN KEY (investimento_id) REFERENCES investimentos(id)
);

INSERT INTO investimentos (nome, categoria, descricao)
VALUES
  ('Ações — cenário educativo', 'Renda variável', 'Pratique alocação em ações sem usar cotações ou realizar operações reais.'),
  ('ETF — cenário educativo', 'Fundo de índice', 'Explore a ideia de diversificação por meio de uma categoria educativa.'),
  ('Renda fixa — cenário educativo', 'Renda fixa', 'Compare características gerais de investimentos de renda fixa.')
ON DUPLICATE KEY UPDATE categoria = VALUES(categoria), descricao = VALUES(descricao);
