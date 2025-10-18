const handler = async (m, { conn, args, usedPrefix, command, text }) => {
  try {
    if (!text) {
      return m.reply(`╭━━━━━━━━━⬣
┃ ✅ *marIA - Tarefas*
┃━━━━━━━━━━━━━━━━━━━
┃
┃ *Uso:* ${usedPrefix}tarefa <descrição>
┃
┃ *Exemplo:*
┃ ${usedPrefix}tarefa Enviar relatório
┃
┃ *Ver tarefas:*
┃ ${usedPrefix}tarefas
┃
┃ *Concluir tarefa:*
┃ ${usedPrefix}concluir <número>
┃
╰━━━━━━━━━⬣`)
    }

    // Inicializar dados
    if (!global.db.data.users[m.sender].maria) {
      global.db.data.users[m.sender].maria = {
        notas: [],
        tarefas: [],
        lembretes: [],
        conversas: [],
      }
    }

    // Criar tarefa
    const tarefa = {
      id: Date.now(),
      texto: text,
      criada: Date.now(),
      concluida: false,
      dataConclusao: null,
    }

    global.db.data.users[m.sender].maria.tarefas.push(tarefa)

    const dataFormatada = new Date(tarefa.criada).toLocaleString("pt-BR")

    await m.reply(`╭━━━━━━━━━⬣
┃ ✅ *Tarefa Adicionada!*
┃━━━━━━━━━━━━━━━━━━━
┃
┃ 📋 ${text}
┃
┃ 📅 ${dataFormatada}
┃ 🔢 Tarefa #${global.db.data.users[m.sender].maria.tarefas.length}
┃
┃ _Use ${usedPrefix}tarefas para ver todas_
┃
╰━━━━━━━━━⬣`)
  } catch (error) {
    console.error("Error en tarefa:", error)
    await m.reply("❌ Erro ao adicionar tarefa. Tente novamente.")
  }
}

handler.help = ["tarefa <texto>"]
handler.tags = ["tools"]
handler.command = /^(tarefa|task|tarea)$/i

export default handler
