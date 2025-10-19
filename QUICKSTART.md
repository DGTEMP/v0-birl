# Guia Rápido de Instalação

## Instalação Automática (Recomendado)

### Linux/macOS

\`\`\`bash
# 1. Clone o repositório
git clone https://github.com/SpyHacke/the.git
cd the

# 2. Execute o corretor automático
node fix-bot.js

# 3. Inicie o bot
npm start
\`\`\`

### Windows

\`\`\`cmd
# 1. Clone o repositório
git clone https://github.com/SpyHacke/the.git
cd the

# 2. Execute o corretor automático
node fix-bot.js

# 3. Inicie o bot
npm start
\`\`\`

## Diagnóstico de Problemas

Se o bot não iniciar, execute o diagnóstico:

\`\`\`bash
node diagnose.js
\`\`\`

O diagnóstico irá verificar:
- Arquivos essenciais
- Node.js e npm
- Dependências instaladas
- FFmpeg (opcional)
- Configurações

## Correção Automática

Para corrigir problemas automaticamente:

\`\`\`bash
node fix-bot.js
\`\`\`

O corretor irá:
- Instalar dependências faltando
- Criar pastas necessárias
- Ajustar permissões
- Verificar configurações
- Limpar cache

## Comandos Disponíveis

\`\`\`bash
npm start          # Iniciar o bot (recomendado)
npm run bot        # Iniciar o bot diretamente
npm run diagnose   # Diagnosticar problemas
npm run fix        # Corrigir problemas automaticamente
npm run setup      # Configuração interativa
npm run check      # Verificar sistema
\`\`\`

## Primeira Conexão

Ao iniciar pela primeira vez:

1. Escolha o método de conexão:
   - Opção 1: QR Code (mais fácil)
   - Opção 2: Código de 8 dígitos

2. Para QR Code:
   - Abra WhatsApp no celular
   - Vá em Configurações > Aparelhos conectados
   - Escaneie o QR Code

3. Para código:
   - Digite seu número com código do país
   - Você receberá um código no WhatsApp
   - Digite o código no terminal

## Testando a marIA

Após conectar, envie para o bot:

\`\`\`
.maria Olá
.maria Preciso fazer compras hoje
.maria Quais minhas tarefas?
\`\`\`

## Problemas Comuns

### Erro: "Cannot find module"
\`\`\`bash
npm install
\`\`\`

### Erro: "Permission denied"
\`\`\`bash
chmod +x *.js
\`\`\`

### Bot desconecta
\`\`\`bash
# Use PM2 para auto-restart
npm install -g pm2
pm2 start index.js --name mystic-bot
\`\`\`

## Suporte

- GitHub: https://github.com/SpyHacke/the
- Issues: https://github.com/SpyHacke/the/issues
