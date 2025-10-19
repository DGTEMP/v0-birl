#!/data/data/com.termux/files/usr/bin/bash

# ============================================
# TheMystic Bot MD - Instalador para Termux
# marIA v1.1.0 - Secretária Virtual IA
# ============================================

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Funções de utilidade
print_header() {
    echo -e "${PURPLE}"
    echo "╔════════════════════════════════════════════════════════╗"
    echo "║                                                        ║"
    echo "║          TheMystic Bot MD - Instalador Termux         ║"
    echo "║              marIA v1.1.0 - IA Secretary               ║"
    echo "║                                                        ║"
    echo "╚════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

print_step() {
    echo -e "${CYAN}[PASSO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[OK]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERRO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[AVISO]${NC} $1"
}

print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

# Verificar se está rodando no Termux
check_termux() {
    if [ ! -d "/data/data/com.termux" ]; then
        print_error "Este script deve ser executado no Termux!"
        exit 1
    fi
    print_success "Ambiente Termux detectado"
}

# Atualizar pacotes do Termux
update_termux() {
    print_step "Atualizando pacotes do Termux..."
    pkg update -y
    pkg upgrade -y
    print_success "Pacotes atualizados"
}

# Instalar dependências básicas
install_basic_deps() {
    print_step "Instalando dependências básicas..."
    
    local packages=(
        "git"
        "nodejs"
        "python"
        "ffmpeg"
        "imagemagick"
        "wget"
        "curl"
        "libwebp"
        "libjpeg-turbo"
        "libpng"
        "libtiff"
        "giflib"
    )
    
    for package in "${packages[@]}"; do
        print_info "Instalando $package..."
        pkg install -y "$package" 2>/dev/null || print_warning "Falha ao instalar $package (pode já estar instalado)"
    done
    
    print_success "Dependências básicas instaladas"
}

# Configurar armazenamento
setup_storage() {
    print_step "Configurando acesso ao armazenamento..."
    
    if [ ! -d "$HOME/storage" ]; then
        termux-setup-storage
        print_success "Acesso ao armazenamento configurado"
    else
        print_info "Armazenamento já configurado"
    fi
}

# Verificar Node.js
check_nodejs() {
    print_step "Verificando Node.js..."
    
    if command -v node &> /dev/null; then
        local node_version=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
        print_info "Node.js versão: $(node -v)"
        
        if [ "$node_version" -lt 16 ]; then
            print_warning "Node.js versão antiga detectada. Atualizando..."
            pkg upgrade nodejs -y
        fi
        
        print_success "Node.js OK"
    else
        print_error "Node.js não encontrado!"
        exit 1
    fi
}

# Clonar repositório
clone_repository() {
    print_step "Clonando repositório..."
    
    local repo_url="https://github.com/SpyHacke/the.git"
    local bot_dir="$HOME/TheMystic-Bot"
    
    if [ -d "$bot_dir" ]; then
        print_warning "Diretório já existe. Deseja:"
        echo "1) Atualizar (git pull)"
        echo "2) Reinstalar (apagar e clonar novamente)"
        echo "3) Cancelar"
        read -p "Escolha (1/2/3): " choice
        
        case $choice in
            1)
                cd "$bot_dir"
                git pull
                print_success "Repositório atualizado"
                ;;
            2)
                rm -rf "$bot_dir"
                git clone "$repo_url" "$bot_dir"
                print_success "Repositório clonado"
                ;;
            3)
                print_info "Instalação cancelada"
                exit 0
                ;;
            *)
                print_error "Opção inválida"
                exit 1
                ;;
        esac
    else
        git clone "$repo_url" "$bot_dir"
        print_success "Repositório clonado"
    fi
    
    cd "$bot_dir"
}

# Instalar dependências npm
install_npm_deps() {
    print_step "Instalando dependências npm..."
    print_warning "Isso pode demorar alguns minutos no Termux..."
    
    # Configurar npm para Termux
    npm config set fetch-retry-mintimeout 20000
    npm config set fetch-retry-maxtimeout 120000
    
    # Instalar dependências
    npm install --no-optional 2>&1 | grep -v "deprecated" || true
    
    print_success "Dependências npm instaladas"
}

# Configurar bot
configure_bot() {
    print_step "Configurando bot..."
    
    # Criar diretórios necessários
    mkdir -p database
    mkdir -p MysticSession
    mkdir -p tmp
    
    # Verificar config.js
    if [ -f "config.js" ]; then
        print_info "Arquivo config.js encontrado"
        
        # Perguntar se quer configurar
        read -p "Deseja configurar o bot agora? (s/n): " configure_now
        
        if [ "$configure_now" = "s" ] || [ "$configure_now" = "S" ]; then
            node setup.js
        else
            print_info "Você pode configurar depois executando: node setup.js"
        fi
    else
        print_error "config.js não encontrado!"
    fi
    
    print_success "Configuração concluída"
}

# Criar scripts de inicialização
create_start_scripts() {
    print_step "Criando scripts de inicialização..."
    
    # Script para iniciar o bot
    cat > start.sh << 'EOF'
#!/data/data/com.termux/files/usr/bin/bash

echo "Iniciando TheMystic Bot MD..."
echo "marIA v1.1.0 - Secretária Virtual IA"
echo ""

# Verificar se está no diretório correto
if [ ! -f "index.js" ]; then
    echo "Erro: Execute este script no diretório do bot!"
    exit 1
fi

# Limpar cache se necessário
if [ "$1" = "--clear-cache" ]; then
    echo "Limpando cache..."
    rm -rf node_modules/.cache
    rm -rf tmp/*
fi

# Iniciar bot
node index.js
EOF

    chmod +x start.sh
    
    # Script para parar o bot
    cat > stop.sh << 'EOF'
#!/data/data/com.termux/files/usr/bin/bash

echo "Parando TheMystic Bot MD..."
pkill -f "node index.js"
echo "Bot parado!"
EOF

    chmod +x stop.sh
    
    # Script para reiniciar o bot
    cat > restart.sh << 'EOF'
#!/data/data/com.termux/files/usr/bin/bash

echo "Reiniciando TheMystic Bot MD..."
./stop.sh
sleep 2
./start.sh
EOF

    chmod +x restart.sh
    
    print_success "Scripts de inicialização criados"
}

# Otimizações para Termux
optimize_for_termux() {
    print_step "Aplicando otimizações para Termux..."
    
    # Criar arquivo de otimização
    cat > .termux-optimize << 'EOF'
# Otimizações para Termux
export NODE_OPTIONS="--max-old-space-size=512"
export UV_THREADPOOL_SIZE=4
EOF

    # Adicionar ao bashrc se não existir
    if ! grep -q ".termux-optimize" "$HOME/.bashrc"; then
        echo "source $PWD/.termux-optimize" >> "$HOME/.bashrc"
    fi
    
    print_success "Otimizações aplicadas"
}

# Verificar instalação
verify_installation() {
    print_step "Verificando instalação..."
    
    local errors=0
    
    # Verificar Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js não encontrado"
        ((errors++))
    else
        print_success "Node.js: $(node -v)"
    fi
    
    # Verificar npm
    if ! command -v npm &> /dev/null; then
        print_error "npm não encontrado"
        ((errors++))
    else
        print_success "npm: $(npm -v)"
    fi
    
    # Verificar FFmpeg
    if ! command -v ffmpeg &> /dev/null; then
        print_warning "FFmpeg não encontrado (algumas funcionalidades podem não funcionar)"
    else
        print_success "FFmpeg instalado"
    fi
    
    # Verificar arquivos principais
    local required_files=("index.js" "main.js" "config.js" "handler.js")
    for file in "${required_files[@]}"; do
        if [ ! -f "$file" ]; then
            print_error "Arquivo $file não encontrado"
            ((errors++))
        fi
    done
    
    # Verificar marIA
    if [ -f "lib/maria-nlp.js" ] && [ -f "plugins/maria-assistant.js" ]; then
        print_success "marIA v1.1.0 instalada"
    else
        print_warning "Arquivos da marIA não encontrados"
    fi
    
    # Verificar node_modules
    if [ -d "node_modules" ]; then
        print_success "Dependências instaladas"
    else
        print_error "node_modules não encontrado"
        ((errors++))
    fi
    
    if [ $errors -eq 0 ]; then
        print_success "Verificação concluída sem erros!"
        return 0
    else
        print_error "Verificação concluída com $errors erro(s)"
        return 1
    fi
}

# Mostrar informações finais
show_final_info() {
    echo ""
    echo -e "${GREEN}╔════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║                                                        ║${NC}"
    echo -e "${GREEN}║          Instalação Concluída com Sucesso!            ║${NC}"
    echo -e "${GREEN}║                                                        ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${CYAN}Como usar:${NC}"
    echo ""
    echo -e "  ${YELLOW}Iniciar o bot:${NC}"
    echo -e "    ./start.sh"
    echo ""
    echo -e "  ${YELLOW}Parar o bot:${NC}"
    echo -e "    ./stop.sh"
    echo ""
    echo -e "  ${YELLOW}Reiniciar o bot:${NC}"
    echo -e "    ./restart.sh"
    echo ""
    echo -e "  ${YELLOW}Configurar o bot:${NC}"
    echo -e "    node setup.js"
    echo ""
    echo -e "  ${YELLOW}Diagnosticar problemas:${NC}"
    echo -e "    node diagnose.js"
    echo ""
    echo -e "  ${YELLOW}Corrigir problemas:${NC}"
    echo -e "    node fix-bot.js"
    echo ""
    echo -e "${CYAN}Testar a marIA:${NC}"
    echo -e "  Envie para o bot: ${GREEN}.maria Olá${NC}"
    echo -e "  Ou: ${GREEN}.maria Preciso fazer compras hoje${NC}"
    echo ""
    echo -e "${CYAN}Documentação:${NC}"
    echo -e "  - QUICKSTART.md - Guia rápido"
    echo -e "  - docs/INSTALLATION.md - Instalação completa"
    echo -e "  - docs/MARIA_NLP_GUIDE.md - Guia da marIA"
    echo ""
    echo -e "${CYAN}Suporte:${NC}"
    echo -e "  GitHub: ${BLUE}https://github.com/SpyHacke/the${NC}"
    echo -e "  WhatsApp: ${BLUE}https://whatsapp.com/channel/0029Vaein6eInlqIsCXpDs3y${NC}"
    echo ""
    echo -e "${PURPLE}Desenvolvido com ❤️  - marIA v1.1.0${NC}"
    echo ""
}

# Função principal
main() {
    print_header
    
    # Verificar Termux
    check_termux
    
    # Atualizar Termux
    update_termux
    
    # Instalar dependências
    install_basic_deps
    
    # Configurar armazenamento
    setup_storage
    
    # Verificar Node.js
    check_nodejs
    
    # Clonar repositório
    clone_repository
    
    # Instalar dependências npm
    install_npm_deps
    
    # Configurar bot
    configure_bot
    
    # Criar scripts
    create_start_scripts
    
    # Otimizar para Termux
    optimize_for_termux
    
    # Verificar instalação
    if verify_installation; then
        show_final_info
    else
        print_error "Instalação concluída com erros. Execute 'node diagnose.js' para mais informações."
    fi
}

# Executar instalação
main
