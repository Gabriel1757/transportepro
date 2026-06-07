const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '.env.local') });
require('dotenv').config({ path: path.join(__dirname, '.env') });

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

// Middlewares
const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const { loginLimiter, apiLimiter } = require('./middleware/rateLimiter');
const { validateRegistration, validateLogin, validateEmbarque } = require('./middleware/validation');

// Config
const pool = require('./config/database');
const authRoutes = require('./authRoutes');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || '*',
    credentials: true
  }
});

// Middleware de segurança e parsing
app.use(logger);
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Rate limiting
app.use('/api/', apiLimiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Rotas
app.use('/api/auth', loginLimiter, authRoutes);

app.get('/api/usuarios', async (req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT id, nome, email, transportadora, cargo, salario FROM usuarios WHERE role = $1 ORDER BY nome ASC',
      ['motorista']
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

// Embarques
app.get('/api/embarques', async (req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT e.*, u.nome as motorista_nome FROM embarques e LEFT JOIN usuarios u ON e.usuario_id = u.id ORDER BY criado_em DESC'
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

app.post('/api/embarques', validateEmbarque, async (req, res, next) => {
  const { id, usuario_id, placa, transportadora, chassi, marca_modelo, cor, valor_veiculo, origem, destino, carga, peso, obs, status, data_viagem, hora_viagem } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO embarques (id, usuario_id, placa, transportadora, chassi, marca_modelo, cor, valor_veiculo, origem, destino, carga, peso, obs, status, data_viagem, hora_viagem)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) RETURNING *`,
      [id, usuario_id, placa, transportadora, chassi, marca_modelo, cor, valor_veiculo, origem, destino, carga, peso, obs, status || 'Saída', data_viagem, hora_viagem]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

// Documentos Fiscais
app.get('/api/documentos', async (req, res, next) => {
  try {
    const result = await pool.query('SELECT df.*, u.nome as emissor_nome FROM documentos_fiscais df LEFT JOIN usuarios u ON df.emissor_id = u.id ORDER BY criado_em DESC');
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

// Documentos por Usuário (Motorista)
app.get('/api/documentos/usuario/:userId', async (req, res, next) => {
  try {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ error: 'ID do usuário inválido' });
    }
    const result = await pool.query(
      `SELECT df.*, u.nome as emissor_nome FROM documentos_fiscais df 
       LEFT JOIN usuarios u ON df.emissor_id = u.id 
       LEFT JOIN embarques e ON df.embarque_id = e.id
       WHERE e.usuario_id = $1 OR df.emissor_id = $1 ORDER BY df.criado_em DESC`, [userId]);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

app.post('/api/documentos/emitir', async (req, res, next) => {
  let { embarque_id, tipo, chave_acesso, emissor_id, cfop, cst } = req.body;
  
  try {
    let finalEmissorId = (emissor_id && !isNaN(parseInt(emissor_id))) ? parseInt(emissor_id) : null;
    if (!finalEmissorId) {
      const adminResult = await pool.query("SELECT id FROM usuarios WHERE role = 'admin' LIMIT 1");
      finalEmissorId = adminResult.rows.length > 0 ? adminResult.rows[0].id : 1;
    }

    const finalEmbarqueId = (embarque_id && String(embarque_id).trim() !== "" && embarque_id !== "undefined" && embarque_id !== "null") 
      ? String(embarque_id).trim() 
      : null;

    if (!chave_acesso || String(chave_acesso).trim() === "") {
      return res.status(400).json({ error: 'O número do documento ou chave de acesso é obrigatório.' });
    }

    const result = await pool.query(
      'INSERT INTO documentos_fiscais (embarque_id, tipo, chave_acesso, emissor_id, cfop, cst) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [finalEmbarqueId, tipo || 'Lançamento', String(chave_acesso).trim(), finalEmissorId, cfop || null, cst || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

// Upload de Documento (Motorista)
app.post('/api/documentos/upload', async (req, res, next) => {
  const { embarque_id, tipo, chave_acesso, emissor_id, status } = req.body;
  try {
    let finalEmbarque = embarque_id;
    if (!finalEmbarque) {
      const lastEmb = await pool.query('SELECT id FROM embarques WHERE usuario_id = $1 ORDER BY criado_em DESC LIMIT 1', [emissor_id]);
      if (lastEmb.rows.length > 0) finalEmbarque = lastEmb.rows[0].id;
    }
    const result = await pool.query('INSERT INTO documentos_fiscais (embarque_id, tipo, chave_acesso, emissor_id, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [finalEmbarque, tipo, chave_acesso, emissor_id, status || 'Arquivado']);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

app.post('/api/usuarios', async (req, res, next) => {
  const { nome, email, transportadora, cargo, salario } = req.body;

  if (!nome || !email || nome.trim() === '' || email.trim() === '') {
    return res.status(400).json({ error: 'Nome e E-mail são obrigatórios.' });
  }

  try {
    const bcrypt = require('bcryptjs');
    const valorSalario = parseFloat(String(salario).replace(',', '.')) || 0;
    const senhaPadrao = await bcrypt.hash('123456', 10);
    const result = await pool.query(
      'INSERT INTO usuarios (nome, email, senha, transportadora, cargo, salario, role) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, nome, email',
      [nome, email, senhaPadrao, transportadora || 'Transporte PRO', cargo, valorSalario, 'motorista']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

app.put('/api/usuarios/:id', async (req, res, next) => {
  const { id } = req.params;
  const { cargo, salario } = req.body;
  
  const userId = parseInt(id);
  if (isNaN(userId)) {
    return res.status(400).json({ error: 'ID do usuário inválido' });
  }
  
  try {
    const valorSalario = parseFloat(String(salario).replace(',', '.')) || 0;
    await pool.query('UPDATE usuarios SET cargo = $1, salario = $2 WHERE id = $3', [cargo, valorSalario, userId]);
    res.json({ message: 'Dados do funcionário atualizados' });
  } catch (err) {
    next(err);
  }
});

app.get('/api/mensagens/:userId', async (req, res, next) => {
  const userId = parseInt(req.params.userId);
  
  if (isNaN(userId)) {
    return res.status(400).json({ error: 'ID do usuário inválido' });
  }
  
  try {
    const result = await pool.query(
      `SELECT id, texto, enviado_em,
       CASE WHEN remetente_id IS NULL THEN 'admin' ELSE CAST(remetente_id AS TEXT) END as remetente_id,
       CASE WHEN destinatario_id IS NULL THEN 'admin' ELSE CAST(destinatario_id AS TEXT) END as destinatario_id
       FROM mensagens 
       WHERE (remetente_id = $1 AND destinatario_id IS NULL) 
          OR (remetente_id IS NULL AND destinatario_id = $1)
       ORDER BY enviado_em ASC`,
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

// Middleware de tratamento de erros (deve ser o último)
app.use(errorHandler);

// Socket.io Logic
io.on('connection', (socket) => {
  console.log(`✅ Novo cliente conectado: ${socket.id}`);
  
  socket.on('join_room', (userId) => {
    socket.join(String(userId));
    console.log(`📍 Usuário ${userId} entrou na sala.`);
  });

  socket.on('send_message', async (data) => {
    const { remetente_id, destinatario_id, texto } = data;
    
    try {
      if (texto && (remetente_id || destinatario_id)) {
        await pool.query(
          'INSERT INTO mensagens (remetente_id, destinatario_id, texto, enviado_em) VALUES ($1, $2, $3, CURRENT_TIMESTAMP)',
          [remetente_id === 'admin' ? null : remetente_id, destinatario_id === 'admin' ? null : destinatario_id, texto]
        );
      }

      io.to(String(destinatario_id)).to(String(remetente_id)).emit('receive_message', { 
        ...data, 
        enviado_em: new Date() 
      });
    } catch (err) {
      console.error('❌ Erro ao salvar mensagem:', err);
    }
  });

  socket.on('disconnect', () => {
    console.log(`❌ Cliente desconectado: ${socket.id}`);
  });
});

// Início do Servidor
const PORT = process.env.PORT || 3001;

server.on('error', (e) => {
  if (e.code === 'EADDRINUSE') {
    console.error(`❌ Erro: A porta ${PORT} já está em uso.`);
    process.exit(1);
  } else {
    console.error('❌ Erro no servidor:', e);
    process.exit(1);
  }
});

server.listen(PORT, () => {
  console.log(`🚀 Servidor Transporte PRO rodando em http://localhost:${PORT}`);
});
