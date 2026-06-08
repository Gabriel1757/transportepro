// Carrega variáveis de ambiente (no Render, elas já estão no process.env)
require('dotenv').config(); 

const express = require('express');
const cors = require('cors');
const { pool } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Logs de depuração para o Deploy no Render
console.log('--- Diagnóstico de Inicialização ---');
console.log('Ambiente (NODE_ENV):', process.env.NODE_ENV);
console.log('Porta configurada:', PORT);

if (process.env.DATABASE_URL) {
    try {
        const url = new URL(process.env.DATABASE_URL);
        console.log(`Tentando conectar ao Host: ${url.host}`);
        console.log(`Banco de dados alvo: ${url.pathname.slice(1)}`);
    } catch (e) {
        console.error('❌ DATABASE_URL possui um formato inválido.');
    }
} else {
    console.error('❌ ERRO CRÍTICO: DATABASE_URL não definida nas variáveis de ambiente do Render.');
}

// Health Check com teste de banco de dados
app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ 
        status: 'ok', 
        database: 'connected', 
        environment: process.env.NODE_ENV,
        timestamp: new Date().toISOString() 
    });
  } catch (err) {
    res.status(500).json({ status: 'error', database: 'disconnected', details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Backend TransportePRO operacional na porta ${PORT}`);
});