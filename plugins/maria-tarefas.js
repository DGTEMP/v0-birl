const handler = async (m, { conn, usedPrefix }) => {
  try {
    if (!global.db.data.users[m.sender].maria) {
      global.db.data.users[m.sender].maria = {
        notas: [],
        tarefas: [],
        lembretes: [],
        conversas: [],
      }
    }

    const tarefas = global.db.data.users[m.sender].maria.tarefas

    if (tarefas.length === 0) {
      return m.reply(`╭━━━━━━━━━⬣
┃ ✅ *Suas Tarefas*
┃━━━━━━━━━━━━━━━━━━━
┃
┃ Você não tem tarefas cadastradas.
┃
┃ *Criar tarefa:*
┃ ${usedPrefix}tarefa <descrição>
┃
╰━━━━━━━━━⬣`)
    }

    const pendentes = tarefas.filter((t) => !t.concluida)
    const concluidas = tarefas.filter((t) => t.concluida)

    let texto = `╭━━━━━━━━━⬣
┃ ✅ *Suas Tarefas*
┃━━━━━━━━━━━━━━━━━━━
┃
┃ 📊 Total: ${tarefas.length}
┃ ⏳ Pendentes: ${pendentes.length}
┃ ✅ Concluídas: ${concluidas.length}
┃\n`

    if (pendentes.length > 0) {
      texto += `┃ *PENDENTES:*\n┃\n`
      pendentes.forEach((tarefa, index) => {
        const dataFormatada = new Date(tarefa.criada).toLocaleDateString("pt-BR")
        const numeroReal = tarefas.indexOf(tarefa) + 1
        texto += `┃ ${numeroReal}. ⏳ ${tarefa.texto}\n`
        texto += `┃    📅 ${dataFormatada}\n`
        texto += `┃\n`
      })
    }

    if (concluidas.length > 0) {
      texto += `┃ *CONCLUÍDAS:*\n┃\n`
      concluidas.slice(-3).forEach((tarefa) => {
        const numeroReal = tarefas.indexOf(tarefa) + 1
        texto += `┃ ${numeroReal}. ✅ ${tarefa.texto}\n`
        texto += `┃\n`
      })
    }

    texto += `┃ *Concluir tarefa:*\n`
    texto += `┃ ${usedPrefix}concluir <número>\n`
    texto += `╰━━━━━━━━━⬣`

    await m.reply(texto)
  } catch (error) {
    console.error("Error en tarefas:", error)
    await m.reply("❌ Erro ao buscar tarefas.")
  }
}

handler.help = ["tarefas"]
handler.tags = ["tools"]
handler.command = /^(tarefas|tasks|mistasks)$/i

export default handler
