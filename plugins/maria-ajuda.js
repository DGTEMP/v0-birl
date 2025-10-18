const handler = async (m, { conn, usedPrefix }) => {
  const helpText = `╭━━━━━━━━━━━━━━━━━━━⬣
┃ 💼 *marIA - Secretária Virtual IA*
┃━━━━━━━━━━━━━━━━━━━━━━━━━
┃
┃ Olá! Sou a marIA, sua assistente
┃ pessoal inteligente. Estou aqui para
┃ ajudar você a se organizar e ser
┃ mais produtivo!
┃
┃━━━━━━━━━━━━━━━━━━━━━━━━━
┃ 🤖 *ASSISTENTE IA*
┃━━━━━━━━━━━━━━━━━━━━━━━━━
┃
┃ • ${usedPrefix}maria <pergunta>
┃   _Converse comigo sobre qualquer assunto_
┃   _Posso ajudar com informações, dúvidas_
┃   _e muito mais!_
┃
┃━━━━━━━━━━━━━━━━━━━━━━━━━
┃ ⏰ *LEMBRETES*
┃━━━━━━━━━━━━━━━━━━━━━━━━━
┃
┃ • ${usedPrefix}lembrete <tempo> <msg>
┃   _Crie lembretes inteligentes_
┃   _Exemplos: 30m, 2h, 1d_
┃
┃ • ${usedPrefix}verlembretes
┃   _Veja todos os seus lembretes ativos_
┃
┃━━━━━━━━━━━━━━━━━━━━━━━━━
┃ 📝 *NOTAS*
┃━━━━━━━━━━━━━━━━━━━━━━━━━
┃
┃ • ${usedPrefix}nota <texto>
┃   _Salve anotações importantes_
┃
┃ • ${usedPrefix}minhasnotas
┃   _Veja todas as suas notas_
┃
┃ • ${usedPrefix}delnota <número>
┃   _Delete uma nota específica_
┃
┃━━━━━━━━━━━━━━━━━━━━━━━━━
┃ ✅ *TAREFAS*
┃━━━━━━━━━━━━━━━━━━━━━━━━━
┃
┃ • ${usedPrefix}tarefa <descrição>
┃   _Adicione tarefas à sua lista_
┃
┃ • ${usedPrefix}tarefas
┃   _Veja todas as suas tarefas_
┃
┃ • ${usedPrefix}concluir <número>
┃   _Marque uma tarefa como concluída_
┃
┃━━━━━━━━━━━━━━━━━━━━━━━━━
┃ 📊 *RESUMOS* (Grupos)
┃━━━━━━━━━━━━━━━━━━━━━━━━━
┃
┃ • ${usedPrefix}resumo [quantidade]
┃   _Resumo inteligente das últimas_
┃   _mensagens do grupo (10-100)_
┃
┃━━━━━━━━━━━━━━━━━━━━━━━━━
┃ 💡 *DICAS DE USO*
┃━━━━━━━━━━━━━━━━━━━━━━━━━
┃
┃ ✨ Você pode enviar imagens para
┃    a marIA analisar
┃
┃ ✨ A marIA lembra do contexto das
┃    suas últimas conversas
┃
┃ ✨ Todos os seus dados são salvos
┃    automaticamente
┃
┃ ✨ Use a marIA para se organizar
┃    melhor no dia a dia!
┃
┃━━━━━━━━━━━━━━━━━━━━━━━━━
┃ 📞 *EXEMPLOS PRÁTICOS*
┃━━━━━━━━━━━━━━━━━━━━━━━━━
┃
┃ ${usedPrefix}maria Qual a previsão do tempo?
┃ ${usedPrefix}lembrete 1h Ligar para João
┃ ${usedPrefix}nota Senha do WiFi: 12345
┃ ${usedPrefix}tarefa Enviar relatório
┃ ${usedPrefix}resumo 50
┃
┃━━━━━━━━━━━━━━━━━━━━━━━━━
┃
┃ 💼 _Desenvolvida para facilitar_
┃    _sua vida e aumentar sua_
┃    _produtividade!_
┃
╰━━━━━━━━━━━━━━━━━━━⬣`

  await m.reply(helpText)
}

handler.help = ["mariahelp"]
handler.tags = ["tools", "info"]
handler.command = /^(mariahelp|mariaajuda|helpmaria|ajudamaria)$/i

export default handler
