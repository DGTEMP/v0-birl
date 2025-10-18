import mariaNLP from "../lib/maria-nlp.js"

const handler = async (m, { conn, text, usedPrefix, command }) => {
  try {
    const userId = m.sender

    // Inicializar dados do usuário se não existir
    if (!global.db.data.users[userId].maria) {
      global.db.data.users[userId].maria = {
        tasks: [],
        appointments: [],
        notes: [],
        reminders: [],
        settings: {
          language: "pt",
          notifications: true,
        },
      }
    }

    const userData = global.db.data.users[userId].maria

    // Se não houver texto, mostrar ajuda
    if (!text) {
      return conn.reply(
        m.chat,
        `👋 *Olá! Sou a marIA, sua secretária virtual!*

🎯 *Você pode conversar naturalmente comigo:*

💬 *Exemplos de conversação:*
• "Oi, bom dia!"
• "Preciso fazer compras hoje"
• "Tenho reunião amanhã às 14h"
• "Quais minhas tarefas?"
• "Terminei as compras"
• "Como estou?"

📋 *Ou usar comandos tradicionais:*
• ${usedPrefix}maria tarefa adicionar [descrição]
• ${usedPrefix}maria agenda listar
• ${usedPrefix}maria nota adicionar [texto]
• ${usedPrefix}maria status

✨ *Fale naturalmente e eu vou entender!*

Digite *${usedPrefix}maria ajuda* para ver todos os comandos.`,
        m,
      )
    }

    const isTraditional = mariaNLP.isTraditionalCommand(text)

    if (isTraditional) {
      // Processar comando tradicional (modo antigo)
      await processTraditionalCommand(m, conn, text, userData, userId, usedPrefix)
    } else {
      // Processar linguagem natural (modo novo)
      await processNaturalLanguage(m, conn, text, userData, userId, usedPrefix)
    }
  } catch (error) {
    console.error("[marIA] Erro:", error)
    await conn.reply(
      m.chat,
      `❌ Desculpe, ocorreu um erro ao processar sua solicitação.\n\n*Erro:* ${error.message}`,
      m,
    )
  }
}

async function processNaturalLanguage(m, conn, text, userData, userId, usedPrefix) {
  const result = await mariaNLP.processNaturalLanguage(userId, text)

  console.log("[marIA] Resultado do processamento:", {
    intent: result.intent,
    action: result.action,
    needsMoreInfo: result.needsMoreInfo,
  })

  // Se precisar de mais informações, retornar
  if (result.needsMoreInfo) {
    return conn.reply(m.chat, result.response, m)
  }

  try {
    switch (result.action) {
      case "addTask":
        await addTaskNatural(m, conn, result.entities, userData)
        break

      case "listTasks":
        await listTasks(m, conn, userData, usedPrefix)
        break

      case "completeTask":
        const taskId = result.entities.taskId || mariaNLP.extractTaskId(text) || mariaNLP.getContext(userId).lastTaskId
        if (taskId) {
          await completeTask(m, conn, taskId, userData)
        } else {
          await conn.reply(m.chat, result.response || "❓ Qual tarefa você completou? Me envie o ID da tarefa.", m)
        }
        break

      case "addAppointment":
        await addAppointmentNatural(m, conn, result.entities, userData)
        break

      case "listAppointments":
        await listAppointments(m, conn, userData, usedPrefix)
        break

      case "addNote":
        await addNoteNatural(m, conn, result.entities, userData)
        break

      case "listNotes":
        await listNotes(m, conn, userData, usedPrefix)
        break

      case "status":
        await showStatus(m, conn, userData, usedPrefix)
        break

      case "search":
        await searchAll(m, conn, result.entities.searchTerm, userData)
        break

      case "help":
        await showHelp(m, conn, usedPrefix)
        break

      default:
        if (result.response) {
          await conn.reply(m.chat, result.response, m)
        } else {
          // Fallback final (não deveria chegar aqui)
          await conn.reply(m.chat, `🤔 Não entendi. Use *.maria ajuda* para ver os comandos disponíveis.`, m)
        }
    }
  } catch (error) {
    console.error("[marIA] Erro ao executar ação:", error)
    await conn.reply(
      m.chat,
      `❌ Desculpe, ocorreu um erro ao processar sua solicitação.\n\n💡 Tente novamente ou use *.maria ajuda* para ver os comandos.`,
      m,
    )
  }
}

async function addTaskNatural(m, conn, entities, userData) {
  const task = {
    id: Date.now().toString(),
    description: entities.description,
    date: entities.date || null,
    time: entities.time || null,
    priority: entities.priority || "medium",
    completed: false,
    createdAt: new Date().toISOString(),
  }

  userData.tasks.push(task)

  let response = "✅ *Tarefa adicionada com sucesso!*\n\n"
  response += `📝 *Descrição:* ${task.description}\n`

  if (task.date) {
    response += `📅 *Data:* ${mariaNLP.formatDate(task.date)}\n`
  }

  if (task.time) {
    response += `⏰ *Horário:* ${task.time}\n`
  }

  response += `⚡ *Prioridade:* ${mariaNLP.formatPriority(task.priority)}\n`
  response += `🆔 *ID:* ${task.id}`

  await conn.reply(m.chat, response, m)
}

async function addAppointmentNatural(m, conn, entities, userData) {
  const appointment = {
    id: Date.now().toString(),
    description: entities.description,
    date: entities.date || "hoje",
    time: entities.time || null,
    createdAt: new Date().toISOString(),
  }

  userData.appointments.push(appointment)

  let response = "✅ *Compromisso adicionado!*\n\n"
  response += `📅 *Descrição:* ${appointment.description}\n`
  response += `📆 *Data:* ${mariaNLP.formatDate(appointment.date)}\n`

  if (appointment.time) {
    response += `⏰ *Horário:* ${appointment.time}\n`
  }

  response += `🆔 *ID:* ${appointment.id}`

  await conn.reply(m.chat, response, m)
}

async function addNoteNatural(m, conn, entities, userData) {
  const note = {
    id: Date.now().toString(),
    content: entities.description,
    createdAt: new Date().toISOString(),
  }

  userData.notes.push(note)

  let response = "✅ *Nota salva!*\n\n"
  response += `📝 ${note.content}\n\n`
  response += `🆔 *ID:* ${note.id}`

  await conn.reply(m.chat, response, m)
}

async function processTraditionalCommand(m, conn, text, userData, userId, usedPrefix) {
  const args = text.split(" ")
  const subCommand = args[0]?.toLowerCase()

  switch (subCommand) {
    case "tarefa":
    case "task":
      await handleTaskCommand(m, conn, args.slice(1), userData, usedPrefix)
      break

    case "agenda":
    case "compromisso":
    case "appointment":
      await handleAppointmentCommand(m, conn, args.slice(1), userData, usedPrefix)
      break

    case "nota":
    case "note":
      await handleNoteCommand(m, conn, args.slice(1), userData, usedPrefix)
      break

    case "status":
    case "resumo":
      await showStatus(m, conn, userData, usedPrefix)
      break

    case "ajuda":
    case "help":
      await showHelp(m, conn, usedPrefix)
      break

    default:
      await conn.reply(
        m.chat,
        `❓ Comando não reconhecido.\n\nUse *${usedPrefix}maria ajuda* para ver os comandos disponíveis.`,
        m,
      )
  }
}

async function handleTaskCommand(m, conn, args, userData, usedPrefix) {
  const action = args[0]?.toLowerCase()

  switch (action) {
    case "adicionar":
    case "add":
      const description = args.slice(1).join(" ")
      if (!description) {
        return conn.reply(m.chat, "❌ Por favor, forneça uma descrição para a tarefa.", m)
      }
      await addTaskNatural(m, conn, { description }, userData)
      break

    case "listar":
    case "list":
      await listTasks(m, conn, userData, usedPrefix)
      break

    case "concluir":
    case "complete":
      const taskId = args[1]
      if (!taskId) {
        return conn.reply(m.chat, "❌ Por favor, forneça o ID da tarefa.", m)
      }
      await completeTask(m, conn, taskId, userData)
      break

    default:
      await conn.reply(
        m.chat,
        `❓ Ação não reconhecida.\n\nUse: ${usedPrefix}maria tarefa [adicionar|listar|concluir]`,
        m,
      )
  }
}

async function listTasks(m, conn, userData, usedPrefix) {
  if (userData.tasks.length === 0) {
    return conn.reply(m.chat, '📋 Você não tem tarefas cadastradas.\n\nAdicione uma com: "Preciso fazer [tarefa]"', m)
  }

  let response = "📋 *Suas Tarefas:*\n\n"

  const pending = userData.tasks.filter((t) => !t.completed)
  const completed = userData.tasks.filter((t) => t.completed)

  if (pending.length > 0) {
    response += "*⏳ Pendentes:*\n"
    pending.forEach((task, index) => {
      response += `${index + 1}. ${task.description}\n`
      if (task.date) response += `   📅 ${mariaNLP.formatDate(task.date)}\n`
      if (task.time) response += `   ⏰ ${task.time}\n`
      response += `   🆔 ${task.id}\n\n`
    })
  }

  if (completed.length > 0) {
    response += "\n*✅ Concluídas:*\n"
    completed.forEach((task, index) => {
      response += `${index + 1}. ~~${task.description}~~\n`
    })
  }

  await conn.reply(m.chat, response, m)
}

async function completeTask(m, conn, taskId, userData) {
  const task = userData.tasks.find((t) => t.id === taskId)

  if (!task) {
    return conn.reply(m.chat, "❌ Tarefa não encontrada.", m)
  }

  task.completed = true
  task.completedAt = new Date().toISOString()

  await conn.reply(m.chat, `✅ *Tarefa concluída!*\n\n~~${task.description}~~\n\n🎉 Parabéns!`, m)
}

async function handleAppointmentCommand(m, conn, args, userData, usedPrefix) {
  const action = args[0]?.toLowerCase()

  switch (action) {
    case "adicionar":
    case "add":
      const description = args.slice(1).join(" ")
      if (!description) {
        return conn.reply(m.chat, "❌ Por favor, forneça uma descrição para o compromisso.", m)
      }
      await addAppointmentNatural(m, conn, { description }, userData)
      break

    case "listar":
    case "list":
      await listAppointments(m, conn, userData, usedPrefix)
      break

    default:
      await conn.reply(m.chat, `❓ Ação não reconhecida.\n\nUse: ${usedPrefix}maria agenda [adicionar|listar]`, m)
  }
}

async function listAppointments(m, conn, userData, usedPrefix) {
  if (userData.appointments.length === 0) {
    return conn.reply(
      m.chat,
      '📅 Você não tem compromissos agendados.\n\nAdicione um com: "Tenho reunião [detalhes]"',
      m,
    )
  }

  let response = "📅 *Sua Agenda:*\n\n"

  userData.appointments.forEach((apt, index) => {
    response += `${index + 1}. ${apt.description}\n`
    response += `   📆 ${mariaNLP.formatDate(apt.date)}\n`
    if (apt.time) response += `   ⏰ ${apt.time}\n`
    response += `   🆔 ${apt.id}\n\n`
  })

  await conn.reply(m.chat, response, m)
}

async function handleNoteCommand(m, conn, args, userData, usedPrefix) {
  const action = args[0]?.toLowerCase()

  switch (action) {
    case "adicionar":
    case "add":
      const content = args.slice(1).join(" ")
      if (!content) {
        return conn.reply(m.chat, "❌ Por favor, forneça o conteúdo da nota.", m)
      }
      await addNoteNatural(m, conn, { description: content }, userData)
      break

    case "listar":
    case "list":
      await listNotes(m, conn, userData, usedPrefix)
      break

    default:
      await conn.reply(m.chat, `❓ Ação não reconhecida.\n\nUse: ${usedPrefix}maria nota [adicionar|listar]`, m)
  }
}

async function listNotes(m, conn, userData, usedPrefix) {
  if (userData.notes.length === 0) {
    return conn.reply(m.chat, '📝 Você não tem notas salvas.\n\nAdicione uma com: "Anotar [texto]"', m)
  }

  let response = "📝 *Suas Notas:*\n\n"

  userData.notes.forEach((note, index) => {
    response += `${index + 1}. ${note.content}\n`
    response += `   🆔 ${note.id}\n\n`
  })

  await conn.reply(m.chat, response, m)
}

async function showStatus(m, conn, userData, usedPrefix) {
  const totalTasks = userData.tasks.length
  const completedTasks = userData.tasks.filter((t) => t.completed).length
  const pendingTasks = totalTasks - completedTasks
  const totalAppointments = userData.appointments.length
  const totalNotes = userData.notes.length

  let response = "📊 *Seu Status com marIA*\n\n"
  response += `📋 *Tarefas:*\n`
  response += `   ✅ Concluídas: ${completedTasks}\n`
  response += `   ⏳ Pendentes: ${pendingTasks}\n`
  response += `   📊 Total: ${totalTasks}\n\n`
  response += `📅 *Compromissos:* ${totalAppointments}\n`
  response += `📝 *Notas:* ${totalNotes}\n\n`

  if (pendingTasks > 0) {
    response += `💡 *Dica:* Você tem ${pendingTasks} tarefa(s) pendente(s)!\n`
  } else {
    response += `🎉 *Parabéns!* Todas as tarefas concluídas!\n`
  }

  await conn.reply(m.chat, response, m)
}

async function searchAll(m, conn, searchTerm, userData) {
  const results = []

  // Buscar em tarefas
  const taskResults = userData.tasks.filter((t) => t.description.toLowerCase().includes(searchTerm.toLowerCase()))

  // Buscar em compromissos
  const aptResults = userData.appointments.filter((a) => a.description.toLowerCase().includes(searchTerm.toLowerCase()))

  // Buscar em notas
  const noteResults = userData.notes.filter((n) => n.content.toLowerCase().includes(searchTerm.toLowerCase()))

  let response = `🔍 *Resultados para "${searchTerm}":*\n\n`

  if (taskResults.length > 0) {
    response += `📋 *Tarefas (${taskResults.length}):*\n`
    taskResults.forEach((t) => {
      response += `• ${t.description}\n`
    })
    response += "\n"
  }

  if (aptResults.length > 0) {
    response += `📅 *Compromissos (${aptResults.length}):*\n`
    aptResults.forEach((a) => {
      response += `• ${a.description}\n`
    })
    response += "\n"
  }

  if (noteResults.length > 0) {
    response += `📝 *Notas (${noteResults.length}):*\n`
    noteResults.forEach((n) => {
      response += `• ${n.content.substring(0, 50)}...\n`
    })
  }

  if (taskResults.length === 0 && aptResults.length === 0 && noteResults.length === 0) {
    response = `❌ Nenhum resultado encontrado para "${searchTerm}".`
  }

  await conn.reply(m.chat, response, m)
}

async function showHelp(m, conn, usedPrefix) {
  const help = `🤖 *marIA - Sua Secretária Virtual*

✨ *Conversação Natural:*
Fale naturalmente comigo! Exemplos:
• "Oi, bom dia!"
• "Preciso fazer compras hoje"
• "Tenho reunião amanhã às 14h"
• "Quais minhas tarefas?"
• "Terminei as compras"
• "Como estou?"

📋 *Comandos Tradicionais:*

*Tarefas:*
• ${usedPrefix}maria tarefa adicionar [descrição]
• ${usedPrefix}maria tarefa listar
• ${usedPrefix}maria tarefa concluir [ID]

*Agenda:*
• ${usedPrefix}maria agenda adicionar [descrição]
• ${usedPrefix}maria agenda listar

*Notas:*
• ${usedPrefix}maria nota adicionar [texto]
• ${usedPrefix}maria nota listar

*Outros:*
• ${usedPrefix}maria status
• ${usedPrefix}maria ajuda

💡 *Dica:* Você pode usar tanto comandos quanto linguagem natural!`

  await conn.reply(m.chat, help, m)
}

handler.help = ["maria"]
handler.tags = ["tools"]
handler.command = /^(maria|marIA)$/i

export default handler
