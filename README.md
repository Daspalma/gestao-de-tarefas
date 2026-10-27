# Gestão de Tarefas (Prática SAEP)

Sistema simples e direto para gestão de tarefas e atividades de equipes, desenvolvido com arquitetura Node.js (Express), PostgreSQL e Frontend em HTML/CSS/JavaScript puro.

---

## 📁 Estrutura de Arquivos

```text
gestaodetarefas/
│
├── public/                 # Interface Web Simples e Direta
│   ├── css/
│   │   └── style.css       # Estilos visuais minimalistas e funcionais
│   ├── js/
│   │   ├── funcoes.js      # Função auxiliar (chamandoServer, boas-vindas, logout)
│   │   ├── login.js        # Lógica de login
│   │   ├── tarefas.js      # CRUD completo de tarefas
│   │   └── usuarios.js     # Gerenciamento de usuários
│   ├── index.html          # Dashboard inicial com resumo
│   ├── login.html          # Tela de login
│   ├── tarefas.html        # Cadastro e listagem de tarefas
│   └── usuarios.html       # Cadastro e listagem de usuários
│
├── db.js                   # Conexão com PostgreSQL (Pool pg)
├── server.js               # Servidor Express e rotas da API
├── sql.sql                 # Script SQL para criar banco e dados de teste
├── .env                    # Configuração de credenciais do banco
├── .env.example            # Exemplo de configuração
├── .gitignore              # Ignora node_modules e .env
└── package.json            # Dependências e scripts
```

---

## 🚀 Como Executar

### 1. Banco de Dados (PostgreSQL)
1. Crie o banco de dados no PostgreSQL:
   ```sql
   CREATE DATABASE gestao_tarefas;
   ```
2. Execute o conteúdo de [`sql.sql`](sql.sql).
3. Verifique se o seu usuário e senha no arquivo [`.env`](.env) estão corretos (padrão SENAI: `postgres` / `senai`).

### 2. Iniciar a Aplicação
No terminal do projeto:

```bash
npm run dev
```

Acesse no navegador: **`http://localhost:3000/login.html`**

---

## 🔑 Usuários para Teste

| Usuário | Login | Senha |
|---|---|---|
| Administrador | `admin` | `12345` |
| João Silva | `joao.silva` | `12345` |
| Maria Santos | `maria.santos` | `12345` |
| Carlos Oliveira | `carlos.oliveira` | `12345` |
