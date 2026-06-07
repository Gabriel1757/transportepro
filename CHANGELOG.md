// Changelog do Projeto
// Registra melhorias e mudanças significativas

## [1.1.0] - 2025-01-07

### Adicionado
- ✅ Middleware de validação de entrada
- ✅ Tratamento centralizado de erros
- ✅ Logging estruturado de requisições
- ✅ Rate limiting (API geral + login)
- ✅ Documentação de deployment (DEPLOYMENT.md)
- ✅ Documentação de arquitetura (ARCHITECTURE.md)
- ✅ Documentação de segurança (SECURITY.md)
- ✅ Quick start guide
- ✅ Docker e Docker Compose
- ✅ Frontend server com Express
- ✅ Health checks
- ✅ Pool de conexões PostgreSQL
- ✅ Autenticação JWT melhorada

### Melhorado
- 🔧 Estrutura do projeto
- 🔧 Tratamento de erros (sem res.json() direto)
- 🔧 Validação de tipos em parâmetros
- 🔧 Configuração de ambiente centralizada
- 🔧 CORS configurável
- 🔧 package.json com metadados completos

### Segurança
- 🔒 Validação de todos inputs
- 🔒 SQL parameterizado (prepared statements)
- 🔒 Rate limiting
- 🔒 CORS restritivo
- 🔒 Logs sem exposição de dados sensíveis

## [1.0.0] - 2025-01-06

### Base
- Initial commit
- Setup básico Node.js/Express
- PostgreSQL integration
- JWT authentication
- Socket.io para real-time
- Frontend HTML estático

---

## Como Contribuir

1. Crie uma branch: `git checkout -b feature/nome`
2. Commit: `git commit -am 'Add feature'`
3. Push: `git push origin feature/nome`
4. Abra um Pull Request

---

## Versions
- **Latest**: 1.1.0
- **Stable**: 1.1.0
