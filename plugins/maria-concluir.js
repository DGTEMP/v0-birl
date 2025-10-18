const handler = async (m, { conn, args, usedPrefix }) => {
  try {
    if (!args[0]) {
      return m.reply(`╭━━━━━━━━━⬣
┃ ✅ *Concluir Tarefa*
┃━━━━━━━━━━━━━━━━━━━
┃
┃ *Uso:* ${usedPrefix}concluir <número>
┃
┃ *Exemplo:*
┃ ${usedPrefix}concluir 1
┃
┃ _Use ${usedPrefix}tarefas para ver os números_
┃
╰━━━━━━━━━⬣`)
    }

    if (!global.db.data.users[m.sender].maria) {
      global.db.data.users[m.sender].maria = {
        notas: [],
        tarefas: [],
        lembretes: [],
        conversas: [],
      }
    }

    const numero = Number.parseInt(args[0])
    const tarefas = global.db.data.users[m.sender].maria.tarefas

    if (isNaN(numero) || numero < 1 || numero > tarefas.length) {
      return m.reply("❌ Número de tarefa inválido! Use " + usedPrefix + "tarefas para ver as tarefas disponíveis.")
    }

    const tarefa = tarefas[numero - 1]

    if (tarefa.concluida) {
      return m.reply("⚠️ Esta tarefa já foi concluída!")
    }

    tarefa.concluida = true
    tarefa.dataConclusao = Date.now()

    await m.reply(`╭━━━━━━━━━⬣
┃ ✅ *Tarefa Concluída!*
┃━━━━━━━━━━━━━━━━━━━
┃
┃ 🎉 "${tarefa.texto}"
┃
┃ _Parabéns por completar esta tarefa!_
┃
╰━━━━━━━━━⬣`)
  } catch (error) {
    console.error("Error en concluir:", error)
    await m.reply("❌ Erro ao concluir tarefa.")
  }
}

handler.help = ["concluir <número>"]
handler.tags = ["tools"]
handler.command = /^(concluir|complete|completar)$/i

export default handler
