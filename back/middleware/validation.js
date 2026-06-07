/**
 * Middleware de validação de entrada
 */

const validateRegistration = (req, res, next) => {
  const { nome, email, senha, transportadora } = req.body;

  const errors = [];

  if (!nome || typeof nome !== 'string' || nome.trim().length < 3) {
    errors.push('Nome deve ter pelo menos 3 caracteres');
  }

  if (!email || !isValidEmail(email)) {
    errors.push('Email inválido');
  }

  if (!senha || senha.length < 8) {
    errors.push('Senha deve ter pelo menos 8 caracteres');
  }

  if (!transportadora || typeof transportadora !== 'string' || transportadora.trim().length < 3) {
    errors.push('Transportadora inválida');
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

const validateLogin = (req, res, next) => {
  const { email, senha } = req.body;

  if (!email || !isValidEmail(email)) {
    return res.status(400).json({ error: 'Email inválido' });
  }

  if (!senha || senha.length < 8) {
    return res.status(400).json({ error: 'Senha inválida' });
  }

  next();
};

const validateEmbarque = (req, res, next) => {
  const { id, usuario_id, placa, origem, destino, data_viagem } = req.body;

  const errors = [];

  if (!id || typeof id !== 'string') {
    errors.push('ID do embarque é obrigatório');
  }

  if (!usuario_id || !Number.isInteger(usuario_id)) {
    errors.push('ID do usuário inválido');
  }

  if (!placa || !/^[A-Z]{3}-?[0-9]{4}$|^[A-Z]{3}[0-9]{1}[A-Z]{1}[0-9]{2}$/.test(placa)) {
    errors.push('Placa do veículo inválida');
  }

  if (!origem || typeof origem !== 'string' || origem.trim().length < 3) {
    errors.push('Origem inválida');
  }

  if (!destino || typeof destino !== 'string' || destino.trim().length < 3) {
    errors.push('Destino inválido');
  }

  if (!data_viagem || !isValidDate(data_viagem)) {
    errors.push('Data da viagem inválida');
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

// Funções auxiliares
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 100;
};

const isValidDate = (dateString) => {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date) && new Date(dateString).toISOString().split('T')[0] === dateString;
};

module.exports = {
  validateRegistration,
  validateLogin,
  validateEmbarque
};
