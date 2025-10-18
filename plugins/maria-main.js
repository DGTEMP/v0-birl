import axios from "axios"
import fs from "fs"

const handler = async (m, { conn, args, usedPrefix, command, text }) => {
  const datas = global
  const idioma = datas.db.data.users[m.sender]?.language || global.defaultLenguaje
  const _translate = JSON.parse(fs.readFileSync(`./src/languages/${idioma}.json`))

  try {
    if (!text) {
      const helpText = `╭━━━━━━━━━⬣
┃ 💼 *marIA - Sua Secretária IA*
┃━━━━━━━━━━━━━━━━━━━
┃
┃ Olá! Sou a marIA, sua assistente
┃ pessoal inteligente. Posso ajudar
┃ com diversas tarefas:
┃
┃ 📋 *Comandos Disponíveis:*
┃
┃ • ${usedPrefix}maria <pergunta>
┃   _Converse comigo_
┃
┃ • ${usedPrefix}lembrete <tempo> <msg>
┃   _Ex: ${usedPrefix}lembrete 10m Reunião_
┃
┃ • ${usedPrefix}nota <texto>
┃   _Salvar anotações_
┃
┃ • ${usedPrefix}minhasnotas
┃   _Ver suas notas_
┃
┃ • ${usedPrefix}tarefa <descrição>
┃   _Adicionar tarefa_
┃
┃ • ${usedPrefix}tarefas
┃   _Ver suas tarefas_
┃
┃ • ${usedPrefix}resumo
┃   _Resumir conversa do grupo_
┃
┃ • ${usedPrefix}mariahelp
┃   _Ajuda detalhada_
┃
╰━━━━━━━━━⬣

*Exemplo:* ${usedPrefix}maria Como está o clima hoje?`

      return m.reply(helpText)
    }

    // Inicializar dados do usuário se não existir
    if (!global.db.data.users[m.sender].maria) {
      global.db.data.users[m.sender].maria = {
        notas: [],
        tarefas: [],
        lembretes: [],
        conversas: [],
      }
    }

    let mediax = null
    const userID = m.sender
    let imageDescription = ""
    let hasImage = false

    // Processar imagem se houver
    if (m.quoted?.mimetype?.startsWith("image/") || m.mimetype?.startsWith("image/")) {
      const q = m.quoted ? m.quoted : m
      mediax = await q.download().catch(() => null)

      if (mediax) {
        try {
          const descResponse = await axios.post("https://luminai.my.id", {
            content: "Describe detalladamente todo lo que ves en esta imagen.",
            user: userID + "_img_desc",
            prompt: "Eres un experto analizador de imágenes.",
            imageBuffer: mediax,
            webSearchMode: false,
          })

          imageDescription = descResponse?.data?.result || ""
          if (imageDescription.trim()) {
            hasImage = true
          }
        } catch (imgError) {
          console.error("Error procesando imagen:", imgError)
        }
      }
    }

    // Contexto da marIA
    let context =
      `Eres marIA, una secretaria virtual inteligente y profesional.\n\n` +
      `PERSONALIDAD:\n` +
      `- Eres amable, eficiente y organizada\n` +
      `- Hablas de forma profesional pero cercana\n` +
      `- Siempre buscas ayudar de la mejor manera\n` +
      `- Eres proactiva y sugieres soluciones\n\n` +
      `CAPACIDADES:\n` +
      `- Gestión de lembretes y agenda\n` +
      `- Organización de notas y tarefas\n` +
      `- Resumo de conversas\n` +
      `- Asistencia general con información\n\n` +
      `INSTRUCCIONES:\n` +
      `- Responde siempre en ${idioma === "es" ? "español" : idioma === "pt" ? "português" : "inglés"}\n` +
      `- Sé concisa pero completa\n` +
      `- Usa emojis profesionales cuando sea apropiado\n` +
      `- Si no sabes algo, admítelo y sugiere alternativas\n\n`

    if (hasImage && imageDescription.trim()) {
      context += `IMAGEN DISPONIBLE:\n${imageDescription}\n\n`
    }

    // Adicionar contexto de notas e tarefas do usuário
    const userData = global.db.data.users[m.sender].maria
    if (userData.tarefas.length > 0) {
      context += `TAREFAS PENDENTES DEL USUARIO:\n`
      userData.tarefas.slice(0, 3).forEach((t, i) => {
        context += `${i + 1}. ${t.texto} ${t.concluida ? "✅" : "⏳"}\n`
      })
      context += `\n`
    }

    const payload = {
      content: text,
      user: userID + "_maria",
      prompt: context,
      webSearchMode: false,
    }

    await m.reply("💼 *marIA está pensando...*")

    const response = await axios.post("https://luminai.my.id", payload)
    const result = response?.data?.result

    if (!result) {
      throw new Error("No se recibió respuesta de la IA")
    }

    // Salvar conversa no histórico
    userData.conversas.push({
      pergunta: text,
      resposta: result,
      timestamp: Date.now(),
    })

    // Manter apenas últimas 10 conversas
    if (userData.conversas.length > 10) {
      userData.conversas = userData.conversas.slice(-10)
    }

    const finalMessage = `╭━━━━━━━━━⬣
┃ 💼 *marIA Responde:*
┃━━━━━━━━━━━━━━━━━━━
┃
${result
  .split("\n")
  .map((line) => `┃ ${line}`)
  .join("\n")}
┃
╰━━━━━━━━━⬣`

    await m.reply(finalMessage)
  } catch (error) {
    console.error("Error en marIA:", error)
    await m.reply("❌ *marIA:* Desculpe, ocorreu um erro ao processar sua solicitação. Por favor, tente novamente.")
  }
}

handler.help = ["maria <texto>"]
handler.tags = ["ai", "tools"]
handler.command = /^(maria|María|MARIA)$/i

export default handler
