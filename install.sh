#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Banner
echo -e "${MAGENTA}"
cat << "EOF"
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   ████████╗██╗  ██╗███████╗    ███╗   ███╗██╗   ██╗     ║
║   ╚══██╔══╝██║  ██║██╔════╝    ████╗ ████║╚██╗ ██╔╝     ║
║      ██║   ███████║█████╗      ██╔████╔██║ ╚████╔╝      ║
║      ██║   ██╔══██║██╔══╝      ██║╚██╔╝██║  ╚██╔╝       ║
║      ██║   ██║  ██║███████╗    ██║ ╚═╝ ██║   ██║        ║
║      ╚═╝   ╚═╝  ╚═╝╚══════╝    ╚═╝     ╚═╝   ╚═╝        ║
║                                                           ║
║              MYSTIC BOT - AUTO INSTALLER                 ║
║                  with marIA v1.1.0                       ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

# Function to print colored messages
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_info() {
    echo -e "${CYAN}ℹ $1${NC}"
}

print_step() {
    echo -e "${BLUE}▶ $1${NC}"
}

# Check if running as root
if [ "$EUID" -eq 0 ]; then 
    print_warning "Não recomendado executar como root. Continue mesmo assim? (s/n)"
    read -r response
    if [[ ! "$response" =~ ^[Ss]$ ]]; then
        exit 1
    fi
fi

# Detect OS
print_step "Detectando sistema operacional..."
OS="unknown"
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    OS="linux"
    print_success "Sistema: Linux"
elif [[ "$OSTYPE" == "darwin"* ]]; then
    OS="mac"
    print_success "Sistema: macOS"
else
    print_error "Sistema operacional não suportado: $OSTYPE"
    exit 1
fi

# Check Node.js
print_step "Verificando Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v | cut -d'v' -f2)
    REQUIRED_VERSION="18.0.0"
    
    if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$NODE_VERSION" | sort -V | head -n1)" = "$REQUIRED_VERSION" ]; then
        print_success "Node.js $NODE_VERSION instalado"
    else
        print_error "Node.js versão $NODE_VERSION é muito antiga. Necessário >= $REQUIRED_VERSION"
        print_info "Instalando Node.js..."
        
        if [ "$OS" = "linux" ]; then
            curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
            sudo apt-get install -y nodejs
        elif [ "$OS" = "mac" ]; then
            brew install node
        fi
    fi
else
    print_warning "Node.js não encontrado. Instalando..."
    
    if [ "$OS" = "linux" ]; then
        curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
        sudo apt-get install -y nodejs
    elif [ "$OS" = "mac" ]; then
        if ! command -v brew &> /dev/null; then
            print_info "Instalando Homebrew..."
            /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
        fi
        brew install node
    fi
    
    print_success "Node.js instalado com sucesso"
fi

# Check npm
print_step "Verificando npm..."
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    print_success "npm $NPM_VERSION instalado"
else
    print_error "npm não encontrado"
    exit 1
fi

# Check Git
print_step "Verificando Git..."
if command -v git &> /dev/null; then
    GIT_VERSION=$(git --version | cut -d' ' -f3)
    print_success "Git $GIT_VERSION instalado"
else
    print_warning "Git não encontrado. Instalando..."
    
    if [ "$OS" = "linux" ]; then
        sudo apt-get update
        sudo apt-get install -y git
    elif [ "$OS" = "mac" ]; then
        brew install git
    fi
    
    print_success "Git instalado com sucesso"
fi

# Check FFmpeg
print_step "Verificando FFmpeg..."
if command -v ffmpeg &> /dev/null; then
    FFMPEG_VERSION=$(ffmpeg -version | head -n1 | cut -d' ' -f3)
    print_success "FFmpeg $FFMPEG_VERSION instalado"
else
    print_warning "FFmpeg não encontrado. Instalando..."
    
    if [ "$OS" = "linux" ]; then
        sudo apt-get update
        sudo apt-get install -y ffmpeg
    elif [ "$OS" = "mac" ]; then
        brew install ffmpeg
    fi
    
    print_success "FFmpeg instalado com sucesso"
fi

# Check ImageMagick
print_step "Verificando ImageMagick..."
if command -v convert &> /dev/null; then
    IMAGEMAGICK_VERSION=$(convert -version | head -n1 | cut -d' ' -f3)
    print_success "ImageMagick $IMAGEMAGICK_VERSION instalado"
else
    print_warning "ImageMagick não encontrado. Instalando..."
    
    if [ "$OS" = "linux" ]; then
        sudo apt-get update
        sudo apt-get install -y imagemagick
    elif [ "$OS" = "mac" ]; then
        brew install imagemagick
    fi
    
    print_success "ImageMagick instalado com sucesso"
fi

# Check system dependencies for canvas
print_step "Verificando dependências do sistema..."
if [ "$OS" = "linux" ]; then
    print_info "Instalando dependências do canvas..."
    sudo apt-get update
    sudo apt-get install -y build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev
    print_success "Dependências do sistema instaladas"
fi

# Check available memory
print_step "Verificando recursos do sistema..."
if [ "$OS" = "linux" ]; then
    TOTAL_MEM=$(free -m | awk 'NR==2{print $2}')
    print_info "Memória total: ${TOTAL_MEM}MB"
    
    if [ "$TOTAL_MEM" -lt 512 ]; then
        print_warning "Memória baixa detectada. O bot pode ter problemas de performance."
    else
        print_success "Memória suficiente disponível"
    fi
elif [ "$OS" = "mac" ]; then
    TOTAL_MEM=$(sysctl -n hw.memsize | awk '{print $0/1024/1024}')
    print_info "Memória total: ${TOTAL_MEM}MB"
    print_success "Memória suficiente disponível"
fi

# Check disk space
DISK_SPACE=$(df -h . | awk 'NR==2{print $4}')
print_info "Espaço em disco disponível: $DISK_SPACE"

# Install npm dependencies
print_step "Instalando dependências do Node.js..."
print_info "Isso pode levar alguns minutos..."

if npm install; then
    print_success "Dependências instaladas com sucesso"
else
    print_error "Erro ao instalar dependências"
    print_info "Tentando com --legacy-peer-deps..."
    
    if npm install --legacy-peer-deps; then
        print_success "Dependências instaladas com --legacy-peer-deps"
    else
        print_error "Falha ao instalar dependências"
        exit 1
    fi
fi

# Run system check
print_step "Executando verificação completa do sistema..."
if node lib/system-check.js; then
    print_success "Verificação do sistema concluída"
else
    print_warning "Algumas verificações falharam, mas o bot pode funcionar"
fi

# Create necessary directories
print_step "Criando diretórios necessários..."
mkdir -p MysticSession
mkdir -p tmp
mkdir -p database
print_success "Diretórios criados"

# Setup PM2 (optional)
print_step "Deseja instalar PM2 para gerenciamento de processos? (s/n)"
read -r install_pm2
if [[ "$install_pm2" =~ ^[Ss]$ ]]; then
    if command -v pm2 &> /dev/null; then
        print_success "PM2 já está instalado"
    else
        print_info "Instalando PM2..."
        npm install -g pm2
        print_success "PM2 instalado com sucesso"
    fi
fi

# Final summary
echo ""
echo -e "${GREEN}╔═══════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                                                           ║${NC}"
echo -e "${GREEN}║              INSTALAÇÃO CONCLUÍDA COM SUCESSO!            ║${NC}"
echo -e "${GREEN}║                                                           ║${NC}"
echo -e "${GREEN}╚═══════════════════════════════════════════════════════════╝${NC}"
echo ""
print_success "Sistema verificado e pronto para uso!"
echo ""
print_info "Para iniciar o bot, execute:"
echo -e "${CYAN}  npm start${NC}"
echo ""
print_info "Ou com PM2:"
echo -e "${CYAN}  pm2 start index.js --name mystic-bot${NC}"
echo ""
print_info "Para usar a marIA (secretária IA):"
echo -e "${CYAN}  .maria Olá${NC}"
echo -e "${CYAN}  .maria Preciso fazer compras hoje${NC}"
echo ""
print_warning "Lembre-se de configurar o número do owner em config.js"
echo ""
