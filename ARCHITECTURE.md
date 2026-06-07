# 🏗️ Arquitetura e Estrutura do Projeto

## Estrutura de Diretórios

```
transportepro/
├── back/                          # Backend Node.js/Express
│   ├── config/
│   │   └── database.js            # Configuração do pool PostgreSQL
│   ├── middleware/
│   │   ├── auth.js                # JWT authentication
│   │   ├── errorHandler.js        # Tratamento de erros centralizado
│   │   ├── logger.js              # Logging de requisições
│   │   ├── rateLimiter.js         # Rate limiting
│   │   └── validation.js          # Validação de entrada
│   ├── index.js                   # Servidor principal
│   ├── authController.js          # Controller de autenticação
│   ├── authRoutes.js              # Rotas de autenticação
│   ├── schema.sql                 # Schema do banco de dados
│   ├── package.json
│   ├── nodemon.json
│   ├── .env.local                 # Dev local (gitignored)
│   └── .env.local.example         # Template para .env.local
├── front/                         # Frontend HTML/CSS/JS
│   ├── admin.html                 # Dashboard administrativo
│   ├── motorista.html             # Dashboard do motorista
│   ├── server.js                  # Servidor Express estático
│   └── package.json
├── Dockerfile                     # Build da imagem Docker
├── docker-compose.yml             # Orquestração de containers
├── .env.example                   # Template geral
├── .env.production                # Template para produção
├── .gitignore                     # Arquivos ignorados pelo Git
├── README.md                      # Documentação principal
├── DEPLOYMENT.md                  # Guia de deployment
├── ARCHITECTURE.md                # Este arquivo
├── start-dev.sh                   # Script para iniciar desenvolvimento
└── deploy.sh                      # Script para preparar deployment
```

## Stack Tecnológico

### Backend
- **Runtime**: Node.js 16+
- **Framework**: Express.js 4.18
- **Database**: PostgreSQL 12+
- **Autenticação**: JWT (jsonwebtoken)
- **Segurança**: bcryptjs (hash de senhas)
- **Real-time**: Socket.io 4.7
- **Rate Limiting**: express-rate-limit
- **Validação**: Middleware customizado

### Frontend
- **Markup**: HTML5
- **Styling**: Tailwind CSS (CDN)
- **Scripting**: Vanilla JavaScript
- **Real-time**: Socket.io cliente
- **Mapas**: Leaflet.js
- **Exportação**: jsPDF, XLSX

### DevOps
- **Containerização**: Docker
- **Orquestração**: Docker Compose
- **Reverse Proxy**: Nginx (recomendado)
- **SSL**: Let's Encrypt/Certbot
- **Process Manager**: PM2 (produçã o sem Docker)

## Fluxo de Dados

```
┌─────────────┐
│   Frontend  │  (admin.html / motorista.html)
│ (Porta 3000)│
└──────┬──────┘
       │ HTTP/WebSocket
       ▼
┌─────────────────┐
│  Express API    │ (Porta 3001)
│  - Routes       │
│  - Middleware   │
│  - Controllers  │
└────────┬────────┘
         │ SQL
         ▼
    ┌─────────┐
    │PostgreSQL│ (Porta 5432)
    └─────────┘
```

## Fluxo de Autenticação

```
1. Login/Registro (POST /api/auth/login)
   ├─ Validação de entrada
   ├─ Hash da senha (bcryptjs)
   ├─ Verificação no DB
   └─ JWT gerado

2. Requisição Autenticada
   ├─ Header: Authorization: Bearer <JWT>
   ├─ Verificação de token
   ├─ Extração de user info
   └─ Acesso permitido/negado

3. Token Expirado
   └─ Revalidar credenciais (novo login)
```

## Endpoints da API

### Autenticação
```
POST   /api/auth/registrar         # Novo usuário
POST   /api/auth/login             # Login e retorna JWT
```

### Usuários
```
GET    /api/usuarios               # Listar motoristas
POST   /api/usuarios               # Criar novo usuário (admin)
PUT    /api/usuarios/:id           # Atualizar usuário (admin)
```

### Embarques
```
GET    /api/embarques              # Listar todos
POST   /api/embarques              # Criar novo
```

### Documentos Fiscais
```
GET    /api/documentos             # Listar todos
GET    /api/documentos/usuario/:id # Documentos de um usuário
POST   /api/documentos/emitir      # Emitir novo documento
POST   /api/documentos/upload      # Upload de documento
```

### Mensagens
```
GET    /api/mensagens/:userId      # Chat de um usuário
```

### Health
```
GET    /health                     # Status da API
```

## Modelo de Dados

### Tabelas Principais

**usuarios**
```sql
id (BIGSERIAL)
├─ nome (VARCHAR)
├─ email (VARCHAR, UNIQUE)
├─ senha (VARCHAR)
├─ transportadora (VARCHAR)
├─ cargo (VARCHAR)
├─ salario (NUMERIC)
├─ role (VARCHAR: 'admin', 'motorista')
└─ criado_em (TIMESTAMP)
```

**embarques**
```sql
id (VARCHAR, PK)
├─ usuario_id (BIGINT, FK)
├─ placa (VARCHAR)
├─ transportadora (VARCHAR)
├─ origen (VARCHAR)
├─ destino (VARCHAR)
├─ data_viagem (DATE)
├─ status (VARCHAR)
└─ criado_em (TIMESTAMP)
```

**documentos_fiscais**
```sql
id (BIGSERIAL)
├─ embarque_id (VARCHAR, FK)
├─ tipo (VARCHAR: 'CT-e', 'MDF-e')
├─ chave_acesso (VARCHAR, UNIQUE)
├─ emissor_id (BIGINT, FK)
├─ status (VARCHAR)
└─ criado_em (TIMESTAMP)
```

## Middlewares

### Logger
- Registra todas as requisições HTTP
- Tempo de resposta
- Código de status
- IP do cliente

### Validação
- `validateRegistration` - Valida campos de cadastro
- `validateLogin` - Valida email e senha
- `validateEmbarque` - Valida dados de embarque

### Rate Limiting
- `loginLimiter` - 5 tentativas a cada 15 min
- `apiLimiter` - Configurável por ambiente

### Autenticação
- `authenticateToken` - Verifica JWT válido
- `requireAdmin` - Restringe ao role 'admin'

### Error Handler
- Centraliza tratamento de erros
- Logs estruturados
- Respostas padronizadas

## Segurança

### Implementado
✅ Hashing bcryptjs (senhas)
✅ JWT com expiração
✅ CORS configurável
✅ Rate limiting
✅ Validação de entrada
✅ SQL Parameterizado (prepared statements)
✅ Logging de erros

### Recomendações Adicionais
⚠️  Usar HTTPS em produção
⚠️  Helmet.js para headers de segurança
⚠️  Redis para rate limiting distribuído
⚠️  OWASP dependency checker
⚠️  Audit logs mais detalhados

## Performance

### Otimizações
- Pool de conexões PostgreSQL
- Índices no banco de dados
- Compressão Gzip (via Nginx)
- Caching estratégico
- Rate limiting

### Monitoramento
- Health checks
- Logs de performance
- Métricas de conexão DB
- Alertas de erro

## Escalabilidade

### Horizontal
- Múltiplas instâncias backend
- Load balancer
- Sessões em Redis (opcional)

### Vertical
- Pool de conexões aumentado
- Mais RAM/CPU
- Índices de BD otimizados

## Deployment

Veja [DEPLOYMENT.md](./DEPLOYMENT.md) para instruções completas:
- Desenvolvimento local
- Docker/Docker Compose
- Servidores tradicionais (PM2)
- Nginx reverse proxy
- SSL/TLS
