-- 1. Caso precise criar o banco de dados primeiro:
-- CREATE DATABASE gestao_tarefas;

-- 2. Tabela de Usuários
CREATE TABLE IF NOT EXISTS usuario (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    login VARCHAR(100) NOT NULL UNIQUE,
    senha TEXT NOT NULL
);

-- 3. Tabela de Tarefas
CREATE TABLE IF NOT EXISTS tarefa (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    descricao TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'Pendente',
    prioridade VARCHAR(20) NOT NULL DEFAULT 'Média',
    data_criacao DATE NOT NULL DEFAULT CURRENT_DATE,
    id_usuario INT REFERENCES usuario(id) ON DELETE SET NULL
);

-- ===============================================
-- DADOS INICIAIS DE TESTE (Senha para ambos: 12345)
-- ===============================================

INSERT INTO usuario (nome, login, senha) VALUES
('Administrador', 'admin', '$2b$10$uFxiHZ8ozdAJLyd3PI9bWegYU8VvRQ/tduLSROcbgmiagII6Khpnq'),
('Usuario Teste', 'teste@gmail.com', '$2b$10$uFxiHZ8ozdAJLyd3PI9bWegYU8VvRQ/tduLSROcbgmiagII6Khpnq')
ON CONFLICT (login) DO NOTHING;

INSERT INTO tarefa (titulo, descricao, status, prioridade, data_criacao, id_usuario) VALUES
('Configurar ambiente de desenvolvimento', 'Instalar dependências e testar conexão com o banco.', 'Concluída', 'Alta', CURRENT_DATE, 1),
('Criar tela de login', 'Fazer formulário e conectar com a rota de autenticação.', 'Em Andamento', 'Alta', CURRENT_DATE, 1),
('Estilizar o sistema', 'Adicionar temas e ajustar espaçamento e botões.', 'Pendente', 'Média', CURRENT_DATE, 2);
