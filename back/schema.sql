CREATE DATABASE transportepro;

\c transportepro

-- Criação das tabelas para o Transporte PRO

CREATE TABLE usuarios (
    id BIGSERIAL PRIMARY KEY, -- Suporta bilhões de usuários
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    transportadora VARCHAR(100),
    cargo VARCHAR(100),
    salario NUMERIC(15, 2) DEFAULT 0,
    role VARCHAR(20) DEFAULT 'motorista', -- 'admin' ou 'motorista'
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE embarques (
    id VARCHAR(20) PRIMARY KEY, -- Ex: PDF-123456
    usuario_id BIGINT REFERENCES usuarios(id), -- Referência ao ID BIGINT
    placa VARCHAR(10) NOT NULL,
    transportadora VARCHAR(100),
    chassi VARCHAR(17), -- Campo obrigatório para CT-e de veículos
    marca_modelo VARCHAR(100),
    cor VARCHAR(30),
    valor_veiculo NUMERIC(15, 2) DEFAULT 0,
    origem VARCHAR(100) NOT NULL,
    destino VARCHAR(100) NOT NULL,
    carga VARCHAR(150),
    peso NUMERIC(10, 2),
    obs TEXT,
    status VARCHAR(50) DEFAULT 'Saída',
    data_viagem DATE NOT NULL,
    hora_viagem TIME NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE vistorias (
    id BIGSERIAL PRIMARY KEY,
    usuario_id BIGINT REFERENCES usuarios(id),
    placa VARCHAR(10) NOT NULL,
    data_vistoria DATE DEFAULT CURRENT_DATE,
    hora_vistoria TIME DEFAULT CURRENT_TIME,
    status VARCHAR(20), -- 'Aprovado' ou 'Atenção'
    itens_checagem JSONB, -- Checklist detalhado
    foto_url TEXT,
    observacoes TEXT
);

CREATE TABLE transacoes (
    id BIGSERIAL PRIMARY KEY,
    tipo VARCHAR(10), -- 'receita' ou 'despesa'
    categoria VARCHAR(50),
    descricao TEXT,
    valor NUMERIC(15, 2) NOT NULL,
    data_transacao DATE DEFAULT CURRENT_DATE
);

CREATE TABLE mensagens (
    id BIGSERIAL PRIMARY KEY,
    remetente_id BIGINT, -- ID do usuário (ou NULL para admin)
    destinatario_id BIGINT,
    texto TEXT NOT NULL,
    enviado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE documentos_fiscais (
    id BIGSERIAL PRIMARY KEY,
    embarque_id VARCHAR(20) REFERENCES embarques(id),
    tipo VARCHAR(10), -- 'CT-e' ou 'MDF-e'
    chave_acesso VARCHAR(44) UNIQUE NOT NULL,
    emissor_id BIGINT REFERENCES usuarios(id),
    cfop VARCHAR(4),
    cst VARCHAR(3),
    status VARCHAR(20) DEFAULT 'Autorizado',
    xml_path TEXT,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para busca rápida
CREATE INDEX idx_embarques_usuario ON embarques(usuario_id);
CREATE INDEX idx_embarques_data ON embarques(data_viagem);

-- COMANDOS PARA ATUALIZAÇÃO (Caso receba erro de "column does not exist"):
-- ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS cargo VARCHAR(100);
-- ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS salario NUMERIC(15, 2) DEFAULT 0;
-- ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'motorista';
-- Garantir permissão do admin:
-- UPDATE usuarios SET role = 'admin' WHERE email = 'admin@transp.com';