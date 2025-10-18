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

    const lembretes = global.db.data.users[m.sender].maria.lembretes.filter((l) => l.ativo)

    if (lembretes.length === 0) {
      return m.reply(`╭━━━━━━━━━⬣
┃ ⏰ *Seus Lembretes*
┃━━━━━━━━━━━━━━━━━━━
┃
┃ Você não tem lembretes ativos.
┃
┃ *Criar lembrete:*
┃ ${usedPrefix}lembrete <tempo> <msg>
┃
╰━━━━━━━━━⬣`)
    }

    let texto = `╭━━━━━━━━━⬣
┃ ⏰ *Seus Lembretes Ativos*
┃━━━━━━━━━━━━━━━━━━━
┃\n`

    lembretes.forEach((lembrete, index) => {
      const dataFormatada = new Date(lembrete.dataLembrete).toLocaleString("pt-BR")
      const tempoRestante = lembrete.dataLembrete - Date.now()
      const minutosRestantes = Math.floor(tempoRestante / 60000)

      texto += `┃ ${index + 1}. 📌 *${lembrete.mensagem}*\n`
      texto += `┃    ⏰ ${dataFormatada}\n`
      texto += `┃    ⏳ Faltam ~${minutosRestantes} minutos\n`
      texto += `┃\n`
    })

    texto += `╰━━━━━━━━━⬣`

    await m.reply(texto)
  } catch (error) {
    console.error("Error en verlembretes:", error)
    await m.reply("❌ Erro ao buscar lembretes.")
  }
}

handler.help = ["verlembretes"]
handler.tags = ["tools"]
handler.command = /^(verlembretes|mislembretes|myreminders)$/i

export default handler
