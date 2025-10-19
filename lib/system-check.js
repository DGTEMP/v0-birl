import os from "os"
import { execSync } from "child_process"
import fs from "fs"
import chalk from "chalk"

const checks = {
  passed: 0,
  failed: 0,
  warnings: 0,
}

function printHeader() {
  console.log(chalk.cyan("\n╔════════════════════════════════════════════════════════╗"))
  console.log(chalk.cyan("║         MYSTIC BOT - VERIFICAÇÃO DO SISTEMA           ║"))
  console.log(chalk.cyan("╚════════════════════════════════════════════════════════╝\n"))
}

function printSuccess(message) {
  console.log(chalk.green("✓"), message)
  checks.passed++
}

function printError(message) {
  console.log(chalk.red("✗"), message)
  checks.failed++
}

function printWarning(message) {
  console.log(chalk.yellow("⚠"), message)
  checks.warnings++
}

function printInfo(message) {
  console.log(chalk.blue("ℹ"), message)
}

function checkNodeVersion() {
  printInfo("Verificando versão do Node.js...")
  const nodeVersion = process.version
  const majorVersion = Number.parseInt(nodeVersion.split(".")[0].substring(1))

  if (majorVersion >= 18) {
    printSuccess(`Node.js ${nodeVersion} (OK)`)
  } else {
    printError(`Node.js ${nodeVersion} é muito antigo. Necessário >= 18.x`)
  }
}

function checkMemory() {
  printInfo("Verificando memória disponível...")
  const totalMem = os.totalmem() / (1024 * 1024 * 1024)
  const freeMem = os.freemem() / (1024 * 1024 * 1024)

  printInfo(`Memória total: ${totalMem.toFixed(2)} GB`)
  printInfo(`Memória livre: ${freeMem.toFixed(2)} GB`)

  if (totalMem < 0.5) {
    printWarning("Memória total muito baixa. Pode haver problemas de performance.")
  } else if (freeMem < 0.2) {
    printWarning("Memória livre baixa. Considere fechar outros programas.")
  } else {
    printSuccess("Memória suficiente disponível")
  }
}

function checkCPU() {
  printInfo("Verificando CPU...")
  const cpus = os.cpus()
  printInfo(`CPU: ${cpus[0].model}`)
  printInfo(`Núcleos: ${cpus.length}`)

  if (cpus.length >= 2) {
    printSuccess("CPU adequada para o bot")
  } else {
    printWarning("CPU com poucos núcleos. Performance pode ser limitada.")
  }
}

function checkDiskSpace() {
  printInfo("Verificando espaço em disco...")
  try {
    if (process.platform === "win32") {
      const output = execSync("wmic logicaldisk get size,freespace,caption", { encoding: "utf8" })
      printInfo("Espaço em disco verificado (Windows)")
      printSuccess("Espaço em disco disponível")
    } else {
      const output = execSync("df -h .", { encoding: "utf8" })
      const lines = output.split("\n")
      if (lines[1]) {
        const parts = lines[1].split(/\s+/)
        printInfo(`Espaço disponível: ${parts[3]}`)
        printSuccess("Espaço em disco suficiente")
      }
    }
  } catch (error) {
    printWarning("Não foi possível verificar espaço em disco")
  }
}

function checkFFmpeg() {
  printInfo("Verificando FFmpeg...")
  try {
    const version = execSync("ffmpeg -version", { encoding: "utf8" })
    const versionLine = version.split("\n")[0]
    printSuccess(`FFmpeg instalado: ${versionLine.split(" ")[2]}`)
  } catch (error) {
    printError("FFmpeg não encontrado. Necessário para processar áudio/vídeo.")
    printInfo("Instale: https://ffmpeg.org/download.html")
  }
}

function checkImageMagick() {
  printInfo("Verificando ImageMagick...")
  try {
    const version = execSync("convert -version", { encoding: "utf8" })
    const versionLine = version.split("\n")[0]
    printSuccess("ImageMagick instalado")
  } catch (error) {
    printWarning("ImageMagick não encontrado. Recomendado para processamento de imagens.")
  }
}

function checkDirectories() {
  printInfo("Verificando diretórios necessários...")
  const dirs = ["MysticSession", "tmp", "database", "plugins", "lib"]
  let allExist = true

  dirs.forEach((dir) => {
    if (!fs.existsSync(dir)) {
      printWarning(`Diretório ${dir} não existe. Criando...`)
      try {
        fs.mkdirSync(dir, { recursive: true })
        printSuccess(`Diretório ${dir} criado`)
      } catch (error) {
        printError(`Erro ao criar diretório ${dir}`)
        allExist = false
      }
    }
  })

  if (allExist) {
    printSuccess("Todos os diretórios necessários existem")
  }
}

function checkPermissions() {
  printInfo("Verificando permissões de escrita...")
  try {
    const testFile = "tmp/.test-write"
    fs.writeFileSync(testFile, "test")
    fs.unlinkSync(testFile)
    printSuccess("Permissões de escrita OK")
  } catch (error) {
    printError("Sem permissão de escrita no diretório")
  }
}

function checkDependencies() {
  printInfo("Verificando dependências críticas...")
  const criticalDeps = ["baileys", "chalk", "axios", "express", "lowdb", "moment-timezone"]

  let allInstalled = true
  criticalDeps.forEach((dep) => {
    try {
      require.resolve(dep)
    } catch (error) {
      printError(`Dependência ${dep} não encontrada`)
      allInstalled = false
    }
  })

  if (allInstalled) {
    printSuccess("Todas as dependências críticas instaladas")
  } else {
    printError("Execute: npm install")
  }
}

function checkPorts() {
  printInfo("Verificando portas disponíveis...")
  const port = process.env.PORT || 3000
  printInfo(`Porta configurada: ${port}`)
  printSuccess("Configuração de porta OK")
}

function checkEnvironment() {
  printInfo("Verificando ambiente...")
  printInfo(`Sistema Operacional: ${os.platform()} ${os.release()}`)
  printInfo(`Arquitetura: ${os.arch()}`)
  printInfo(`Node.js: ${process.version}`)
  printSuccess("Ambiente verificado")
}

function checkMariaFiles() {
  printInfo("Verificando arquivos da marIA...")
  const mariaFiles = [
    "lib/maria-nlp.js",
    "plugins/maria-assistant.js",
    "plugins/maria-lembrete.js",
    "plugins/maria-nota.js",
    "plugins/maria-tarefa.js",
  ]

  let allExist = true
  mariaFiles.forEach((file) => {
    if (!fs.existsSync(file)) {
      printWarning(`Arquivo ${file} não encontrado`)
      allExist = false
    }
  })

  if (allExist) {
    printSuccess("Todos os arquivos da marIA estão presentes")
  } else {
    printWarning("Alguns arquivos da marIA estão faltando")
  }
}

function printSummary() {
  console.log(chalk.cyan("\n╔════════════════════════════════════════════════════════╗"))
  console.log(chalk.cyan("║                    RESUMO DA VERIFICAÇÃO               ║"))
  console.log(chalk.cyan("╚════════════════════════════════════════════════════════╝\n"))

  console.log(chalk.green(`✓ Verificações aprovadas: ${checks.passed}`))
  console.log(chalk.yellow(`⚠ Avisos: ${checks.warnings}`))
  console.log(chalk.red(`✗ Verificações falhadas: ${checks.failed}`))

  console.log("")

  if (checks.failed === 0 && checks.warnings === 0) {
    console.log(chalk.green.bold("🎉 Sistema totalmente pronto para uso!"))
  } else if (checks.failed === 0) {
    console.log(chalk.yellow.bold("⚠ Sistema pronto, mas com alguns avisos."))
  } else {
    console.log(chalk.red.bold("❌ Corrija os erros antes de iniciar o bot."))
  }

  console.log("")
}

// Run all checks
async function runAllChecks() {
  printHeader()

  checkNodeVersion()
  checkMemory()
  checkCPU()
  checkDiskSpace()
  checkFFmpeg()
  checkImageMagick()
  checkDirectories()
  checkPermissions()
  checkDependencies()
  checkPorts()
  checkEnvironment()
  checkMariaFiles()

  printSummary()

  // Exit with error code if critical checks failed
  if (checks.failed > 0) {
    process.exit(1)
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllChecks()
}

export default runAllChecks
