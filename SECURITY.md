# 🔒 Segurança - TransportePRO

## Implementações de Segurança

### 1. Autenticação
✅ **JWT (JSON Web Tokens)**
- Tokens com expiração (24h padrão)
- Secret seguro (256+ caracteres em produção)
- Refresh automático necessário após expiração

✅ **Hash de Senhas**
- bcryptjs com salt rounds = 10
- Impossível recuperar senha original
- Senhas nunca armazenadas em texto plano

### 2. Autorização
✅ **Roles (Papéis)**
- `admin` - Acesso total
- `motorista` - Acesso limitado aos seus dados

✅ **Proteção de Rotas**
- Middleware `authenticateToken` em rotas protegidas
- Middleware `requireAdmin` para rotas administrativas

### 3. Validação
✅ **Input Validation**
- Email: Formato padrão
- Senha: Mínimo 8 caracteres
- Placa: Padrão brasileiro
- Data: ISO 8601 (YYYY-MM-DD)
- Números: Validação de tipo

✅ **Parametrização de Queries**
- Todas as queries usam prepared statements ($1, $2, etc.)
- Proteção contra SQL Injection

### 4. Rate Limiting
✅ **API Geral**
- 100 requisições por 15 minutos (padrão)
- Configurável via .env

✅ **Endpoint de Login**
- 5 tentativas a cada 15 minutos
- Proteção contra brute force

### 5. CORS
✅ **Cross-Origin Resource Sharing**
- Origin específico (via FRONTEND_URL)
- Credenciais habilitadas
- Headers customizados permitidos

### 6. Database
✅ **Constraints**
- Foreign keys para integridade referencial
- Unique constraints para email
- Not null constraints para campos críticos

✅ **Índices**
- Índices para queries frequentes
- Melhora performance e segurança

### 7. Logging
✅ **Auditoria**
- Todas requisições registradas
- Erros com stacktrace (dev apenas)
- IP do cliente capturado

---

## Recomendações Adicionais

### Curto Prazo (Implementar Agora)
```javascript
// 1. Helmet.js - Headers de segurança
npm install helmet

// No index.js:
const helmet = require('helmet');
app.use(helmet());
```

```javascript
// 2. Validação com Joi (mais robusta)
npm install joi

// Melhor que validação manual
```

### Médio Prazo
- [ ] HTTPS/SSL obrigatório
- [ ] Implementar CSRF tokens
- [ ] Adicionar 2FA (autenticação de dois fatores)
- [ ] Audit logs persistentes
- [ ] Backup automático encriptado

### Longo Prazo
- [ ] OAuth2 (Login com Google, Microsoft)
- [ ] Biometria em mobile
- [ ] DDD + Criptografia de dados sensíveis
- [ ] OWASP compliance scanning
- [ ] Penetration testing regular

---

## Checklist de Segurança para Produção

### Variáveis de Ambiente
- [ ] JWT_SECRET é aleatório (256+ chars)
- [ ] DATABASE_URL usa senha forte
- [ ] NODE_ENV=production
- [ ] Nenhuma secret em código/comentários

### Banco de Dados
- [ ] Backup automático configurado
- [ ] Senhas PostgreSQL fortes
- [ ] Acesso restrito (firewall)
- [ ] SSL/TLS entre app e DB

### API
- [ ] HTTPS/SSL habilitado
- [ ] CORS restrito a domínios conhecidos
- [ ] Rate limiting apropriado
- [ ] Logging centralizado
- [ ] Alertas para erros críticos

### Servidor
- [ ] Firewall habilitado
- [ ] Apenas portas necessárias abertas
- [ ] SSH sem password (chaves RSA)
- [ ] Falha2ban instalado
- [ ] Monitoramento de segurança

### Código
- [ ] Dependências atualizadas (npm audit)
- [ ] Sem console.log em produção
- [ ] Tratamento de erros completo
- [ ] Validação em todas entradas

---

## Scripts de Segurança

```bash
# Verificar vulnerabilidades
npm audit

# Forçar correção
npm audit fix

# Atualizar dependências
npm update

# Verificar segurança do código
# npm install -D snyk
snyk test
```

---

## Geração de JWT_SECRET Seguro

```bash
# Linux/Mac
openssl rand -base64 32

# Resultado exemplo:
# aBcDeFgHiJkLmNoPqRsTuVwXyZ1234567890+/=

# Windows (PowerShell)
[Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes((Get-Random -Count 32)))
```

---

## Relatório de Incidente

Caso encontre vulnerabilidade:

1. **Não publique** em issues públicas
2. Envie email para: security@seu-dominio.com
3. Inclua: descrição, passos para reproduzir, impacto
4. Aguarde resposta em 48h

---

## Referências

- [OWASP Top 10](https://owasp.org/Top10/)
- [Node.js Security Checklist](https://nodejs.org/en/docs/guides/security/)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)

