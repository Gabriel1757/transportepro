/**
 * Configuração do Pool PostgreSQL
 */

const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: parseInt(process.env.DATABASE_POOL_MAX || 10),
  min: parseInt(process.env.DATABASE_POOL_MIN || 2),
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

// Event handlers
pool.on('error', (err) => {
  console.error('❌ Erro inesperado no PostgreSQL:', err);
  process.exit(1);
});

pool.on('connect', () => {
  console.log('✅ Nova conexão estabelecida com o banco de dados');
});

// Testa conexão ao iniciar
pool.query('SELECT NOW()', (err, result) => {
  if (err) {
    console.error('❌ Erro de conexão com o banco:', err.message);
    console.error('Verifique DATABASE_URL no .env.local');
  } else {
    console.log('✅ Conexão com o Banco de Dados estabelecida.');
  }
});

module.exports = pool;
