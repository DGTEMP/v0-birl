import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Bot,
  MessageSquare,
  Calendar,
  FileText,
  CheckSquare,
  BarChart3,
  Sparkles,
  Github,
  Download,
} from "lucide-react"

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Bot className="w-16 h-16 text-primary" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              TheMystic Bot MD
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Bot de WhatsApp multifuncional com IA integrada e secretária virtual marIA
          </p>
          <div className="flex gap-2 justify-center flex-wrap">
            <Badge variant="secondary">Node.js</Badge>
            <Badge variant="secondary">Baileys</Badge>
            <Badge variant="secondary">WhatsApp Bot</Badge>
            <Badge variant="secondary">IA Integrada</Badge>
          </div>
        </div>

        {/* marIA Feature Card */}
        <Card className="mb-12 border-primary/50 shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-primary" />
              <div>
                <CardTitle className="text-3xl">marIA - Secretária Virtual IA</CardTitle>
                <CardDescription className="text-base mt-2">
                  Assistente pessoal inteligente para organização e produtividade
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MessageSquare className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1">Assistente IA</h3>
                  <p className="text-sm text-muted-foreground">
                    Converse naturalmente e obtenha respostas inteligentes com análise de imagens
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1">Lembretes Inteligentes</h3>
                  <p className="text-sm text-muted-foreground">
                    Agende lembretes com notificações automáticas (minutos, horas, dias)
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1">Sistema de Notas</h3>
                  <p className="text-sm text-muted-foreground">
                    Salve e organize anotações importantes de forma rápida
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckSquare className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1">Gerenciador de Tarefas</h3>
                  <p className="text-sm text-muted-foreground">
                    Crie e acompanhe suas tarefas com controle de conclusão
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <BarChart3 className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1">Resumos de Grupos</h3>
                  <p className="text-sm text-muted-foreground">
                    Análise inteligente de conversas em grupos do WhatsApp
                  </p>
                </div>
              </div>
              <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                <p className="text-sm font-medium">
                  💼 Comandos principais: .maria, .lembrete, .nota, .tarefa, .resumo
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="w-5 h-5" />
                Downloads
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• YouTube (áudio/vídeo)</li>
                <li>• TikTok, Instagram, Facebook</li>
                <li>• Spotify, SoundCloud</li>
                <li>• MediaFire, Google Drive</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                IA & Ferramentas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• ChatGPT integrado</li>
                <li>• DALL-E (geração de imagens)</li>
                <li>• Conversores de mídia</li>
                <li>• Stickers personalizados</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="w-5 h-5" />
                Jogos & RPG
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Sistema de economia</li>
                <li>• Jogos interativos</li>
                <li>• Níveis e experiência</li>
                <li>• Aventuras e missões</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Installation */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Como Usar</CardTitle>
            <CardDescription>Este é um bot para WhatsApp que roda em Node.js</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted p-4 rounded-lg font-mono text-sm space-y-2">
              <div># Instalar dependências</div>
              <div className="text-primary">npm install</div>
              <div className="mt-3"># Iniciar o bot</div>
              <div className="text-primary">npm start</div>
            </div>
            <div className="flex gap-4 flex-wrap">
              <Button asChild>
                <a href="https://github.com/BrunoSobrino/TheMystic-Bot-MD" target="_blank" rel="noopener noreferrer">
                  <Github className="w-4 h-4 mr-2" />
                  Ver no GitHub
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a href="https://wa.me/5219992095479" target="_blank" rel="noopener noreferrer">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Contato
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Commands Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Comandos da marIA</CardTitle>
            <CardDescription>Exemplos de como usar a secretária virtual</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="p-3 bg-muted rounded-lg">
                  <code className="text-sm text-primary">.maria Como está o clima?</code>
                  <p className="text-xs text-muted-foreground mt-1">Converse com a IA</p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <code className="text-sm text-primary">.lembrete 30m Reunião</code>
                  <p className="text-xs text-muted-foreground mt-1">Criar lembrete</p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <code className="text-sm text-primary">.nota Comprar leite</code>
                  <p className="text-xs text-muted-foreground mt-1">Salvar nota</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="p-3 bg-muted rounded-lg">
                  <code className="text-sm text-primary">.tarefa Enviar relatório</code>
                  <p className="text-xs text-muted-foreground mt-1">Adicionar tarefa</p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <code className="text-sm text-primary">.tarefas</code>
                  <p className="text-xs text-muted-foreground mt-1">Ver todas as tarefas</p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <code className="text-sm text-primary">.resumo 50</code>
                  <p className="text-xs text-muted-foreground mt-1">Resumir conversa</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-16 text-sm text-muted-foreground">
          <p>Desenvolvido por Bruno Sobrino</p>
          <p className="mt-2">marIA - Secretária Virtual IA implementada com sucesso ✨</p>
        </div>
      </div>
    </div>
  )
}
