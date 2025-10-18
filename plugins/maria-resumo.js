import axios from "axios"

const handler = async (m, { conn, args, usedPrefix, isGroup }) => {
  try {
    if (!isGroup) {
      return m.reply("❌ Este comando só funciona em grupos!")
    }

    const quantidade = Number.parseInt(args[0]) || 50

    if (quantidade < 10 || quantidade > 100) {
      return m.reply("❌ A quantidade deve estar entre 10 e 100 mensagens.")
    }

    await m.reply("💼 *marIA está analisando as mensagens...*\n_Isso pode levar alguns segundos_")

    // Buscar mensagens do grupo
    const mensagens = await conn.fetchMessages(m.chat, quantidade)

    if (!mensagens || mensagens.length === 0) {
      return m.reply("❌ Não foi possível buscar as mensagens do grupo.")
    }

    // Filtrar e formatar mensagens
    let textoMensagens = ""
    mensagens.reverse().forEach((msg, index) => {
      if (msg.message) {
        const texto =
          msg.message.conversation ||
          msg.message.extendedTextMessage?.text ||
          msg.message.imageMessage?.caption ||
          msg.message.videoMessage?.caption ||
          ""

        if (texto && texto.length > 0 && !texto.startsWith(".") && !texto.startsWith("/")) {
          const nome = msg.pushName || "Usuário"
          textoMensagens += `${nome}: ${texto}\n`
        }
      }
    })

    if (textoMensagens.length < 50) {
      return m.reply("❌ Não há mensagens suficientes para resumir.")
    }

    // Limitar tamanho do texto
    if (textoMensagens.length > 3000) {
      textoMensagens = textoMensagens.substring(0, 3000) + "..."
    }

    // Solicitar resumo à IA
    const context =
      `Eres marIA, una secretaria virtual. Tu tarea es resumir conversaciones de grupo de WhatsApp.\n\n` +
      `INSTRUCCIONES:\n` +
      `- Crea un resumen conciso y organizado\n` +
      `- Identifica los temas principales discutidos\n` +
      `- Menciona decisiones importantes tomadas\n` +
      `- Destaca información relevante\n` +
      `- Usa emojis para organizar el resumen\n` +
      `- Sé breve pero completa\n\n` +
      `CONVERSACIÓN A RESUMIR:\n${textoMensagens}`

    const payload = {
      content: "Resume esta conversación de grupo de WhatsApp",
      user: m.sender + "_resumo",
      prompt: context,
      webSearchMode: false,
    }

    const response = await axios.post("https://luminai.my.id", payload)
    const resumo = response?.data?.result

    if (!resumo) {
      throw new Error("No se recibió respuesta de la IA")
    }

    const finalMessage = `╭━━━━━━━━━⬣
┃ 📊 *RESUMO DA CONVERSA*
┃ _por marIA_
┃━━━━━━━━━━━━━━━━━━━
┃
${resumo
  .split("\n")
  .map((line) => `┃ ${line}`)
  .join("\n")}
┃
┃━━━━━━━━━━━━━━━━━━━
┃ 📝 Analisadas: ${quantidade} mensagens
┃ 📅 ${new Date().toLocaleString("pt-BR")}
┃
╰━━━━━━━━━⬣`

    await m.reply(finalMessage)
  } catch (error) {
    console.error("Error en resumo:", error)
    await m.reply("❌ *marIA:* Erro ao criar resumo. Tente novamente com menos mensagens.")
  }
}

handler.help = ["resumo [quantidade]"]
handler.tags = ["tools", "group"]
handler.command = /^(resumo|summary|resumen)$/i
handler.group = true

export default handler
