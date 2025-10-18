const handler = async (m, { conn, args, usedPrefix, command, text }) => {
  try {
    if (!text) {
      return m.reply(`╭━━━━━━━━━⬣
┃ 📝 *marIA - Notas*
┃━━━━━━━━━━━━━━━━━━━
┃
┃ *Uso:* ${usedPrefix}nota <texto>
┃
┃ *Exemplo:*
┃ ${usedPrefix}nota Comprar leite
┃
┃ *Ver notas:*
┃ ${usedPrefix}minhasnotas
┃
┃ *Deletar nota:*
┃ ${usedPrefix}delnota <número>
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

    // Criar nota
    const nota = {
      id: Date.now(),
      texto: text,
      criada: Date.now(),
      editada: null,
    }

    global.db.data.users[m.sender].maria.notas.push(nota)

    const dataFormatada = new Date(nota.criada).toLocaleString("pt-BR")

    await m.reply(`╭━━━━━━━━━⬣
┃ ✅ *Nota Salva!*
┃━━━━━━━━━━━━━━━━━━━
┃
┃ 📝 ${text}
┃
┃ 📅 ${dataFormatada}
┃ 🔢 Nota #${global.db.data.users[m.sender].maria.notas.length}
┃
┃ _Use ${usedPrefix}minhasnotas para ver todas_
┃
╰━━━━━━━━━⬣`)
  } catch (error) {
    console.error("Error en nota:", error)
    await m.reply("❌ Erro ao salvar nota. Tente novamente.")
  }
}

handler.help = ["nota <texto>"]
handler.tags = ["tools"]
handler.command = /^(nota|note|anotacion)$/i

export default handler
