import express from 'express'
import cors from 'cors'
import bcrypt from 'bcryptjs'
import pool from './db.js'

const app = express()
const PORT = process.env.PORT || 3000

// Middlewares
app.use(express.json())
app.use(cors())
app.use(express.static('public'))

// ==========================================
// ROTAS DE AUTENTICAÇÃO (LOGIN E REGISTRO)
// ==========================================

// Rota de Registro de Usuário
app.post('/registro', async (req, res) => {
    const { nome, login, senha } = req.body

    try {
        if (!nome || !login || !senha) {
            return res.status(400).json({ erro: "Nome, login e senha são obrigatórios!" })
        }

        const salt = await bcrypt.genSalt(10)
        const senhaHashed = await bcrypt.hash(senha, salt)

        const resultado = await pool.query(
            'INSERT INTO usuario (nome, login, senha) VALUES ($1, $2, $3) RETURNING id, nome, login',
            [nome, login, senhaHashed]
        )

        return res.status(201).json(resultado.rows[0])
    } catch (erro) {
        console.error("Erro no registro:", erro.message)
        return res.status(500).json({ erro: "Erro ao cadastrar usuário. O login já pode estar em uso." })
    }
})

// Rota de Login
app.post('/login', async (req, res) => {
    const { login, senha } = req.body

    try {
        if (!login || !senha) {
            return res.status(400).json({ erro: "Preencha o login e a senha!" })
        }

        const resultado = await pool.query('SELECT * FROM usuario WHERE login = $1', [login])

        if (resultado.rows.length === 0) {
            return res.status(401).json({ erro: "Login ou senha inválidos." })
        }

        const usuario = resultado.rows[0]
        const senhaValida = await bcrypt.compare(senha, usuario.senha)

        if (!senhaValida) {
            return res.status(401).json({ erro: "Login ou senha inválidos." })
        }

        return res.status(200).json({
            mensagem: "Login realizado com sucesso.",
            user: {
                id: usuario.id,
                nome: usuario.nome,
                login: usuario.login
            }
        })
    } catch (erro) {
        console.error("Erro no login:", erro.message)
        return res.status(500).json({ erro: "Erro interno no servidor ao tentar logar." })
    }
})

// Listar Usuários (útil para dropdowns/selects)
app.get('/usuario', async (req, res) => {
    try {
        const resultado = await pool.query('SELECT id, nome, login FROM usuario ORDER BY nome')
        res.json(resultado.rows)
    } catch (erro) {
        console.error("Erro ao listar usuários:", erro.message)
        res.status(500).json({ erro: "Erro ao buscar usuários." })
    }
})

// ==========================================
// ROTAS DE TAREFAS (CRUD)
// ==========================================

// 1. Listar Tarefas
app.get('/tarefa', async (req, res) => {
    try {
        const resultado = await pool.query(`
            SELECT 
                tarefa.id,
                tarefa.titulo,
                tarefa.descricao,
                tarefa.status,
                tarefa.prioridade,
                TO_CHAR(tarefa.data_criacao, 'YYYY-MM-DD') AS data_criacao,
                tarefa.id_usuario,
                usuario.nome AS responsavel
            FROM tarefa
            LEFT JOIN usuario ON usuario.id = tarefa.id_usuario
            ORDER BY tarefa.id DESC
        `)
        res.json(resultado.rows)
    } catch (erro) {
        console.error("Erro ao listar tarefas:", erro.message)
        res.status(500).json({ erro: "Erro ao listar tarefas no banco de dados." })
    }
})

// 2. Criar Nova Tarefa
app.post('/tarefa', async (req, res) => {
    const { titulo, descricao, status, prioridade, id_usuario } = req.body

    try {
        if (!titulo) {
            return res.status(400).json({ erro: "O título da tarefa é obrigatório!" })
        }

        const novoRegistro = await pool.query(
            'INSERT INTO tarefa (titulo, descricao, status, prioridade, id_usuario) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [
                titulo,
                descricao || '',
                status || 'Pendente',
                prioridade || 'Média',
                id_usuario ? Number(id_usuario) : null
            ]
        )

        res.status(201).json(novoRegistro.rows[0])
    } catch (erro) {
        console.error("Erro ao criar tarefa:", erro.message)
        res.status(500).json({ erro: "Erro ao salvar tarefa no banco de dados." })
    }
})

// 3. Atualizar Tarefa
app.put('/tarefa/:id', async (req, res) => {
    const { id } = req.params
    const { titulo, descricao, status, prioridade, id_usuario } = req.body

    try {
        const resultado = await pool.query(
            'UPDATE tarefa SET titulo = $1, descricao = $2, status = $3, prioridade = $4, id_usuario = $5 WHERE id = $6 RETURNING *',
            [
                titulo,
                descricao || '',
                status || 'Pendente',
                prioridade || 'Média',
                id_usuario ? Number(id_usuario) : null,
                id
            ]
        )

        if (resultado.rows.length === 0) {
            return res.status(404).json({ erro: "Tarefa não encontrada." })
        }

        res.json(resultado.rows[0])
    } catch (erro) {
        console.error("Erro ao atualizar tarefa:", erro.message)
        res.status(500).json({ erro: "Erro ao atualizar tarefa." })
    }
})

// 4. Deletar Tarefa
app.delete('/tarefa/:id', async (req, res) => {
    const { id } = req.params

    try {
        const resultado = await pool.query('DELETE FROM tarefa WHERE id = $1 RETURNING *', [id])

        if (resultado.rows.length === 0) {
            return res.status(404).json({ erro: "Tarefa não encontrada." })
        }

        res.json({ mensagem: "Tarefa deletada com sucesso!", tarefa: resultado.rows[0] })
    } catch (erro) {
        console.error("Erro ao deletar tarefa:", erro.message)
        res.status(500).json({ erro: "Erro ao excluir tarefa." })
    }
})

// Iniciar Servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em: http://localhost:${PORT}`)
})
