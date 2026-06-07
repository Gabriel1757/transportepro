# 📋 Guia de Deployment - TransportePRO

## Índice
1. [Desenvolvimento Local](#desenvolvimento-local)
2. [Deployment com Docker](#deployment-com-docker)
3. [Deployment Tradicional](#deployment-tradicional)
4. [Checklist de Produção](#checklist-de-produção)

---

## Desenvolvimento Local

### Pré-requisitos
- Node.js 16+ (`node --version`)
- PostgreSQL 12+ (`psql --version`)
- npm ou yarn

### Instalação Rápida

```bash
# 1. Configurar banco de dados
createdb transportepro
psql transportepro < back/schema.sql

# 2. Instalar dependências
cd back && npm install
cd ../front && npm install

# 3. Configurar variáveis (.env.local)
cp back/.env.local.example back/.env.local
# Editar DATABASE_URL, JWT_SECRET, etc.

# 4. Terminal 1 - Backend
cd back && npm run dev
# Deve exibir: "✅ Conexão com o Banco de Dados estabelecida"

# 5. Terminal 2 - Frontend  
cd front && npm run dev
# Acesse http://localhost:3000
```

### Verificar Conexão

```bash
# Testar Backend
curl http://localhost:3001/health

# Testar Frontend
curl http://localhost:3000/health
```

---

## Deployment com Docker

### Requisitos
- Docker 20.10+
- Docker Compose 2.0+

### Passo 1: Preparar Variáveis

```bash
# Copiar template
cp .env.production .env.prod.local

# Editar com valores reais
nano .env.prod.local
# - DATABASE_URL (servidor PostgreSQL)
# - JWT_SECRET (gerar: openssl rand -base64 32)
# - FRONTEND_URL (seu domínio)
```

### Passo 2: Build e Deploy

```bash
# Build das imagens
docker-compose build

# Iniciar containers
docker-compose up -d

# Verificar status
docker-compose ps

# Ver logs
docker-compose logs -f api
docker-compose logs -f postgres

# Parar
docker-compose down

# Parar e remover volumes
docker-compose down -v
```

### Passo 3: Validar Deploy

```bash
# Health check da API
curl http://localhost:3001/health

# Verificar banco de dados
docker exec transportepro-db psql -U transportepro -d transportepro -c "SELECT COUNT(*) FROM usuarios;"
```

---

## Deployment Tradicional (VM/Servidor)

### Pré-requisitos no Servidor
```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install nodejs npm postgresql postgresql-contrib git

# Verificar instalação
node --version
npm --version
psql --version
```

### Instalação

```bash
# 1. Clonar repositório
git clone <seu-repo> /opt/transportepro
cd /opt/transportepro

# 2. Instalar dependências
cd back && npm install --production
cd ../front && npm install --production

# 3. Configurar banco de dados
sudo -u postgres createdb transportepro
sudo -u postgres psql transportepro < back/schema.sql

# 4. Configurar variáveis
cp .env.production .env
nano .env  # Editar valores

# 5. Usar PM2 para gerenciar processo
sudo npm install -g pm2
pm2 start back/index.js --name "transportepro-api" --env production
pm2 start front/server.js --name "transportepro-front" --env production
pm2 startup
pm2 save
```

### Nginx como Reverse Proxy

```nginx
# /etc/nginx/sites-available/transportepro

upstream api {
    server 127.0.0.1:3001;
}

upstream frontend {
    server 127.0.0.1:3000;
}

server {
    listen 80;
    server_name seu-dominio.com;

    location /api {
        proxy_pass http://api;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location / {
        proxy_pass http://frontend;
    }
}
```

```bash
# Habilitar site
sudo ln -s /etc/nginx/sites-available/transportepro /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### SSL com Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d seu-dominio.com
```

---

## Checklist de Produção

### Segurança
- [ ] JWT_SECRET é uma string de 256+ caracteres aleatória
- [ ] DATABASE_URL usa credenciais fortes
- [ ] FRONTEND_URL está definido com domínio correto
- [ ] Firewall bloqueia portas não necessárias (apenas 80, 443)
- [ ] SSL/TLS certificado instalado
- [ ] Headers de segurança configurados

### Performance
- [ ] DATABASE_POOL_MAX ajustado (recomendado 20-50)
- [ ] RATE_LIMIT_MAX_REQUESTS configurado apropriadamente
- [ ] Compressão Gzip habilitada no Nginx
- [ ] Caching configurado

### Monitoramento
- [ ] Logs sendo armazenados
- [ ] Health checks monitorados
- [ ] Alertas configurados (uptime/errors)
- [ ] Backup do banco automático

### Escalabilidade
- [ ] Load balancer se múltiplas instâncias
- [ ] Redis para rate limiting (opcional)
- [ ] CDN para arquivos estáticos
- [ ] Banco de dados separado

---

## Troubleshooting

### Erro: Porta já em uso
```bash
# Encontrar processo usando porta
sudo lsof -i :3001

# Matar processo
sudo kill -9 <PID>
```

### Erro: Conexão com banco recusada
```bash
# Verificar se PostgreSQL está rodando
sudo systemctl status postgresql

# Testar conexão
psql -U postgres -h localhost -d transportepro
```

### Erro: JWT_SECRET inválido
```bash
# Gerar novo secret
openssl rand -base64 32
# Atualizar em .env
```

### Logs do Docker
```bash
# Ver todos os logs
docker-compose logs

# Ver logs de um serviço específico
docker-compose logs -f postgres
docker-compose logs -f api

# Últimas 100 linhas
docker-compose logs --tail=100
```

---

## Backup e Restore

### Backup
```bash
# Backup manual do banco
pg_dump transportepro > backup.sql

# Backup com Docker
docker exec transportepro-db pg_dump -U transportepro transportepro > backup.sql

# Backup com data no nome
docker exec transportepro-db pg_dump -U transportepro transportepro > backup_$(date +%Y%m%d_%H%M%S).sql
```

### Restore
```bash
# De um arquivo SQL
psql transportepro < backup.sql

# Com Docker
docker exec -i transportepro-db psql -U transportepro transportepro < backup.sql
```

---

## Atualizações

```bash
# Parar aplicação
docker-compose down

# Atualizar código
git pull origin main

# Rebuild se houver mudanças no package.json
docker-compose build

# Reiniciar
docker-compose up -d

# Verificar status
docker-compose ps
```

---

## Referências
- [Docker Docs](https://docs.docker.com/)
- [Node.js Best Practices](https://nodejs.org/en/docs/guides/nodejs-performance-best-practices/)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
