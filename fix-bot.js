import fs from "fs"
import { exec } from "child_process"
import { promisify } from "util"
import chalk from "chalk"
import readline from "readline"

const execAsync = promisify(exec)
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

const question = (query) => new Promise((resolve) => rl.question(query, resolve))

console.log(chalk.bold.cyan("\n=== CORRETOR AUTOMÁTICO DO BOT ===\n"))

let fixed = 0
let errors = 0

// 1. Verificar e instalar dependências
console.log(chalk.yellow("1. Verificando dependências..."))
try {
  if (!fs.existsSync("./node_modules")) {
    console.log(chalk.yellow("   Instalando dependências (isso pode demorar)..."))
    await execAsync("npm install")
    console.log(chalk.green("   ✓ Dependências instaladas"))
    fixed++
  } else {
    console.log(chalk.green("   ✓ node_modules existe"))
  }
} catch (error) {
  console.log(chalk.red("   ✗ Erro ao instalar dependências"))
  console.log(chalk.red(`   ${error.message}`))
  errors++
}

// 2. Criar pasta de sessão
console.log(chalk.yellow("\n2. Verificando pasta de sessão..."))
const sessionFolder = "./MysticSession"
if (!fs.existsSync(sessionFolder)) {
  fs.mkdirSync(sessionFolder, { recursive: true })
  console.log(chalk.green("   ✓ Pasta de sessão criada"))
  fixed++
} else {
  console.log(chalk.green("   ✓ Pasta de sessão existe"))
}

// 3. Criar pasta tmp
console.log(chalk.yellow("\n3. Verificando pasta tmp..."))
const tmpFolder = "./src/tmp"
if (!fs.existsSync(tmpFolder)) {
  fs.mkdirSync(tmpFolder, { recursive: true })
  console.log(chalk.green("   ✓ Pasta tmp criada"))
  fixed++
} else {
  console.log(chalk.green("   ✓ Pasta tmp existe"))
}

// 4. Verificar permissões de arquivos
console.log(chalk.yellow("\n4. Verificando permissões..."))
try {
  const filesToCheck = ["index.js", "main.js", "diagnose.js", "fix-bot.js"]
  for (const file of filesToCheck) {
    if (fs.existsSync(file)) {
      fs.chmodSync(file, "755")
    }
  }
  console.log(chalk.green("   ✓ Permissões ajustadas"))
  fixed++
} catch (error) {
  console.log(chalk.yellow("   ⚠ Não foi possível ajustar permissões (pode ser normal no Windows)"))
}

// 5. Verificar config.js
console.log(chalk.yellow("\n5. Verificando config.js..."))
try {
  const configContent = fs.readFileSync("config.js", "utf8")

  if (!configContent.includes("global.authFile")) {
    console.log(chalk.yellow("   Adicionando configuração authFile..."))
    const updatedConfig = configContent.replace(
      "global.owner = [",
      `global.authFile = 'MysticSession';\n\nglobal.owner = [`,
    )
    fs.writeFileSync("config.js", updatedConfig)
    console.log(chalk.green("   ✓ Configuração authFile adicionada"))
    fixed++
  } else {
    console.log(chalk.green("   ✓ config.js está OK"))
  }
} catch (error) {
  console.log(chalk.red("   ✗ Erro ao verificar config.js"))
  errors++
}

// 6. Limpar cache
console.log(chalk.yellow("\n6. Limpando cache..."))
try {
  if (fs.existsSync("./src/tmp")) {
    const files = fs.readdirSync("./src/tmp")
    for (const file of files) {
      fs.unlinkSync(`./src/tmp/${file}`)
    }
    console.log(chalk.green(`   ✓ ${files.length} arquivos temporários removidos`))
    fixed++
  }
} catch (error) {
  console.log(chalk.yellow("   ⚠ Não foi possível limpar cache"))
}

// 7. Verificar marIA
console.log(chalk.yellow("\n7. Verificando marIA..."))
const mariaFiles = [
  "lib/maria-nlp.js",
  "plugins/maria-assistant.js",
  "plugins/maria-lembrete.js",
  "plugins/maria-nota.js",
  "plugins/maria-tarefa.js",
]

let mariaOk = true
for (const file of mariaFiles) {
  if (!fs.existsSync(file)) {
    console.log(chalk.red(`   ✗ ${file} faltando`))
    mariaOk = false
    errors++
  }
}

if (mariaOk) {
  console.log(chalk.green("   ✓ Todos os arquivos da marIA estão presentes"))
} else {
  console.log(chalk.red("   ✗ Alguns arquivos da marIA estão faltando"))
  console.log(chalk.yellow("   Restaure os arquivos do repositório"))
}

// Resumo
console.log(chalk.bold.cyan("\n=== RESUMO DA CORREÇÃO ===\n"))
console.log(chalk.green(`✓ ${fixed} problemas corrigidos`))
if (errors > 0) {
  console.log(chalk.red(`✗ ${errors} problemas não puderam ser corrigidos automaticamente`))
}

if (errors === 0) {
  console.log(chalk.bold.green("\n✓ Bot corrigido com sucesso!"))
  console.log(chalk.white("\nVocê pode iniciar o bot com:"))
  console.log(chalk.cyan("   npm start"))
} else {
  console.log(chalk.bold.yellow("\n⚠ Alguns problemas precisam de atenção manual"))
  console.log(chalk.white("\nVerifique os erros acima e corrija manualmente"))
}

rl.close()
