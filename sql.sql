-- Banco de Dados: gestao_tarefas
-- Caso necessário criar o banco primeiro:
-- CREATE DATABASE gestao_tarefas;

-- 1. TABELA DE USUÁRIOS
CREATE TABLE IF NOT EXISTS usuario (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    login VARCHAR(100) NOT NULL UNIQUE,
    senha TEXT NOT NULL
);

-- 2. TABELA DE TAREFAS
CREATE TABLE IF NOT EXISTS tarefa (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    descricao TEXT,
    setor VARCHAR(50) NOT NULL DEFAULT 'Geral',
    prioridade VARCHAR(20) NOT NULL DEFAULT 'Média',
    status VARCHAR(30) NOT NULL DEFAULT 'Pendente',
    data_limite DATE,
    id_usuario INT REFERENCES usuario(id) ON DELETE SET NULL
);

-- ===============================================
-- DADOS INICIAIS DE TESTE (Senha para todos: 12345)
-- ===============================================

INSERT INTO usuario (nome, login, senha) VALUES
('Administrador', 'admin', '$2b$10$uFxiHZ8ozdAJLyd3PI9bWegYU8VvRQ/tduLSROcbgmiagII6Khpnq'),
('João Silva', 'joao.silva', '$2b$10$uFxiHZ8ozdAJLyd3PI9bWegYU8VvRQ/tduLSROcbgmiagII6Khpnq'),
('Maria Santos', 'maria.santos', '$2b$10$uFxiHZ8ozdAJLyd3PI9bWegYU8VvRQ/tduLSROcbgmiagII6Khpnq'),
('Carlos Oliveira', 'carlos.oliveira', '$2b$10$uFxiHZ8ozdAJLyd3PI9bWegYU8VvRQ/tduLSROcbgmiagII6Khpnq')
ON CONFLICT (login) DO NOTHING;

-- TAREFAS INICIAIS
INSERT INTO tarefa (titulo, descricao, setor, prioridade, status, data_limite, id_usuario) VALUES
('Configurar Servidor de Produção', 'Realizar a instalação e testes dos serviços no ambiente de nuvem.', 'Infraestrutura', 'Alta', 'Em Andamento', '2026-11-05', 1),
('Criar Telas do Módulo Financeiro', 'Desenvolver os formulários de entrada e saída de despesas.', 'Desenvolvimento', 'Média', 'Pendente', '2026-11-10', 2),
('Revisão das Políticas de Segurança', 'Auditar os logs de acesso e revisar permissões de usuários.', 'Segurança', 'Alta', 'Pendente', '2026-11-02', 1),
('Atualizar Documentação da API', 'Documentar novos endpoints no Swagger e gerar arquivos PDF.', 'Documentação', 'Baixa', 'Concluída', '2026-10-25', 3),
('Treinamento da Equipe de Suporte', 'Apresentar as novas rotinas de atendimento e triagem de chamados.', 'Suporte', 'Média', 'Em Andamento', '2026-11-08', 4),
('Backup Geral do Banco de Dados', 'Exportar dump completo e testar processo de restauração.', 'Banco de Dados', 'Alta', 'Concluída', '2026-10-26', 1);
