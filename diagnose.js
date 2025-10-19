import fs from "fs"
import { exec } from "child_process"
import { promisify } from "util"
import chalk from "chalk"

const execAsync = promisify(exec)

console.log(chalk.bold.cyan("\n=== DIAGNÓSTICO DO BOT ===\n"))

const checks = {
  files: [],
  dependencies: [],
  system: [],
  errors: [],
}

// Verificar arquivos essenciais
const essentialFiles = [
  "index.js",
  "main.js",
  "config.js",
  "handler.js",
  "package.json",
  "lib/maria-nlp.js",
  "plugins/maria-assistant.js",
  "lib/system-check.js",
]

console.log(chalk.yellow("1. Verificando arquivos essenciais..."))
for (const file of essentialFiles) {
  const exists = fs.existsSync(file)
  if (exists) {
    console.log(chalk.green(`   ✓ ${file}`))
    checks.files.push({ file, status: "ok" })
  } else {
    console.log(chalk.red(`   ✗ ${file} - FALTANDO`))
    checks.files.push({ file, status: "missing" })
    checks.errors.push(`Arquivo faltando: ${file}`)
  }
}

// Verificar Node.js
console.log(chalk.yellow("\n2. Verificando Node.js..."))
try {
  const { stdout } = await execAsync("node --version")
  const version = stdout.trim()
  const majorVersion = Number.parseInt(version.replace("v", "").split(".")[0])

  if (majorVersion >= 18) {
    console.log(chalk.green(`   ✓ Node.js ${version}`))
    checks.system.push({ check: "Node.js", status: "ok", version })
  } else {
    console.log(chalk.red(`   ✗ Node.js ${version} - Versão muito antiga (requer >= 18)`))
    checks.system.push({ check: "Node.js", status: "outdated", version })
    checks.errors.push(`Node.js versão ${version} é muito antiga. Instale versão 18 ou superior.`)
  }
} catch (error) {
  console.log(chalk.red("   ✗ Node.js não encontrado"))
  checks.errors.push("Node.js não está instalado")
}

// Verificar npm
console.log(chalk.yellow("\n3. Verificando npm..."))
try {
  const { stdout } = await execAsync("npm --version")
  console.log(chalk.green(`   ✓ npm ${stdout.trim()}`))
  checks.system.push({ check: "npm", status: "ok", version: stdout.trim() })
} catch (error) {
  console.log(chalk.red("   ✗ npm não encontrado"))
  checks.errors.push("npm não está instalado")
}

// Verificar dependências instaladas
console.log(chalk.yellow("\n4. Verificando dependências..."))
const criticalDeps = ["baileys", "chalk", "lowdb", "express", "axios"]

for (const dep of criticalDeps) {
  try {
    const depPath = `./node_modules/${dep}`
    if (fs.existsSync(depPath)) {
      console.log(chalk.green(`   ✓ ${dep}`))
      checks.dependencies.push({ dep, status: "installed" })
    } else {
      console.log(chalk.red(`   ✗ ${dep} - NÃO INSTALADO`))
      checks.dependencies.push({ dep, status: "missing" })
      checks.errors.push(`Dependência faltando: ${dep}`)
    }
  } catch (error) {
    console.log(chalk.red(`   ✗ ${dep} - ERRO`))
    checks.dependencies.push({ dep, status: "error" })
  }
}

// Verificar FFmpeg
console.log(chalk.yellow("\n5. Verificando FFmpeg..."))
try {
  await execAsync("ffmpeg -version")
  console.log(chalk.green("   ✓ FFmpeg instalado"))
  checks.system.push({ check: "FFmpeg", status: "ok" })
} catch (error) {
  console.log(chalk.yellow("   ⚠ FFmpeg não encontrado (opcional mas recomendado)"))
  checks.system.push({ check: "FFmpeg", status: "missing" })
}

// Verificar pasta de sessão
console.log(chalk.yellow("\n6. Verificando pasta de sessão..."))
const sessionFolder = "./MysticSession"
if (fs.existsSync(sessionFolder)) {
  const files = fs.readdirSync(sessionFolder)
  console.log(chalk.green(`   ✓ Pasta de sessão existe (${files.length} arquivos)`))
  checks.system.push({ check: "Session folder", status: "ok", files: files.length })
} else {
  console.log(chalk.yellow("   ⚠ Pasta de sessão não existe (será criada no primeiro uso)"))
  checks.system.push({ check: "Session folder", status: "will-create" })
}

// Verificar config.js
console.log(chalk.yellow("\n7. Verificando configurações..."))
try {
  const configContent = fs.readFileSync("config.js", "utf8")

  if (configContent.includes("global.owner")) {
    console.log(chalk.green("   ✓ Configuração de owner encontrada"))
  } else {
    console.log(chalk.yellow("   ⚠ Configuração de owner pode estar incompleta"))
    checks.errors.push("Configure o número do owner em config.js")
  }

  if (configContent.includes("global.authFile")) {
    console.log(chalk.green("   ✓ Configuração de authFile encontrada"))
  } else {
    console.log(chalk.red("   ✗ Configuração de authFile faltando"))
    checks.errors.push("Configuração authFile faltando em config.js")
  }
} catch (error) {
  console.log(chalk.red("   ✗ Erro ao ler config.js"))
  checks.errors.push("Não foi possível ler config.js")
}

// Resumo
console.log(chalk.bold.cyan("\n=== RESUMO DO DIAGNÓSTICO ===\n"))

const filesOk = checks.files.filter((f) => f.status === "ok").length
const filesMissing = checks.files.filter((f) => f.status === "missing").length
const depsOk = checks.dependencies.filter((d) => d.status === "installed").length
const depsMissing = checks.dependencies.filter((d) => d.status === "missing").length

console.log(chalk.white(`Arquivos: ${filesOk}/${essentialFiles.length} OK`))
if (filesMissing > 0) {
  console.log(chalk.red(`  ${filesMissing} arquivos faltando`))
}

console.log(chalk.white(`Dependências: ${depsOk}/${criticalDeps.length} instaladas`))
if (depsMissing > 0) {
  console.log(chalk.red(`  ${depsMissing} dependências faltando`))
}

console.log(chalk.white(`Sistema: ${checks.system.filter((s) => s.status === "ok").length} verificações OK`))

// Erros encontrados
if (checks.errors.length > 0) {
  console.log(chalk.bold.red("\n=== PROBLEMAS ENCONTRADOS ===\n"))
  checks.errors.forEach((error, index) => {
    console.log(chalk.red(`${index + 1}. ${error}`))
  })

  console.log(chalk.bold.yellow("\n=== SOLUÇÕES RECOMENDADAS ===\n"))

  if (depsMissing > 0) {
    console.log(chalk.yellow("1. Instalar dependências faltando:"))
    console.log(chalk.white("   npm install"))
  }

  if (filesMissing > 0) {
    console.log(chalk.yellow("2. Arquivos faltando precisam ser restaurados do repositório"))
  }

  console.log(chalk.yellow("\n3. Execute o corretor automático:"))
  console.log(chalk.white("   node fix-bot.js"))

  process.exit(1)
} else {
  console.log(chalk.bold.green("\n✓ Nenhum problema crítico encontrado!"))
  console.log(chalk.white("\nVocê pode iniciar o bot com:"))
  console.log(chalk.cyan("   npm start"))
  process.exit(0)
}
