# Gestão de Tarefas - Estrutura Base Simplificada

Este projeto foi construído seguindo a mesma arquitetura do seu projeto anterior ([praticaSaep](https://github.com/VictorDiasQueiroz12/praticaSaep.git)), porém com uma **estrutura bem mais simples, limpa e comentada**, ideal para você entender cada parte e começar a modificar rapidamente.

---

## 📁 Estrutura do Projeto

```text
gestaodetarefas/
│
├── public/                 # Frontend (HTML, CSS e JS puro)
│   ├── css/
│   │   └── style.css       # Estilos visuais simples e modernos
│   ├── js/
│   │   ├── funcoes.js      # Função auxiliar (chamandoServer, logout, etc.)
│   │   ├── login.js        # Lógica da tela de login
│   │   └── tarefas.js      # CRUD completo de tarefas
│   ├── index.html          # Painel inicial / Dashboard
│   ├── login.html          # Página de login
│   └── tarefas.html        # Página com formulário e listagem
│
├── db.js                   # Conexão com o banco PostgreSQL (Pool pg)
├── server.js               # Servidor Express (API REST e arquivos estáticos)
├── sql.sql                 # Script SQL para criação das tabelas e dados de teste
├── .env                    # Configurações de ambiente (portas e credenciais do banco)
├── .env.example            # Modelo de configuração
├── .gitignore              # Arquivos ignorados pelo Git
└── package.json            # Dependências e scripts do Node.js
```

---

## 🚀 Como Executar o Projeto

### 1. Banco de Dados (PostgreSQL)
1. Abra o **pgAdmin** ou o terminal `psql`.
2. Crie o banco de dados (se ainda não existir):
   ```sql
   CREATE DATABASE gestao_tarefas;
   ```
3. Execute os comandos que estão no arquivo [`sql.sql`](sql.sql).
4. Verifique no arquivo [`.env`](.env) se o usuário e senha do PostgreSQL correspondem aos da sua máquina (padrão: `user: postgres`, `password: senai`, `port: 5432`).

### 2. Iniciar o Servidor
No terminal, execute:

```bash
npm run dev
```

O servidor iniciará em: **`http://localhost:3000`**

---

## 🔑 Credenciais Padrão para Teste

Ao acessar [`http://localhost:3000/login.html`](http://localhost:3000/login.html):

| Usuário | Login | Senha |
|---|---|---|
| Administrador | `admin` | `12345` |
| Usuário Teste | `teste@gmail.com` | `12345` |

---

## 🛠️ Como Personalizar ou Adicionar Novos Campos

- **Mudar colunas do banco:** Altere o arquivo [`sql.sql`](sql.sql).
- **Mudar rotas do backend:** Adicione ou edite as rotas em [`server.js`](server.js) (siga o mesmo padrão de `GET`, `POST`, `PUT`, `DELETE`).
- **Mudar os campos da tela:** Atualize os inputs em [`public/tarefas.html`](public/tarefas.html) e a leitura dos campos em [`public/js/tarefas.js`](public/js/tarefas.js).
