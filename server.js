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
// ROTAS DE AUTENTICAÇÃO
// ==========================================

// Login
app.post('/login', async (req, res) => {
    const { login, senha } = req.body

    try {
        if (!login || !senha) {
            return res.status(400).json({ erro: 'Informe login e senha!' })
        }

        const resultado = await pool.query('SELECT * FROM usuario WHERE login = $1', [login])

        if (resultado.rows.length === 0) {
            return res.status(401).json({ erro: 'Login ou senha inválidos.' })
        }

        const usuario = resultado.rows[0]
        const senhaCorreta = await bcrypt.compare(senha, usuario.senha)

        if (!senhaCorreta) {
            return res.status(401).json({ erro: 'Login ou senha inválidos.' })
        }

        res.json({
            mensagem: 'Login realizado com sucesso.',
            user: {
                id: usuario.id,
                nome: usuario.nome,
                login: usuario.login
            }
        })
    } catch (erro) {
        console.error('Erro no login:', erro.message)
        res.status(500).json({ erro: 'Erro interno ao realizar login.' })
    }
})

// Registro de Usuário
app.post('/registro', async (req, res) => {
    const { nome, login, senha } = req.body

    try {
        if (!nome || !login || !senha) {
            return res.status(400).json({ erro: 'Nome, login e senha são obrigatórios!' })
        }

        const salt = await bcrypt.genSalt(10)
        const senhaCriptografada = await bcrypt.hash(senha, salt)

        const resultado = await pool.query(
            'INSERT INTO usuario (nome, login, senha) VALUES ($1, $2, $3) RETURNING id, nome, login',
            [nome, login, senhaCriptografada]
        )

        res.status(201).json(resultado.rows[0])
    } catch (erro) {
        console.error('Erro no registro:', erro.message)
        res.status(500).json({ erro: 'Erro ao cadastrar usuário. Esse login já existe.' })
    }
})

// ==========================================
// ROTAS DE USUÁRIOS
// ==========================================

app.get('/usuario', async (req, res) => {
    try {
        const resultado = await pool.query('SELECT id, nome, login FROM usuario ORDER BY id')
        res.json(resultado.rows)
    } catch (erro) {
        console.error('Erro ao buscar usuários:', erro.message)
        res.status(500).json({ erro: 'Erro ao listar usuários.' })
    }
})

app.delete('/usuario/:id', async (req, res) => {
    const { id } = req.params
    try {
        await pool.query('DELETE FROM usuario WHERE id = $1', [id])
        res.json({ mensagem: 'Usuário removido com sucesso!' })
    } catch (erro) {
        console.error('Erro ao deletar usuário:', erro.message)
        res.status(500).json({ erro: 'Erro ao deletar usuário.' })
    }
})

// ==========================================
// ROTAS DE TAREFAS (CRUD COMPLETO)
// ==========================================

// Listar tarefas com nome do responsável
app.get('/tarefa', async (req, res) => {
    try {
        const resultado = await pool.query(`
            SELECT 
                tarefa.id,
                tarefa.titulo,
                tarefa.descricao,
                tarefa.setor,
                tarefa.prioridade,
                tarefa.status,
                TO_CHAR(tarefa.data_limite, 'YYYY-MM-DD') AS data_limite,
                tarefa.id_usuario,
                usuario.nome AS responsavel
            FROM tarefa
            LEFT JOIN usuario ON usuario.id = tarefa.id_usuario
            ORDER BY tarefa.id DESC
        `)
        res.json(resultado.rows)
    } catch (erro) {
        console.error('Erro ao listar tarefas:', erro.message)
        res.status(500).json({ erro: 'Erro ao listar tarefas.' })
    }
})

// Cadastrar nova tarefa
app.post('/tarefa', async (req, res) => {
    const { titulo, descricao, setor, prioridade, status, data_limite, id_usuario } = req.body

    try {
        if (!titulo) {
            return res.status(400).json({ erro: 'O título da tarefa é obrigatório!' })
        }

        const resultado = await pool.query(`
            INSERT INTO tarefa (titulo, descricao, setor, prioridade, status, data_limite, id_usuario)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *
        `, [
            titulo,
            descricao || '',
            setor || 'Geral',
            prioridade || 'Média',
            status || 'Pendente',
            data_limite || null,
            id_usuario ? Number(id_usuario) : null
        ])

        res.status(201).json(resultado.rows[0])
    } catch (erro) {
        console.error('Erro ao salvar tarefa:', erro.message)
        res.status(500).json({ erro: 'Erro ao cadastrar tarefa.' })
    }
})

// Atualizar tarefa existente
app.put('/tarefa/:id', async (req, res) => {
    const { id } = req.params
    const { titulo, descricao, setor, prioridade, status, data_limite, id_usuario } = req.body

    try {
        const resultado = await pool.query(`
            UPDATE tarefa 
            SET titulo = $1, descricao = $2, setor = $3, prioridade = $4, status = $5, data_limite = $6, id_usuario = $7
            WHERE id = $8
            RETURNING *
        `, [
            titulo,
            descricao || '',
            setor || 'Geral',
            prioridade || 'Média',
            status || 'Pendente',
            data_limite || null,
            id_usuario ? Number(id_usuario) : null,
            id
        ])

        if (resultado.rows.length === 0) {
            return res.status(404).json({ erro: 'Tarefa não encontrada.' })
        }

        res.json(resultado.rows[0])
    } catch (erro) {
        console.error('Erro ao atualizar tarefa:', erro.message)
        res.status(500).json({ erro: 'Erro ao atualizar tarefa.' })
    }
})

// Deletar tarefa
app.delete('/tarefa/:id', async (req, res) => {
    const { id } = req.params

    try {
        const resultado = await pool.query('DELETE FROM tarefa WHERE id = $1 RETURNING *', [id])

        if (resultado.rows.length === 0) {
            return res.status(404).json({ erro: 'Tarefa não encontrada.' })
        }

        res.json({ mensagem: 'Tarefa excluída com sucesso!' })
    } catch (erro) {
        console.error('Erro ao excluir tarefa:', erro.message)
        res.status(500).json({ erro: 'Erro ao excluir tarefa.' })
    }
})

// Rota de resumo para o Dashboard inicial
app.get('/resumo', async (req, res) => {
    try {
        const total = await pool.query('SELECT COUNT(*) FROM tarefa')
        const pendentes = await pool.query("SELECT COUNT(*) FROM tarefa WHERE status = 'Pendente'")
        const emAndamento = await pool.query("SELECT COUNT(*) FROM tarefa WHERE status = 'Em Andamento'")
        const concluidas = await pool.query("SELECT COUNT(*) FROM tarefa WHERE status = 'Concluída'")

        res.json({
            total: parseInt(total.rows[0].count),
            pendentes: parseInt(pendentes.rows[0].count),
            emAndamento: parseInt(emAndamento.rows[0].count),
            concluidas: parseInt(concluidas.rows[0].count)
        })
    } catch (erro) {
        console.error('Erro no resumo:', erro.message)
        res.status(500).json({ total: 0, pendentes: 0, emAndamento: 0, concluidas: 0 })
    }
})

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`)
})
