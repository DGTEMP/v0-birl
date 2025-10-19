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

### Termux (Android)

\`\`\`bash
# 1. Instalar Termux do F-Droid (não use o da Play Store)
# Link: https://f-droid.org/packages/com.termux/

# 2. Executar instalador automático
curl -fsSL https://raw.githubusercontent.com/SpyHacke/the/main/install-termux.sh | bash

# 3. Ou instalar manualmente
pkg update -y && pkg upgrade -y
pkg install -y git nodejs python ffmpeg imagemagick
git clone https://github.com/SpyHacke/the.git TheMystic-Bot
cd TheMystic-Bot
npm install --no-optional
node setup.js

# 4. Iniciar o bot
./start.sh
\`\`\`

**Nota:** Para Termux, consulte o guia completo em `docs/TERMUX_GUIDE.md`

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
npm run termux     # Instalador para Termux
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

### Problemas no Termux

**Erro de memória:**
\`\`\`bash
export NODE_OPTIONS="--max-old-space-size=512"
npm start
\`\`\`

**Bot fecha sozinho:**
- Desative otimização de bateria para o Termux
- Mantenha o Termux aberto
- Use Termux:Boot para inicialização automática

**FFmpeg não funciona:**
\`\`\`bash
pkg install ffmpeg -y
\`\`\`

Consulte `docs/TERMUX_GUIDE.md` para mais detalhes.

## Suporte

- GitHub: https://github.com/SpyHacke/the
- Issues: https://github.com/SpyHacke/the/issues
- WhatsApp: https://whatsapp.com/channel/0029Vaein6eInlqIsCXpDs3y
