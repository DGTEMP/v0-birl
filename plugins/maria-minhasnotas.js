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

    const notas = global.db.data.users[m.sender].maria.notas

    if (notas.length === 0) {
      return m.reply(`╭━━━━━━━━━⬣
┃ 📝 *Suas Notas*
┃━━━━━━━━━━━━━━━━━━━
┃
┃ Você não tem notas salvas.
┃
┃ *Criar nota:*
┃ ${usedPrefix}nota <texto>
┃
╰━━━━━━━━━⬣`)
    }

    let texto = `╭━━━━━━━━━⬣
┃ 📝 *Suas Notas* (${notas.length})
┃━━━━━━━━━━━━━━━━━━━
┃\n`

    notas.forEach((nota, index) => {
      const dataFormatada = new Date(nota.criada).toLocaleDateString("pt-BR")
      texto += `┃ ${index + 1}. 📌 ${nota.texto}\n`
      texto += `┃    📅 ${dataFormatada}\n`
      texto += `┃\n`
    })

    texto += `┃ *Deletar nota:*\n`
    texto += `┃ ${usedPrefix}delnota <número>\n`
    texto += `╰━━━━━━━━━⬣`

    await m.reply(texto)
  } catch (error) {
    console.error("Error en minhasnotas:", error)
    await m.reply("❌ Erro ao buscar notas.")
  }
}

handler.help = ["minhasnotas"]
handler.tags = ["tools"]
handler.command = /^(minhasnotas|misnotas|mynotes)$/i

export default handler
