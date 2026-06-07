const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const pool = require('./config/database');

exports.registrar = async (req, res, next) => {
    const { nome, email, senha, transportadora } = req.body;
    try {
        const senhaHash = await bcrypt.hash(senha, 10);
        const result = await pool.query(
            'INSERT INTO usuarios (nome, email, senha, transportadora, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, nome, email',
            [nome, email, senhaHash, transportadora, 'motorista']
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        if (err.code === '23505') {
            return res.status(409).json({ error: 'Este e-mail já está em uso.' });
        }
        next(err);
    }
};

exports.login = async (req, res, next) => {
    const { email, senha } = req.body;
    try {
        const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
        
        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Usuário não encontrado' });
        }

        const usuario = result.rows[0];
        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        
        if (!senhaValida) {
            return res.status(401).json({ error: 'Senha incorreta' });
        }

        const token = jwt.sign(
            { id: usuario.id, role: usuario.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: process.env.JWT_EXPIRATION || '24h' }
        );
        
        res.json({ 
            token, 
            user: { 
                id: usuario.id, 
                nome: usuario.nome, 
                email: usuario.email, 
                transportadora: usuario.transportadora,
                cargo: usuario.cargo,
                salario: usuario.salario,
                role: usuario.role
            } 
        });
    } catch (err) {
        next(err);
    }
};