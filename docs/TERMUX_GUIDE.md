# Guia de Instalação no Termux

## Sobre o Termux

O Termux é um emulador de terminal Android que fornece um ambiente Linux. Este guia mostra como instalar e executar o TheMystic Bot MD com marIA v1.1.0 no seu dispositivo Android.

## Requisitos

### Hardware Mínimo
- **RAM:** 2GB (recomendado 4GB+)
- **Armazenamento:** 2GB livres
- **Android:** 7.0 ou superior
- **Processador:** Quad-core ou superior

### Software
- **Termux:** Baixe da F-Droid (não use o da Play Store)
  - Link: https://f-droid.org/packages/com.termux/
- **Conexão com internet:** WiFi recomendado para instalação

## Instalação Rápida

### Passo 1: Instalar Termux

1. Baixe o Termux do F-Droid
2. Instale o aplicativo
3. Abra o Termux

### Passo 2: Executar Instalador Automático

\`\`\`bash
# Baixar e executar o instalador
curl -fsSL https://raw.githubusercontent.com/SpyHacke/the/main/install-termux.sh | bash
\`\`\`

Ou manualmente:

\`\`\`bash
# Baixar o instalador
curl -O https://raw.githubusercontent.com/SpyHacke/the/main/install-termux.sh

# Dar permissão de execução
chmod +x install-termux.sh

# Executar
./install-termux.sh
\`\`\`

### Passo 3: Aguardar Instalação

A instalação pode demorar de 10 a 30 minutos dependendo da sua conexão e dispositivo.

## Instalação Manual

Se preferir instalar manualmente:

### 1. Atualizar Termux

\`\`\`bash
pkg update -y && pkg upgrade -y
\`\`\`

### 2. Instalar Dependências

\`\`\`bash
pkg install -y git nodejs python ffmpeg imagemagick wget curl libwebp libjpeg-turbo
\`\`\`

### 3. Configurar Armazenamento

\`\`\`bash
termux-setup-storage
\`\`\`

Aceite a permissão quando solicitado.

### 4. Clonar Repositório

\`\`\`bash
cd ~
git clone https://github.com/SpyHacke/the.git TheMystic-Bot
cd TheMystic-Bot
\`\`\`

### 5. Instalar Dependências npm

\`\`\`bash
npm install --no-optional
\`\`\`

### 6. Configurar Bot

\`\`\`bash
node setup.js
\`\`\`

## Usando o Bot

### Iniciar o Bot

\`\`\`bash
cd ~/TheMystic-Bot
./start.sh
\`\`\`

Ou:

\`\`\`bash
node index.js
\`\`\`

### Parar o Bot

\`\`\`bash
./stop.sh
\`\`\`

Ou pressione `Ctrl + C` no terminal.

### Reiniciar o Bot

\`\`\`bash
./restart.sh
\`\`\`

### Manter Bot Rodando em Background

Use o Termux:Boot ou mantenha o Termux aberto.

## Primeira Conexão

### Conectar com WhatsApp

1. Inicie o bot: `./start.sh`
2. Escolha o método de conexão:
   - **QR Code:** Escaneie com WhatsApp
   - **Código:** Digite seu número e use o código recebido

### Escanear QR Code

1. Abra WhatsApp no celular
2. Vá em **Configurações** > **Aparelhos conectados**
3. Toque em **Conectar um aparelho**
4. Escaneie o QR Code mostrado no Termux

## Testando a marIA

Envie mensagens para o bot:

\`\`\`
.menu
.maria Olá
.maria Preciso fazer compras hoje
.maria Tenho reunião amanhã às 14h
.maria Quais minhas tarefas?
\`\`\`

## Otimizações para Termux

### Limitar Uso de Memória

O instalador já configura automaticamente, mas você pode ajustar:

\`\`\`bash
export NODE_OPTIONS="--max-old-space-size=512"
\`\`\`

Para dispositivos com mais RAM (4GB+):

\`\`\`bash
export NODE_OPTIONS="--max-old-space-size=1024"
\`\`\`

### Limpar Cache

\`\`\`bash
./start.sh --clear-cache
\`\`\`

Ou manualmente:

\`\`\`bash
rm -rf node_modules/.cache
rm -rf tmp/*
\`\`\`

### Evitar Suspensão

1. Mantenha o Termux aberto
2. Desative otimização de bateria para o Termux:
   - Configurações > Aplicativos > Termux
   - Bateria > Sem restrições

## Solução de Problemas

### Bot não inicia

**Problema:** Erro ao iniciar o bot

**Solução:**
\`\`\`bash
# Verificar logs
node diagnose.js

# Tentar corrigir
node fix-bot.js

# Reinstalar dependências
rm -rf node_modules
npm install --no-optional
\`\`\`

### Erro de memória

**Problema:** "JavaScript heap out of memory"

**Solução:**
\`\`\`bash
# Reduzir uso de memória
export NODE_OPTIONS="--max-old-space-size=384"

# Fechar outros apps
# Reiniciar o Termux
\`\`\`

### FFmpeg não funciona

**Problema:** Comandos de áudio/vídeo não funcionam

**Solução:**
\`\`\`bash
pkg install ffmpeg -y
\`\`\`

### Bot desconecta

**Problema:** Bot desconecta frequentemente

**Solução:**
1. Mantenha o Termux aberto
2. Desative economia de bateria
3. Use WiFi estável
4. Verifique se o WhatsApp não está aberto em outro dispositivo

### Erro ao instalar dependências

**Problema:** npm install falha

**Solução:**
\`\`\`bash
# Limpar cache do npm
npm cache clean --force

# Tentar novamente
npm install --no-optional --legacy-peer-deps
\`\`\`

### Termux fecha sozinho

**Problema:** Termux fecha e o bot para

**Solução:**
1. Instale Termux:Boot (F-Droid)
2. Configure para iniciar automaticamente
3. Desative otimização de bateria
4. Use Termux:Widget para controle rápido

## Comandos Úteis

### Verificar Status

\`\`\`bash
# Ver processos do Node
ps aux | grep node

# Ver uso de memória
free -h

# Ver espaço em disco
df -h
\`\`\`

### Atualizar Bot

\`\`\`bash
cd ~/TheMystic-Bot
git pull
npm install
./restart.sh
\`\`\`

### Backup

\`\`\`bash
# Backup da sessão
tar -czf backup-session.tar.gz MysticSession/

# Backup do banco de dados
tar -czf backup-database.tar.gz database/

# Copiar para armazenamento
cp backup-*.tar.gz ~/storage/downloads/
\`\`\`

### Restaurar Backup

\`\`\`bash
# Restaurar sessão
tar -xzf backup-session.tar.gz

# Restaurar banco de dados
tar -xzf backup-database.tar.gz
\`\`\`

## Dicas de Performance

### 1. Fechar Apps Desnecessários

Feche outros aplicativos para liberar RAM.

### 2. Usar WiFi

WiFi é mais estável que dados móveis.

### 3. Manter Carregando

Mantenha o dispositivo carregando durante uso prolongado.

### 4. Limpar Cache Regularmente

\`\`\`bash
# Limpar cache do bot
rm -rf tmp/*
rm -rf node_modules/.cache

# Limpar cache do Termux
pkg clean
\`\`\`

### 5. Monitorar Recursos

\`\`\`bash
# Ver uso de CPU e memória
top

# Pressione 'q' para sair
\`\`\`

## Automação

### Iniciar Bot Automaticamente

1. Instale Termux:Boot
2. Crie script de inicialização:

\`\`\`bash
mkdir -p ~/.termux/boot
nano ~/.termux/boot/start-bot.sh
\`\`\`

Adicione:

\`\`\`bash
#!/data/data/com.termux/files/usr/bin/bash
cd ~/TheMystic-Bot
./start.sh
\`\`\`

Salve e dê permissão:

\`\`\`bash
chmod +x ~/.termux/boot/start-bot.sh
\`\`\`

### Widget para Controle Rápido

1. Instale Termux:Widget
2. Crie scripts em `~/.shortcuts/`:

\`\`\`bash
mkdir -p ~/.shortcuts

# Script para iniciar
echo "cd ~/TheMystic-Bot && ./start.sh" > ~/.shortcuts/start-bot.sh

# Script para parar
echo "cd ~/TheMystic-Bot && ./stop.sh" > ~/.shortcuts/stop-bot.sh

# Dar permissões
chmod +x ~/.shortcuts/*.sh
\`\`\`

## Recursos da marIA no Termux

A marIA funciona perfeitamente no Termux com todas as funcionalidades:

### Conversação Natural

\`\`\`
.maria Olá, bom dia!
.maria Preciso fazer compras hoje
.maria Tenho reunião amanhã às 14h
\`\`\`

### Gerenciamento de Tarefas

\`\`\`
.maria Adicionar tarefa: Estudar JavaScript
.maria Quais minhas tarefas?
.maria Terminei estudar JavaScript
\`\`\`

### Lembretes

\`\`\`
.maria Me lembra de ligar para o médico amanhã
.maria Ver meus lembretes
\`\`\`

### Notas

\`\`\`
.maria Anotar: Senha do WiFi é 12345
.maria Minhas notas
\`\`\`

## Limitações no Termux

### O que NÃO funciona bem:

1. **Comandos muito pesados:** Alguns comandos de IA podem ser lentos
2. **Múltiplos bots:** Rodar vários bots simultaneamente
3. **Processamento de vídeos grandes:** Limitado pela RAM

### O que funciona PERFEITAMENTE:

1. **marIA:** Todas as funcionalidades
2. **Comandos básicos:** Menu, info, ajuda
3. **Downloads:** Música, vídeo (tamanho moderado)
4. **Stickers:** Criação e conversão
5. **Jogos:** Todos os jogos funcionam
6. **Grupos:** Gerenciamento completo

## Suporte

### Problemas Comuns

Consulte: `node diagnose.js`

### Comunidade

- **GitHub:** https://github.com/SpyHacke/the
- **WhatsApp:** https://whatsapp.com/channel/0029Vaein6eInlqIsCXpDs3y
- **Issues:** https://github.com/SpyHacke/the/issues

### Logs

Ver logs detalhados:

\`\`\`bash
# Iniciar com logs
node index.js 2>&1 | tee bot.log

# Ver últimas linhas do log
tail -f bot.log
\`\`\`

## Conclusão

O TheMystic Bot MD com marIA v1.1.0 funciona perfeitamente no Termux! Siga este guia e você terá seu bot rodando no Android em poucos minutos.

**Dica Final:** Mantenha o Termux atualizado e o dispositivo com bateria suficiente para melhor experiência.

---

**Desenvolvido com ❤️ - marIA v1.1.0**

*Sua secretária virtual que entende você - Agora no seu Android!*
\`\`\`

```json file="" isHidden
