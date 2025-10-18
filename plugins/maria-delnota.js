const handler = async (m, { conn, args, usedPrefix }) => {
  try {
    if (!args[0]) {
      return m.reply(`╭━━━━━━━━━⬣
┃ 🗑️ *Deletar Nota*
┃━━━━━━━━━━━━━━━━━━━
┃
┃ *Uso:* ${usedPrefix}delnota <número>
┃
┃ *Exemplo:*
┃ ${usedPrefix}delnota 1
┃
┃ _Use ${usedPrefix}minhasnotas para ver os números_
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
    const notas = global.db.data.users[m.sender].maria.notas

    if (isNaN(numero) || numero < 1 || numero > notas.length) {
      return m.reply("❌ Número de nota inválido! Use " + usedPrefix + "minhasnotas para ver as notas disponíveis.")
    }

    const notaDeletada = notas[numero - 1]
    notas.splice(numero - 1, 1)

    await m.reply(`╭━━━━━━━━━⬣
┃ ✅ *Nota Deletada!*
┃━━━━━━━━━━━━━━━━━━━
┃
┃ 🗑️ "${notaDeletada.texto}"
┃
┃ _Nota removida com sucesso_
┃
╰━━━━━━━━━⬣`)
  } catch (error) {
    console.error("Error en delnota:", error)
    await m.reply("❌ Erro ao deletar nota.")
  }
}

handler.help = ["delnota <número>"]
handler.tags = ["tools"]
handler.command = /^(delnota|deletenote|borrarnota)$/i

export default handler
