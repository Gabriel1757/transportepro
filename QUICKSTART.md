# 🚀 Quick Start - TransportePRO

## ⚡ Desenvolvimento Local (Rápido)

### Passo 1: Preparar Ambiente
```bash
# Instalar dependências
cd back && npm install
cd ../front && npm install
```

### Passo 2: Banco de Dados
```bash
# Criar banco (local)
createdb transportepro

# Carregar schema
psql transportepro < back/schema.sql

# Ou em um container Docker
docker run --name transportepro-db -e POSTGRES_PASSWORD=password -e POSTGRES_DB=transportepro -d postgres:15
docker exec transportepro-db psql -U postgres -d transportepro -f /dev/stdin < back/schema.sql
```

### Passo 3: Variáveis de Ambiente
```bash
# Backend
cp back/.env.local.example back/.env.local
# Editar back/.env.local se necessário
```

### Passo 4: Iniciar

**Terminal 1:**
```bash
cd back
npm run dev
```

**Terminal 2:**
```bash
cd front
npm run dev
```

**Acesse:** http://localhost:3000

---

## 🐳 Com Docker (Recomendado para Produção)

```bash
# Build
docker-compose build

# Iniciar
docker-compose up -d

# Logs
docker-compose logs -f

# Parar
docker-compose down
```

**Acesse:** http://localhost:3001

---

## 📋 Credenciais de Teste

Use `.env.local` para configurar:

```
DATABASE_URL=postgresql://postgres:password@localhost:5432/transportepro
JWT_SECRET=dev-secret-change-me
NODE_ENV=development
PORT=3001
```

### Admin Padrão (crie no banco)
```sql
INSERT INTO usuarios (nome, email, senha, transportadora, role) 
VALUES ('Admin', 'admin@transp.com', 'hash', 'TransportePRO', 'admin');
```

---

## 🔍 Verificar Saúde da API

```bash
# Backend
curl http://localhost:3001/health

# Frontend
curl http://localhost:3000/health
```

---

## 📚 Documentação Completa

- [README.md](./README.md) - Visão geral
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deploy em produção
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Arquitetura da aplicação

---

## 🐛 Troubleshooting

### Erro: "EADDRINUSE :::3001"
```bash
# Porta em uso, usar outra:
PORT=3002 npm run dev
```

### Erro: "connection refused" no DB
```bash
# Verificar se PostgreSQL está rodando
psql -U postgres -d transportepro
```

### Erro: "JWT_SECRET não definido"
```bash
# Editar back/.env.local e adicionar JWT_SECRET
```

---

## ✅ Próximos Passos

1. Configure as variáveis do `.env.local`
2. Crie o banco de dados
3. Inicie o backend e frontend
4. Teste a API em http://localhost:3001/health
5. Acesse o dashboard em http://localhost:3000

**Dúvidas?** Consulte DEPLOYMENT.md para instruções detalhadas.
