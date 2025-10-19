import { spawn } from "child_process"
import chalk from "chalk"
import fs from "fs"

console.log(chalk.bold.cyan("\n=== INICIANDO BOT ===\n"))

// Verificação rápida
const criticalFiles = ["index.js", "main.js", "config.js", "handler.js"]
let canStart = true

for (const file of criticalFiles) {
  if (!fs.existsSync(file)) {
    console.log(chalk.red(`✗ Arquivo crítico faltando: ${file}`))
    canStart = false
  }
}

if (!canStart) {
  console.log(chalk.red("\n✗ Não é possível iniciar o bot. Execute primeiro:"))
  console.log(chalk.yellow("   node fix-bot.js"))
  process.exit(1)
}

console.log(chalk.green("✓ Verificação inicial OK"))
console.log(chalk.yellow("\nIniciando bot...\n"))

// Iniciar o bot
const bot = spawn("node", ["index.js"], {
  stdio: "inherit",
  shell: true,
})

bot.on("error", (error) => {
  console.log(chalk.red("\n✗ Erro ao iniciar o bot:"))
  console.log(chalk.red(error.message))
  process.exit(1)
})

bot.on("exit", (code) => {
  if (code !== 0) {
    console.log(chalk.red(`\n✗ Bot encerrado com código ${code}`))
    console.log(chalk.yellow("\nPara diagnosticar problemas, execute:"))
    console.log(chalk.cyan("   node diagnose.js"))
  }
  process.exit(code)
})

// Capturar sinais de interrupção
process.on("SIGINT", () => {
  console.log(chalk.yellow("\n\nEncerrando bot..."))
  bot.kill("SIGINT")
})

process.on("SIGTERM", () => {
  console.log(chalk.yellow("\n\nEncerrando bot..."))
  bot.kill("SIGTERM")
})
