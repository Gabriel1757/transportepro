/**
 * Middleware centralizado de tratamento de erros
 * Segue as melhores práticas OpenAI para Node.js
 */

const errorHandler = (err, req, res, next) => {
  // Log de erro
  const errorLog = {
    timestamp: new Date().toISOString(),
    method: req.method,
    path: req.path,
    status: err.status || 500,
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  };

  console.error('❌ ERROR:', JSON.stringify(errorLog, null, 2));

  // Erros conhecidos
  if (err.status) {
    return res.status(err.status).json({
      error: err.message,
      code: err.code
    });
  }

  // Erro de banco de dados
  if (err.code === '23505') {
    return res.status(409).json({
      error: 'Dado duplicado encontrado',
      code: 'DUPLICATE_ENTRY'
    });
  }

  if (err.code === '23503') {
    return res.status(400).json({
      error: 'Referência inválida no banco de dados',
      code: 'INVALID_REFERENCE'
    });
  }

  // Erro padrão
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production' 
      ? 'Erro interno do servidor' 
      : err.message,
    code: 'INTERNAL_ERROR'
  });
};

module.exports = errorHandler;
