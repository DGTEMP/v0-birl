const handler = async (m, { conn, args, usedPrefix, command, text }) => {
  const datas = global
  const idioma = datas.db.data.users[m.sender]?.language || global.defaultLenguaje

  try {
    if (!text) {
      return m.reply(`╭━━━━━━━━━⬣
┃ ⏰ *marIA - Lembretes*
┃━━━━━━━━━━━━━━━━━━━
┃
┃ *Uso:* ${usedPrefix}lembrete <tempo> <mensagem>
┃
┃ *Exemplos de tempo:*
┃ • 5m = 5 minutos
┃ • 2h = 2 horas
┃ • 1d = 1 dia
┃
┃ *Exemplo completo:*
┃ ${usedPrefix}lembrete 30m Reunião com cliente
┃
┃ *Ver lembretes:*
┃ ${usedPrefix}verlembretes
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

    // Parse do tempo e mensagem
    const match = text.match(/^(\d+)([mhd])\s+(.+)$/i)

    if (!match) {
      return m.reply(
        "❌ *Formato inválido!*\n\nUse: `" +
          usedPrefix +
          "lembrete <tempo> <mensagem>`\nExemplo: `" +
          usedPrefix +
          "lembrete 30m Reunião`",
      )
    }

    const [, quantidade, unidade, mensagem] = match

    // Calcular tempo em milissegundos
    let tempoMs
    switch (unidade.toLowerCase()) {
      case "m":
        tempoMs = Number.parseInt(quantidade) * 60 * 1000
        break
      case "h":
        tempoMs = Number.parseInt(quantidade) * 60 * 60 * 1000
        break
      case "d":
        tempoMs = Number.parseInt(quantidade) * 24 * 60 * 60 * 1000
        break
      default:
        return m.reply("❌ Unidade inválida! Use: m (minutos), h (horas), d (dias)")
    }

    const dataLembrete = Date.now() + tempoMs

    // Salvar lembrete
    const lembrete = {
      id: Date.now(),
      mensagem: mensagem,
      tempo: tempoMs,
      dataLembrete: dataLembrete,
      criado: Date.now(),
      ativo: true,
    }

    global.db.data.users[m.sender].maria.lembretes.push(lembrete)

    // Agendar lembrete
    setTimeout(async () => {
      try {
        const userData = global.db.data.users[m.sender]
        if (userData && userData.maria) {
          const lembreteAtivo = userData.maria.lembretes.find((l) => l.id === lembrete.id && l.ativo)

          if (lembreteAtivo) {
            await conn.sendMessage(m.chat, {
              text: `╭━━━━━━━━━⬣
┃ ⏰ *LEMBRETE marIA*
┃━━━━━━━━━━━━━━━━━━━
┃
┃ 📌 ${mensagem}
┃
┃ _Lembrete configurado há ${quantidade}${unidade}_
┃
╰━━━━━━━━━⬣`,
              mentions: [m.sender],
            })

            // Marcar como executado
            lembreteAtivo.ativo = false
          }
        }
      } catch (error) {
        console.error("Erro ao enviar lembrete:", error)
      }
    }, tempoMs)

    const dataFormatada = new Date(dataLembrete).toLocaleString("pt-BR")

    await m.reply(`╭━━━━━━━━━⬣
┃ ✅ *Lembrete Agendado!*
┃━━━━━━━━━━━━━━━━━━━
┃
┃ 📌 *Mensagem:* ${mensagem}
┃ ⏰ *Quando:* ${quantidade}${unidade}
┃ 📅 *Data/Hora:* ${dataFormatada}
┃
┃ _Você será notificado no momento certo!_
┃
╰━━━━━━━━━⬣`)
  } catch (error) {
    console.error("Error en lembrete:", error)
    await m.reply("❌ Erro ao criar lembrete. Tente novamente.")
  }
}

handler.help = ["lembrete <tempo> <msg>"]
handler.tags = ["tools"]
handler.command = /^(lembrete|reminder|recordatorio)$/i

export default handler
