#!/bin/bash
# Script para preparar deployment em produção

set -e

echo "🚀 Preparando para deployment..."

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Verificar variáveis de ambiente
if [ ! -f ".env.production" ]; then
    echo -e "${RED}❌ .env.production não encontrado${NC}"
    echo "Crie um arquivo .env.production com as variáveis necessárias:"
    echo "  - DATABASE_URL (PostgreSQL em produção)"
    echo "  - JWT_SECRET (chave segura de 256+ caracteres)"
    echo "  - NODE_ENV=production"
    echo "  - PORT=3001"
    exit 1
fi

echo -e "${GREEN}✅ Arquivo .env.production encontrado${NC}"

# Verificar Docker
if ! command -v docker &> /dev/null; then
    echo -e "${YELLOW}⚠️  Docker não instalado - instal de recomendado para deployment${NC}"
fi

# Verificar Docker Compose
if ! command -v docker-compose &> /dev/null; then
    echo -e "${YELLOW}⚠️  Docker Compose não instalado${NC}"
fi

echo ""
echo -e "${YELLOW}📋 Checklist de deployment:${NC}"
echo "[ ] Variáveis de ambiente configuradas"
echo "[ ] Database PostgreSQL preparada"
echo "[ ] JWT_SECRET gerado com segurança"
echo "[ ] CORS_ORIGIN configurado corretamente"
echo "[ ] Backup do banco de dados"
echo ""
echo -e "${GREEN}✅ Pronto para fazer build com Docker${NC}"
echo ""
echo -e "${YELLOW}Próximos passos:${NC}"
echo "1. Revisar variáveis em .env.production"
echo "2. Executar: docker-compose build"
echo "3. Executar: docker-compose up -d"
echo "4. Verificar logs: docker-compose logs -f"
