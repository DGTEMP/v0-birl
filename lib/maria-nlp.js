/**
 * marIA NLP - Sistema de Processamento de Linguagem Natural
 * Versão: 1.1.0
 * Autor: SpyHacke
 *
 * Sistema completo de NLP para a secretária virtual marIA
 * Permite conversação natural sem necessidade de comandos específicos
 */

class MariaNLP {
  constructor() {
    // Padrões de intenção para detecção
    this.intentPatterns = {
      // Saudações
      greeting: [/^(oi|olá|ola|hey|e aí|eai|bom dia|boa tarde|boa noite)/i, /^(hi|hello|hey there)/i],

      // Tarefas - Adicionar
      addTask: [
        /preciso (fazer|realizar|completar|terminar)/i,
        /tenho que (fazer|realizar|completar)/i,
        /(me lembra|lembrar) de/i,
        /não posso esquecer de/i,
        /anotar (tarefa|que preciso)/i,
        /adicionar tarefa/i,
        /nova tarefa/i,
        /criar tarefa/i,
      ],

      // Tarefas - Listar
      listTasks: [
        /(quais|qual) (são|é) (minhas|minha) tarefas/i,
        /o que preciso fazer/i,
        /(mostra|mostrar|ver|listar) (minhas )?tarefas/i,
        /lista de tarefas/i,
        /tarefas pendentes/i,
        /o que tenho (que fazer|pendente)/i,
      ],

      // Tarefas - Concluir
      completeTask: [
        /(terminei|completei|finalizei|concluí)/i,
        /(marcar como )?(concluída|completa|feita)/i,
        /pronto/i,
        /feito/i,
        /done/i,
      ],

      // Compromissos - Adicionar
      addAppointment: [
        /tenho (reunião|consulta|compromisso|encontro)/i,
        /(marcar|agendar) (reunião|consulta|compromisso)/i,
        /vou ter (reunião|consulta|compromisso)/i,
        /novo compromisso/i,
        /adicionar (à|na) agenda/i,
      ],

      // Compromissos - Listar
      listAppointments: [
        /o que tenho agendado/i,
        /(ver|mostrar|listar) (minha )?agenda/i,
        /(meus|minhas) compromissos/i,
        /o que está agendado/i,
        /próximos compromissos/i,
      ],

      // Notas - Adicionar
      addNote: [
        /(anotar|salvar|guardar) (que|isso)/i,
        /(criar|nova|adicionar) nota/i,
        /anota (aí|ai)/i,
        /salvar informação/i,
      ],

      // Notas - Listar
      listNotes: [/(ver|mostrar|listar) (minhas )?notas/i, /quais (são )?minhas notas/i, /o que anotei/i],

      // Status/Resumo
      status: [
        /como (está|esta) (meu )?progresso/i,
        /(me )?(mostra|mostrar) (meu )?status/i,
        /como (estou|vou)/i,
        /resumo/i,
        /visão geral/i,
      ],

      // Buscar
      search: [/(procurar|buscar|encontrar|pesquisar)/i, /onde (está|esta)/i, /tem algum/i, /existe/i],

      // Ajuda
      help: [
        /(ajuda|help|socorro)/i,
        /o que (você )?pode fazer/i,
        /(quais|qual) (são )?seus comandos/i,
        /como (usar|funciona)/i,
      ],
    }

    // Padrões de extração de entidades
    this.entityPatterns = {
      // Datas relativas
      today: /(hoje|hj)/i,
      tomorrow: /(amanhã|amanha)/i,
      yesterday: /(ontem)/i,

      // Dias da semana
      weekdays: {
        monday: /(segunda|seg)/i,
        tuesday: /(terça|terca|ter)/i,
        wednesday: /(quarta|qua)/i,
        thursday: /(quinta|qui)/i,
        friday: /(sexta|sex)/i,
        saturday: /(sábado|sabado|sab)/i,
        sunday: /(domingo|dom)/i,
      },

      // Horários
      time: /(\d{1,2}):?(\d{2})?\s*(h|hrs|horas|am|pm)?/i,

      // Prioridades
      priority: {
        urgent: /(urgente|emergência|emergencia|crítico|critico)/i,
        high: /(importante|prioritário|prioritario|alta)/i,
        medium: /(média|media|normal)/i,
        low: /(baixa|depois|quando der)/i,
      },
    }

    // Contexto de conversa (armazena últimas interações)
    this.conversationContext = new Map()
    this.contextTimeout = 5 * 60 * 1000 // 5 minutos
  }

  /**
   * Detecta a intenção principal da mensagem
   */
  detectIntent(text) {
    for (const [intent, patterns] of Object.entries(this.intentPatterns)) {
      for (const pattern of patterns) {
        if (pattern.test(text)) {
          return intent
        }
      }
    }
    return "unknown"
  }

  /**
   * Extrai entidades da mensagem (datas, horários, prioridades, etc)
   */
  extractEntities(text) {
    const entities = {
      date: null,
      time: null,
      priority: null,
      description: text,
    }

    // Extrair data
    if (this.entityPatterns.today.test(text)) {
      entities.date = "hoje"
    } else if (this.entityPatterns.tomorrow.test(text)) {
      entities.date = "amanhã"
    } else if (this.entityPatterns.yesterday.test(text)) {
      entities.date = "ontem"
    } else {
      // Verificar dias da semana
      for (const [day, pattern] of Object.entries(this.entityPatterns.weekdays)) {
        if (pattern.test(text)) {
          entities.date = day
          break
        }
      }
    }

    // Extrair horário
    const timeMatch = text.match(this.entityPatterns.time)
    if (timeMatch) {
      const hour = timeMatch[1]
      const minute = timeMatch[2] || "00"
      entities.time = `${hour}:${minute}`
    }

    // Extrair prioridade
    for (const [level, pattern] of Object.entries(this.entityPatterns.priority)) {
      if (pattern.test(text)) {
        entities.priority = level
        break
      }
    }

    // Limpar descrição removendo palavras-chave de comando
    entities.description = this.cleanDescription(text)

    return entities
  }

  /**
   * Limpa a descrição removendo palavras de comando
   */
  cleanDescription(text) {
    let cleaned = text

    // Remover palavras de comando comuns
    const commandWords = [
      /^(preciso|tenho que|me lembra de|não posso esquecer de|anotar que?)\s+/i,
      /^(fazer|realizar|completar)\s+/i,
      /\s+(hoje|amanhã|ontem)$/i,
      /\s+(urgente|importante|prioritário)$/i,
      /^(tenho|vou ter)\s+/i,
    ]

    for (const pattern of commandWords) {
      cleaned = cleaned.replace(pattern, "")
    }

    return cleaned.trim()
  }

  /**
   * Processa mensagem em linguagem natural
   */
  async processNaturalLanguage(userId, text) {
    let result = await this.attemptProcessing(userId, text)

    if (result.intent === "unknown" || result.needsRetry) {
      console.log("[marIA NLP] Primeira tentativa falhou, tentando estratégias alternativas...")
      result = await this.fallbackProcessing(userId, text, result)
    }

    if (!result.response && result.intent === "unknown") {
      result.response = this.generateHelpfulFallback(text)
    }

    // Atualizar contexto
    this.updateContext(userId, { intent: result.intent, entities: result.entities, timestamp: Date.now() })

    return result
  }

  /**
   * Primeira tentativa de processamento
   */
  async attemptProcessing(userId, text) {
    // Detectar intenção
    const intent = this.detectIntent(text)

    // Extrair entidades
    const entities = this.extractEntities(text)

    // Obter contexto anterior
    const context = this.getContext(userId)

    // Processar baseado na intenção
    const result = {
      intent,
      entities,
      context,
      action: null,
      response: null,
      needsMoreInfo: false,
      needsRetry: false,
    }

    switch (intent) {
      case "greeting":
        result.response = this.generateGreeting()
        break

      case "addTask":
        result.action = "addTask"
        result.response = this.formatTaskAddition(entities)
        break

      case "listTasks":
        result.action = "listTasks"
        break

      case "completeTask":
        result.action = "completeTask"
        // Se não tiver ID no contexto, precisa perguntar
        if (!context.lastTaskId && !this.extractTaskId(text)) {
          result.needsMoreInfo = true
          result.response = "❓ Qual tarefa você completou? Me envie o ID da tarefa."
        }
        break

      case "addAppointment":
        result.action = "addAppointment"
        result.response = this.formatAppointmentAddition(entities)
        break

      case "listAppointments":
        result.action = "listAppointments"
        break

      case "addNote":
        result.action = "addNote"
        result.response = this.formatNoteAddition(entities)
        break

      case "listNotes":
        result.action = "listNotes"
        break

      case "status":
        result.action = "status"
        break

      case "search":
        result.action = "search"
        result.entities.searchTerm = this.extractSearchTerm(text)
        break

      case "help":
        result.action = "help"
        break

      default:
        result.needsRetry = true
    }

    return result
  }

  /**
   * Processamento de fallback com estratégias alternativas
   */
  async fallbackProcessing(userId, text, previousResult) {
    console.log("[marIA NLP] Executando fallback processing...")

    const context = this.getContext(userId)
    const result = { ...previousResult }

    // Estratégia 1: Usar contexto da conversa anterior
    if (context.lastIntent && this.canInferFromContext(text, context)) {
      console.log("[marIA NLP] Inferindo intenção do contexto...")
      result.intent = this.inferIntentFromContext(text, context)
      result.action = this.mapIntentToAction(result.intent)
      result.needsRetry = false

      if (result.action) {
        return result
      }
    }

    // Estratégia 2: Buscar palavras-chave mais flexíveis
    const flexibleIntent = this.detectFlexibleIntent(text)
    if (flexibleIntent !== "unknown") {
      console.log("[marIA NLP] Detectado com busca flexível:", flexibleIntent)
      result.intent = flexibleIntent
      result.action = this.mapIntentToAction(flexibleIntent)
      result.needsRetry = false

      if (result.action) {
        return result
      }
    }

    // Estratégia 3: Analisar se é uma resposta a uma pergunta anterior
    if (context.waitingForResponse) {
      console.log("[marIA NLP] Processando resposta a pergunta anterior...")
      result.intent = context.waitingForResponse.expectedIntent
      result.action = context.waitingForResponse.expectedAction
      result.entities = this.extractEntities(text)
      result.needsRetry = false

      // Limpar estado de espera
      context.waitingForResponse = null
      this.conversationContext.set(userId, context)

      return result
    }

    // Estratégia 4: Verificar se é um número (pode ser ID de tarefa/nota)
    if (/^\d+$/.test(text.trim())) {
      console.log("[marIA NLP] Detectado ID numérico...")
      if (context.lastIntent === "listTasks" || context.lastIntent === "completeTask") {
        result.intent = "completeTask"
        result.action = "completeTask"
        result.entities.taskId = text.trim()
        result.needsRetry = false
        return result
      }
    }

    // Estratégia 5: Verificar se contém palavras de ação genéricas
    const genericAction = this.detectGenericAction(text)
    if (genericAction) {
      console.log("[marIA NLP] Detectada ação genérica:", genericAction)
      result.intent = genericAction
      result.action = this.mapIntentToAction(genericAction)
      result.needsRetry = false
      return result
    }

    // Se ainda não conseguiu, marcar como desconhecido mas com sugestões
    result.intent = "unknown"
    result.needsRetry = false

    return result
  }

  /**
   * Verifica se pode inferir intenção do contexto
   */
  canInferFromContext(text, context) {
    if (!context.lastIntent) return false

    // Palavras que indicam continuação da conversa
    const continuationWords = /^(sim|não|ok|certo|isso|exato|correto|pode ser)/i
    return continuationWords.test(text)
  }

  /**
   * Infere intenção baseado no contexto anterior
   */
  inferIntentFromContext(text, context) {
    const affirmative = /^(sim|ok|certo|isso|exato|correto|pode ser|yes)/i
    const negative = /^(não|nao|nunca|jamais|no)/i

    if (affirmative.test(text)) {
      // Continuar com a última intenção
      return context.lastIntent
    }

    if (negative.test(text)) {
      // Cancelar ou pedir ajuda
      return "help"
    }

    return context.lastIntent
  }

  /**
   * Detecta intenção com padrões mais flexíveis
   */
  detectFlexibleIntent(text) {
    const lowerText = text.toLowerCase()

    // Palavras-chave para tarefas
    if (lowerText.includes("tarefa") || lowerText.includes("fazer") || lowerText.includes("preciso")) {
      if (lowerText.includes("ver") || lowerText.includes("lista") || lowerText.includes("quais")) {
        return "listTasks"
      }
      return "addTask"
    }

    // Palavras-chave para compromissos
    if (
      lowerText.includes("reunião") ||
      lowerText.includes("reuniao") ||
      lowerText.includes("compromisso") ||
      lowerText.includes("agenda")
    ) {
      if (lowerText.includes("ver") || lowerText.includes("lista") || lowerText.includes("quais")) {
        return "listAppointments"
      }
      return "addAppointment"
    }

    // Palavras-chave para notas
    if (lowerText.includes("nota") || lowerText.includes("anotar") || lowerText.includes("anota")) {
      if (lowerText.includes("ver") || lowerText.includes("lista") || lowerText.includes("minhas")) {
        return "listNotes"
      }
      return "addNote"
    }

    // Palavras-chave para status
    if (lowerText.includes("status") || lowerText.includes("resumo") || lowerText.includes("progresso")) {
      return "status"
    }

    // Palavras-chave para busca
    if (lowerText.includes("buscar") || lowerText.includes("procurar") || lowerText.includes("encontrar")) {
      return "search"
    }

    return "unknown"
  }

  /**
   * Detecta ações genéricas no texto
   */
  detectGenericAction(text) {
    const lowerText = text.toLowerCase()

    // Verbos de ação comuns
    if (/\b(adicionar|criar|novo|nova)\b/i.test(text)) {
      // Tentar determinar o que adicionar baseado em outras palavras
      if (lowerText.includes("tarefa")) return "addTask"
      if (lowerText.includes("compromisso") || lowerText.includes("reunião")) return "addAppointment"
      if (lowerText.includes("nota")) return "addNote"
      // Se não especificou, assumir tarefa
      return "addTask"
    }

    if (/\b(ver|mostrar|listar|exibir)\b/i.test(text)) {
      if (lowerText.includes("tarefa")) return "listTasks"
      if (lowerText.includes("compromisso") || lowerText.includes("agenda")) return "listAppointments"
      if (lowerText.includes("nota")) return "listNotes"
      // Se não especificou, mostrar status geral
      return "status"
    }

    if (/\b(concluir|terminar|finalizar|completar|pronto|feito)\b/i.test(text)) {
      return "completeTask"
    }

    return null
  }

  /**
   * Mapeia intenção para ação
   */
  mapIntentToAction(intent) {
    const intentActionMap = {
      addTask: "addTask",
      listTasks: "listTasks",
      completeTask: "completeTask",
      addAppointment: "addAppointment",
      listAppointments: "listAppointments",
      addNote: "addNote",
      listNotes: "listNotes",
      status: "status",
      search: "search",
      help: "help",
      greeting: null,
    }

    return intentActionMap[intent] || null
  }

  /**
   * Gera resposta de fallback útil quando não entende
   */
  generateHelpfulFallback(text) {
    // Analisar o que o usuário pode estar tentando fazer
    const suggestions = []

    if (text.length < 5) {
      return `🤔 Mensagem muito curta. Pode me explicar melhor o que precisa?

💡 *Exemplos:*
• "Preciso fazer compras"
• "Ver minhas tarefas"
• "Tenho reunião amanhã"`
    }

    // Sugerir baseado em palavras encontradas
    const lowerText = text.toLowerCase()

    if (lowerText.includes("fazer") || lowerText.includes("preciso")) {
      suggestions.push('• Adicionar tarefa: "Preciso fazer [descrição]"')
    }

    if (lowerText.includes("ver") || lowerText.includes("mostrar")) {
      suggestions.push('• Ver tarefas: "Quais minhas tarefas?"')
      suggestions.push('• Ver agenda: "O que tenho agendado?"')
    }

    if (lowerText.includes("quando") || lowerText.includes("horário")) {
      suggestions.push('• Ver agenda: "O que tenho agendado?"')
    }

    let response = `🤔 Desculpe, não entendi completamente.`

    if (suggestions.length > 0) {
      response += `\n\n💡 *Talvez você queira:*\n${suggestions.join("\n")}`
    } else {
      response += `\n\n💡 *Você pode:*
• Adicionar tarefas: "Preciso fazer X"
• Ver tarefas: "Quais minhas tarefas?"
• Adicionar compromissos: "Tenho reunião amanhã"
• Ver agenda: "O que tenho agendado?"
• Ver status: "Como estou?"`
    }

    response += `\n\n❓ Ou use *.maria ajuda* para ver todos os comandos!`

    return response
  }

  /**
   * Extrai ID de tarefa do texto
   */
  extractTaskId(text) {
    const match = text.match(/\b(\d{13})\b/)
    return match ? match[1] : null
  }

  /**
   * Extrai termo de busca
   */
  extractSearchTerm(text) {
    const cleaned = text.replace(/(procurar|buscar|encontrar|pesquisar|onde está|tem algum|existe)\s+/i, "")
    return cleaned.trim()
  }

  /**
   * Gera saudação personalizada
   */
  generateGreeting() {
    const greetings = [
      "👋 Olá! Como posso ajudar você hoje?",
      "😊 Oi! Estou aqui para te ajudar. O que precisa?",
      "✨ Olá! Pronta para te auxiliar. Me diga o que precisa!",
      "🌟 Oi! Sou a marIA, sua secretária virtual. Como posso ajudar?",
    ]
    return greetings[Math.floor(Math.random() * greetings.length)]
  }

  /**
   * Gera resposta para intenção desconhecida
   */
  generateUnknownResponse() {
    return `🤔 Desculpe, não entendi muito bem. 

Você pode:
• Adicionar tarefas: "Preciso fazer X"
• Ver tarefas: "Quais minhas tarefas?"
• Adicionar compromissos: "Tenho reunião amanhã"
• Ver agenda: "O que tenho agendado?"
• Ver status: "Como estou?"

Ou use .maria ajuda para ver todos os comandos!`
  }

  /**
   * Formata resposta de adição de tarefa
   */
  formatTaskAddition(entities) {
    let response = "✅ Tarefa adicionada!\n\n"
    response += `📝 ${entities.description}\n`

    if (entities.date) {
      response += `📅 ${this.formatDate(entities.date)}\n`
    }

    if (entities.time) {
      response += `⏰ ${entities.time}\n`
    }

    if (entities.priority) {
      response += `⚡ Prioridade: ${this.formatPriority(entities.priority)}\n`
    }

    return response
  }

  /**
   * Formata resposta de adição de compromisso
   */
  formatAppointmentAddition(entities) {
    let response = "✅ Compromisso adicionado!\n\n"
    response += `📅 ${entities.description}\n`

    if (entities.date) {
      response += `📆 ${this.formatDate(entities.date)}\n`
    }

    if (entities.time) {
      response += `⏰ ${entities.time}\n`
    }

    return response
  }

  /**
   * Formata resposta de adição de nota
   */
  formatNoteAddition(entities) {
    return `✅ Nota salva!\n\n📝 ${entities.description}`
  }

  /**
   * Formata data para exibição
   */
  formatDate(date) {
    const dateMap = {
      hoje: "Hoje",
      amanhã: "Amanhã",
      ontem: "Ontem",
      monday: "Segunda-feira",
      tuesday: "Terça-feira",
      wednesday: "Quarta-feira",
      thursday: "Quinta-feira",
      friday: "Sexta-feira",
      saturday: "Sábado",
      sunday: "Domingo",
    }
    return dateMap[date] || date
  }

  /**
   * Formata prioridade para exibição
   */
  formatPriority(priority) {
    const priorityMap = {
      urgent: "🔴 Urgente",
      high: "🟠 Alta",
      medium: "🟡 Média",
      low: "🟢 Baixa",
    }
    return priorityMap[priority] || priority
  }

  /**
   * Obtém contexto de conversa do usuário
   */
  getContext(userId) {
    const context = this.conversationContext.get(userId)

    if (!context) {
      return { history: [], lastIntent: null, lastTaskId: null, waitingForResponse: null }
    }

    // Verificar se o contexto expirou
    if (Date.now() - context.timestamp > this.contextTimeout) {
      this.conversationContext.delete(userId)
      return { history: [], lastIntent: null, lastTaskId: null, waitingForResponse: null }
    }

    return context
  }

  /**
   * Atualiza contexto de conversa
   */
  updateContext(userId, data) {
    const context = this.getContext(userId)

    context.history.push(data)
    context.lastIntent = data.intent
    context.timestamp = Date.now()

    // Manter apenas últimas 10 interações
    if (context.history.length > 10) {
      context.history.shift()
    }

    this.conversationContext.set(userId, context)
  }

  /**
   * Limpa contexto de um usuário
   */
  clearContext(userId) {
    this.conversationContext.delete(userId)
  }

  /**
   * Verifica se o texto é um comando tradicional
   */
  isTraditionalCommand(text) {
    const commandPatterns = [
      /^(tarefa|task)\s+(adicionar|add|listar|list)/i,
      /^(agenda|compromisso)\s+(adicionar|add|listar|list)/i,
      /^(nota|note)\s+(adicionar|add|listar|list)/i,
      /^(ajuda|help)$/i,
      /^(status|resumo)$/i,
    ]

    return commandPatterns.some((pattern) => pattern.test(text))
  }

  /**
   * Analisa sentimento da mensagem (básico)
   */
  analyzeSentiment(text) {
    const positiveWords = /(obrigad|valeu|legal|ótimo|otimo|bom|excelente|perfeito)/i
    const negativeWords = /(ruim|péssimo|pessimo|problema|erro|não funciona)/i

    if (positiveWords.test(text)) return "positive"
    if (negativeWords.test(text)) return "negative"
    return "neutral"
  }

  /**
   * Gera sugestões baseadas no contexto
   */
  generateSuggestions(userId) {
    const context = this.getContext(userId)
    const suggestions = []

    if (context.lastIntent === "addTask") {
      suggestions.push("Ver minhas tarefas")
      suggestions.push("Adicionar outra tarefa")
    } else if (context.lastIntent === "listTasks") {
      suggestions.push("Marcar tarefa como concluída")
      suggestions.push("Adicionar nova tarefa")
    } else if (context.lastIntent === "addAppointment") {
      suggestions.push("Ver minha agenda")
      suggestions.push("Adicionar outro compromisso")
    }

    return suggestions
  }
}

// Exportar instância única (singleton)
const mariaNLP = new MariaNLP()

export default mariaNLP
