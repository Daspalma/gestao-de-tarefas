import { Pool } from "pg"
import dotenv from "dotenv"

dotenv.config()

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'senai',
    database: process.env.DB_NAME || 'gestao_tarefas',
    port: Number(process.env.DB_PORT) || 5432,
})

// Teste de conexão opcional / log amigável
pool.on('error', (err) => {
    console.error('Erro inesperado no cliente do PostgreSQL:', err)
})

export default pool
