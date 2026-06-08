const { Pool } = require('pg');
require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';

// No Render, a variável DATABASE_URL é a forma correta de conexão.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // O Render exige SSL para conexões externas ao banco de dados gerenciado.
  ssl: isProduction ? { rejectUnauthorized: false } : false,
});

pool.on('connect', () => {
  console.log('✅ Conexão com o Pool do PostgreSQL estabelecida com sucesso');
});

pool.on('error', (err) => {
  console.error('❌ Erro inesperado no cliente do banco de dados:', err);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};