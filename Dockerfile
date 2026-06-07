# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copiar package files
COPY back/package*.json ./back/
COPY front/package*.json ./front/

# Install dependencies
RUN cd back && npm ci --only=production && cd ..

# Production stage
FROM node:18-alpine

WORKDIR /app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Copiar arquivos necessários
COPY --from=builder /app/back/node_modules ./back/node_modules
COPY back ./back
COPY front ./front

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

EXPOSE 3001

ENV NODE_ENV=production

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "back/index.js"]
