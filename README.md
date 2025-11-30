# 🤖 Cyberpunk AI Companion

Frontend para interagir com API de chatbot baseada em PDFs. Construído com **Vue 3 + Vite + TailwindCSS** com tema cyberpunk.

![Vue 3](https://img.shields.io/badge/Vue-3.4-4FC08D?style=flat-square&logo=vue.js)
![Vite](https://img.shields.io/badge/Vite-5.1-646CFF?style=flat-square&logo=vite)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat-square&logo=tailwind-css)

## 📸 Preview

<div align="center">
  <img src="https://i.imgur.com/bVW5Jea.png" alt="Interface Principal" width="100%">
  <p><em>Interface principal do chat com tema cyberpunk</em></p>
  
  <img src="https://i.imgur.com/ovNOZBD.png" alt="Visualização de Fontes" width="100%">
  <p><em>Visualização de fontes e chunks recuperados dos PDFs</em></p>
</div>

## 📋 Descrição

Interface web completa e responsiva para conversar com um chatbot alimentado por IA que responde perguntas baseadas em documentos PDF. A aplicação se conecta a uma API FastAPI existente e oferece uma experiência de usuário fluida com tema cyberpunk dark.

## ✨ Funcionalidades

### 💬 Chat Interativo
- Interface de chat em tempo real com mensagens do usuário e do bot
- Scroll automático até a última mensagem
- Histórico de conversas salvo no `localStorage`
- Botão para limpar histórico local
- Indicador de "digitando..." durante o processamento

### 📊 Visualização de Dados
- Exibição do modelo utilizado em cada resposta
- Tempo de resposta (elapsed time) formatado
- Botão "Mostrar fontes" para visualizar chunks recuperados
- Detalhes das fontes: documento, página e score de similaridade
- Botão de copiar resposta do bot

### 🎛️ Sidebar Funcional
- **Status da API**: Indicador visual com pulsação (verde/vermelho)
- **Ingerir PDFs**: Botão para chamar `POST /ingest` com feedback de progresso
- **Modelos Disponíveis**: Lista de modelos detectados via `GET /models`
- **Limpar Histórico**: Remove todas as conversas locais

### 🎨 Design Cyberpunk
- Tema escuro por padrão
- Acentos em azul elétrico (#00f3ff) e magenta (#ff00ff)
- Tipografia monoespaçada (JetBrains Mono)
- Animações sutis (fade-in, pulse-glow)
- Efeitos de hover e bordas brilhantes
- Totalmente responsivo (desktop e mobile)

## 🚀 Instalação e Execução

### Pré-requisitos

- **Node.js** 18+ e **npm** (ou yarn/pnpm)
- **API Backend** rodando em `http://localhost:8000` (ou configurar URL customizada)

### Passo 1: Clone ou navegue até o diretório

```bash
cd c:\dev\chatbot-rpg-front
```

### Passo 2: Instale as dependências

```bash
npm install
```

### Passo 3: Configure a URL da API (opcional)

Copie o arquivo `.env.example` para `.env` e ajuste se necessário:

```bash
copy .env.example .env
```

Edite o arquivo `.env`:

```env
VITE_API_URL=http://localhost:8000
```

> **Nota:** Se a API estiver rodando em outra porta ou host, ajuste a variável `VITE_API_URL`.

### Passo 4: Inicie o servidor de desenvolvimento

```bash
npm run dev
```

A aplicação abrirá automaticamente no navegador em `http://localhost:3000`.

## 📁 Estrutura do Projeto

```
chatbot-rpg-front/
├── src/
│   ├── components/
│   │   ├── ChatMessage.vue      # Componente de mensagem individual
│   │   ├── Sidebar.vue          # Barra lateral com controles
│   │   ├── SourceList.vue       # Lista de fontes/chunks
│   │   └── LoadingIndicator.vue # Indicador de carregamento
│   ├── pages/
│   │   └── ChatPage.vue         # Página principal do chat
│   ├── api.js                   # Funções para chamadas à API
│   ├── utils.js                 # Utilitários (localStorage, formatação)
│   ├── App.vue                  # Componente raiz
│   ├── main.js                  # Entrada da aplicação
│   └── style.css                # Estilos globais (Tailwind + custom)
├── index.html                   # HTML base
├── package.json                 # Dependências e scripts
├── vite.config.js               # Configuração do Vite
├── tailwind.config.js           # Configuração do Tailwind
├── postcss.config.js            # Configuração do PostCSS
├── .env                         # Variáveis de ambiente (não versionado)
├── .env.example                 # Exemplo de variáveis de ambiente
├── .gitignore                   # Arquivos ignorados pelo Git
└── README.md                    # Este arquivo
```

## 🛠️ Scripts Disponíveis

```bash
# Inicia servidor de desenvolvimento (http://localhost:3000)
npm run dev

# Cria build de produção
npm run build

# Preview do build de produção
npm run preview
```

## 🔌 API Endpoints Utilizados

A aplicação consome os seguintes endpoints da API FastAPI:

| Método | Endpoint   | Descrição                                      |
|--------|-----------|------------------------------------------------|
| GET    | `/health`  | Verifica status da API                        |
| POST   | `/ingest`  | Ingere PDFs no sistema                        |
| POST   | `/chat`    | Envia pergunta e recebe resposta              |
| GET    | `/models`  | Lista modelos disponíveis via Ollama          |

### Exemplo de requisição `/chat`:

```json
POST http://localhost:8000/chat
Content-Type: application/json

{
  "question": "Qual é a regra para combate corpo a corpo?"
}
```

### Exemplo de resposta:

```json
{
  "answer": "A regra para combate corpo a corpo...",
  "source_chunks": [
    {
      "document": "manual.pdf",
      "page": 42,
      "content": "...",
      "score": 0.87
    }
  ],
  "model": "llama3.2",
  "elapsed_ms": 1523
}
```

## 🎨 Customização

### Cores do Tema Cyberpunk

Edite o arquivo `tailwind.config.js`:

```js
colors: {
  'cyber-blue': '#00f3ff',      // Azul neon
  'cyber-magenta': '#ff00ff',   // Magenta neon
  'cyber-dark': '#0a0e27',      // Fundo escuro
  'cyber-darker': '#050816',    // Fundo mais escuro
  'cyber-card': '#1a1f3a',      // Cards
}
```

### Fonte Monoespaçada

O projeto usa **JetBrains Mono** por padrão. Para alterar, edite `tailwind.config.js`:

```js
fontFamily: {
  'mono': ['Sua Fonte', 'monospace'],
}
```

### Timeout de Requisições

Para respostas muito longas do LLM, ajuste o timeout em `src/api.js`:

```js
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120000, // 2 minutos (em ms)
  // ...
});
```

## 🌐 Build para Produção

### Criar build otimizado:

```bash
npm run build
```

Os arquivos serão gerados na pasta `dist/`.

### Servir localmente o build:

```bash
npm run preview
```

### Deploy

Você pode fazer deploy do conteúdo da pasta `dist/` em qualquer servidor de arquivos estáticos:

- **Vercel**: `vercel --prod`
- **Netlify**: Arraste a pasta `dist/` no painel
- **GitHub Pages**: Configure para servir do branch `gh-pages`
- **Servidor próprio**: Copie `dist/` para o diretório do servidor (nginx, apache, etc.)

> **Importante:** Configure a variável de ambiente `VITE_API_URL` no serviço de deploy para apontar para o endereço correto da API em produção.

## 🐛 Troubleshooting

### API não conecta

1. Verifique se o backend está rodando: `http://localhost:8000/health`
2. Confirme a URL da API no arquivo `.env`
3. Verifique CORS no backend FastAPI

### Histórico não salva

- Verifique se o localStorage está habilitado no navegador
- Teste em modo anônimo para verificar extensões bloqueadoras

### Estilos não carregam

```bash
# Reinstale dependências do Tailwind
npm install -D tailwindcss postcss autoprefixer
```

### Fontes não carregam

- Verifique a conexão com Google Fonts no `index.html`
- Fallback para fontes do sistema está configurado

## 📝 Notas Técnicas

- **Persistência**: Dados salvos apenas no `localStorage` (não há persistência server-side)
- **Timeout**: Requisições com timeout de 2 minutos para suportar LLMs lentos
- **Responsividade**: Sidebar colapsável em mobile
- **Acessibilidade**: Botões com títulos descritivos e estados visuais claros
- **Performance**: Lazy loading de componentes, animações CSS otimizadas

## 🎯 Roadmap / Melhorias Futuras

- [ ] Suporte a markdown nas respostas do bot
- [ ] Upload de novos PDFs via interface
- [ ] Seleção de modelo antes de enviar pergunta
- [ ] Exportar histórico de conversa (JSON/TXT)
- [ ] Modo claro (light theme toggle)
- [ ] Suporte a voz (speech-to-text)
- [ ] Integração com autenticação (login/logout)
- [ ] PWA (Progressive Web App)

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto é open-source e está disponível sob a licença MIT.

## 👨‍💻 Autor

Guilherme Santana 
---

**Divirta-se explorando seus PDFs com IA! 🚀🤖**
