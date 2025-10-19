import readline from "readline"
import chalk from "chalk"
import fs from "fs"
import { execSync } from "child_process"

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

function question(query) {
  return new Promise((resolve) => rl.question(query, resolve))
}

async function setup() {
  console.log(chalk.cyan("\n╔════════════════════════════════════════════════════════╗"))
  console.log(chalk.cyan("║         MYSTIC BOT - CONFIGURAÇÃO INICIAL             ║"))
  console.log(chalk.cyan("╚════════════════════════════════════════════════════════╝\n"))

  console.log(chalk.yellow("Este assistente irá ajudá-lo a configurar o bot.\n"))

  // Check if already configured
  if (fs.existsSync("MysticSession/creds.json")) {
    const reconfigure = await question(chalk.yellow("Sessão existente detectada. Deseja reconfigurar? (s/n): "))
    if (reconfigure.toLowerCase() !== "s") {
      console.log(chalk.green("\nUsando configuração existente."))
      rl.close()
      return
    }
  }

  // Owner number
  console.log(chalk.blue("\n1. Configuração do Proprietário"))
  const ownerNumber = await question(
    chalk.white("Digite seu número de WhatsApp (com código do país, ex: 5519999999999): "),
  )

  // Bot name
  console.log(chalk.blue("\n2. Configuração do Bot"))
  const botName = (await question(chalk.white("Nome do bot (padrão: The Mystic Bot): "))) || "The Mystic Bot"

  // Prefix
  const prefix = (await question(chalk.white("Prefixo dos comandos (padrão: .): "))) || "."

  // Auto-read messages
  const autoRead = await question(chalk.white("Marcar mensagens como lidas automaticamente? (s/n): "))

  // Public mode
  const publicMode = await question(chalk.white("Modo público (qualquer um pode usar)? (s/n): "))

  // Update config.js
  console.log(chalk.blue("\n3. Atualizando configurações..."))

  let configContent = fs.readFileSync("config.js", "utf8")

  // Update owner
  configContent = configContent.replace(
    /global\.owner = \[[\s\S]*?\];/,
    `global.owner = [\n  ['${ownerNumber}', '👑 Proprietário 👑', true]\n];`,
  )

  // Update bot name
  configContent = configContent.replace(/global\.wm = '.*?';/, `global.wm = '${botName}';`)

  fs.writeFileSync("config.js", configContent)
  console.log(chalk.green("✓ Configurações atualizadas"))

  // Install dependencies if needed
  console.log(chalk.blue("\n4. Verificando dependências..."))
  try {
    execSync("npm list baileys", { stdio: "ignore" })
    console.log(chalk.green("✓ Dependências já instaladas"))
  } catch {
    console.log(chalk.yellow("Instalando dependências..."))
    execSync("npm install", { stdio: "inherit" })
    console.log(chalk.green("✓ Dependências instaladas"))
  }

  // Final instructions
  console.log(chalk.cyan("\n╔════════════════════════════════════════════════════════╗"))
  console.log(chalk.cyan("║              CONFIGURAÇÃO CONCLUÍDA!                   ║"))
  console.log(chalk.cyan("╚════════════════════════════════════════════════════════╝\n"))

  console.log(chalk.green("Para iniciar o bot, execute:"))
  console.log(chalk.white("  npm start\n"))

  console.log(chalk.green("Ou com PM2:"))
  console.log(chalk.white("  pm2 start index.js --name mystic-bot\n"))

  console.log(chalk.yellow("Comandos úteis da marIA:"))
  console.log(chalk.white("  .maria Olá"))
  console.log(chalk.white("  .maria Preciso fazer compras hoje"))
  console.log(chalk.white("  .maria Tenho reunião amanhã às 14h\n"))

  rl.close()
}

setup().catch(console.error)
