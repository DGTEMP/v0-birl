@echo off
chcp 65001 >nul
color 0D

echo.
echo ╔═══════════════════════════════════════════════════════════╗
echo ║                                                           ║
echo ║   ████████╗██╗  ██╗███████╗    ███╗   ███╗██╗   ██╗     ║
echo ║   ╚══██╔══╝██║  ██║██╔════╝    ████╗ ████║╚██╗ ██╔╝     ║
echo ║      ██║   ███████║█████╗      ██╔████╔██║ ╚████╔╝      ║
echo ║      ██║   ██╔══██║██╔══╝      ██║╚██╔╝██║  ╚██╔╝       ║
echo ║      ██║   ██║  ██║███████╗    ██║ ╚═╝ ██║   ██║        ║
echo ║      ╚═╝   ╚═╝  ╚═╝╚══════╝    ╚═╝     ╚═╝   ╚═╝        ║
echo ║                                                           ║
echo ║              MYSTIC BOT - AUTO INSTALLER                 ║
echo ║                  with marIA v1.1.0                       ║
echo ║                                                           ║
echo ╚═══════════════════════════════════════════════════════════╝
echo.

echo [*] Verificando Node.js...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [X] Node.js nao encontrado!
    echo [!] Por favor, instale Node.js de https://nodejs.org/
    echo [!] Versao recomendada: 18.x ou superior
    pause
    exit /b 1
) else (
    for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
    echo [OK] Node.js %NODE_VERSION% instalado
)

echo [*] Verificando npm...
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo [X] npm nao encontrado!
    pause
    exit /b 1
) else (
    for /f "tokens=*" %%i in ('npm -v') do set NPM_VERSION=%%i
    echo [OK] npm %NPM_VERSION% instalado
)

echo [*] Verificando Git...
where git >nul 2>nul
if %errorlevel% neq 0 (
    echo [!] Git nao encontrado
    echo [!] Recomendado instalar de https://git-scm.com/
) else (
    for /f "tokens=3" %%i in ('git --version') do set GIT_VERSION=%%i
    echo [OK] Git instalado
)

echo [*] Verificando FFmpeg...
where ffmpeg >nul 2>nul
if %errorlevel% neq 0 (
    echo [!] FFmpeg nao encontrado
    echo [!] Baixe de https://ffmpeg.org/download.html
    echo [!] E adicione ao PATH do sistema
) else (
    echo [OK] FFmpeg instalado
)

echo.
echo [*] Criando diretorios necessarios...
if not exist "MysticSession" mkdir MysticSession
if not exist "tmp" mkdir tmp
if not exist "database" mkdir database
echo [OK] Diretorios criados

echo.
echo [*] Instalando dependencias do Node.js...
echo [!] Isso pode levar alguns minutos...
echo.

npm install
if %errorlevel% neq 0 (
    echo [!] Erro ao instalar dependencias
    echo [*] Tentando com --legacy-peer-deps...
    npm install --legacy-peer-deps
    if %errorlevel% neq 0 (
        echo [X] Falha ao instalar dependencias
        pause
        exit /b 1
    )
)

echo [OK] Dependencias instaladas com sucesso

echo.
echo [*] Executando verificacao do sistema...
node lib/system-check.js
if %errorlevel% neq 0 (
    echo [!] Algumas verificacoes falharam, mas o bot pode funcionar
)

echo.
echo ╔═══════════════════════════════════════════════════════════╗
echo ║                                                           ║
echo ║              INSTALACAO CONCLUIDA COM SUCESSO!            ║
echo ║                                                           ║
echo ╚═══════════════════════════════════════════════════════════╝
echo.
echo [OK] Sistema verificado e pronto para uso!
echo.
echo [i] Para iniciar o bot, execute:
echo     npm start
echo.
echo [i] Para usar a marIA (secretaria IA):
echo     .maria Ola
echo     .maria Preciso fazer compras hoje
echo.
echo [!] Lembre-se de configurar o numero do owner em config.js
echo.
pause
