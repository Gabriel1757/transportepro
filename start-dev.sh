#!/bin/bash
# Script para iniciar o projeto em desenvolvimento local

set -e  # Sai em caso de erro

echo "🚀 Iniciando Transporte PRO em modo desenvolvimento..."

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js não está instalado${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js: $(node --version)${NC}"

# Verificar PostgreSQL
if ! command -v psql &> /dev/null; then
    echo -e "${YELLOW}⚠️  PostgreSQL CLI não encontrado - verifique a conexão manualmente${NC}"
fi

# Copiar .env.local se não existir
if [ ! -f back/.env.local ]; then
    echo -e "${YELLOW}📋 Copiando .env.local...${NC}"
    cp back/.env.local.example back/.env.local
    echo -e "${YELLOW}⚠️  Edite back/.env.local com suas credenciais!${NC}"
fi

# Instalar dependências (se não existir node_modules)
if [ ! -d "back/node_modules" ]; then
    echo -e "${GREEN}📦 Instalando dependências do backend...${NC}"
    cd back && npm install && cd ..
fi

if [ ! -d "front/node_modules" ]; then
    echo -e "${GREEN}📦 Instalando dependências do frontend...${NC}"
    cd front && npm install && cd ..
fi

echo -e "${GREEN}✅ Dependências instaladas${NC}"
echo ""
echo -e "${YELLOW}📍 Para iniciar o projeto, abra 2 terminais:${NC}"
echo -e "${YELLOW}Terminal 1 (Backend):${NC}"
echo -e "cd back && npm run dev"
echo ""
echo -e "${YELLOW}Terminal 2 (Frontend):${NC}"
echo -e "cd front && npm run dev"
echo ""
echo -e "${YELLOW}Depois acesse: http://localhost:3000${NC}"
