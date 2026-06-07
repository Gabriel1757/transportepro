# 🚚 TransportePRO

Sistema de gestão de transporte e fretes com autenticação, rastreamento em tempo real e documentos fiscais.

## 📋 Pré-requisitos

- Node.js >= 16.x
- PostgreSQL >= 12
- npm ou yarn

## 🚀 Início Rápido (Desenvolvimento Local)

### 1. Clonar e Configurar

```bash
# Instalar dependências
cd back && npm install
cd ../front && npm install

# Configurar variáveis de ambiente
cp .env.example .env.local
# Editar .env.local com suas credenciais
```

### 2. Banco de Dados

```bash
# Criar banco de dados
psql -U postgres -f back/schema.sql

# Ou via URL (Linux/Mac)
psql postgres://user:password@localhost:5432 -f back/schema.sql
```

### 3. Iniciar o Projeto (Modo Desenvolvimento)

**Terminal 1 - Backend:**
```bash
cd back
npm run dev
# Servidor rodando em http://localhost:3001
```

**Terminal 2 - Frontend:**
```bash
cd front
npm start
# Acesse em http://localhost:3000
```

## 📦 Estrutura do Projeto

```
.
├── back/                    # API Node.js/Express
│   ├── index.js            # Servidor principal
│   ├── authController.js   # Autenticação
│   ├── authRoutes.js       # Rotas de auth
│   ├── schema.sql          # Schema do BD
│   └── package.json
├── front/                  # Frontend HTML
│   ├── admin.html          # Dashboard admin
│   ├── motorista.html      # Dashboard motorista
│   └── server.js           # Servidor estático
└── README.md
```

## 🔐 Segurança

- ✅ Senhas hasheadas com bcryptjs
- ✅ JWT para autenticação
- ✅ CORS configurado
- ✅ Validação de entrada (em implementação)
- ✅ Rate limiting (em implementação)

## 📚 API Endpoints

### Autenticação
- `POST /api/auth/registrar` - Cadastro de novo usuário
- `POST /api/auth/login` - Login

### Dados
- `GET /api/usuarios` - Listar motoristas
- `GET /api/embarques` - Listar embarques
- `POST /api/embarques` - Criar embarque
- `GET /api/documentos` - Listar documentos
- `POST /api/documentos/emitir` - Emitir documento fiscal

## 🐳 Docker (Produção)

```bash
# Build
docker-compose build

# Run
docker-compose up -d

# Logs
docker-compose logs -f
```

## 📖 Variáveis de Ambiente Importantes

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `DATABASE_URL` | Conexão PostgreSQL | `postgresql://user:pass@host/db` |
| `JWT_SECRET` | Chave JWT (256+ chars) | `(gere com segurança)` |
| `NODE_ENV` | Ambiente | `development` ou `production` |
| `PORT` | Porta do servidor | `3001` |
| `FRONTEND_URL` | URL frontend para CORS | `http://localhost:3000` |

## 🔧 Desenvolvimento

### Scripts Disponíveis

```bash
# Back
npm start              # Produção
npm run dev           # Desenvolvimento com nodemon

# Front  
npm start             # Servidor de desenvolvimento
npm run build         # Build para produção
```

## 📝 Licença

MIT

## 👥 Suporte

Para dúvidas ou bugs, abra uma issue no repositório.
