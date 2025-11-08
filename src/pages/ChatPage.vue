<template>
  <div class="chat-page flex flex-col h-screen bg-cyber-darker">
    <!-- Header -->
    <header class="bg-cyber-card border-b border-cyber-blue/20 px-6 py-4 flex items-center justify-between">
      <div class="flex items-center gap-4">
        <button
          @click="toggleSidebar"
          class="md:hidden p-2 hover:bg-cyber-blue/10 rounded transition-colors"
        >
          <svg class="w-6 h-6 text-cyber-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div>
          <h1 class="text-2xl font-mono font-bold text-cyber-blue">
            Cyberpunk AI Companion
          </h1>
          <p class="text-xs text-gray-400 font-mono">Your RPG PDF Knowledge Assistant</p>
        </div>
      </div>
      
      <!-- Theme toggle (opcional, mas sempre dark por padrão) -->
      <div class="flex items-center gap-2">
        <div class="text-xs text-gray-500 font-mono">
          {{ messages.length }} mensagens
        </div>
      </div>
    </header>

    <!-- Chat Container -->
    <div class="flex-1 overflow-y-auto px-6 py-4" ref="chatContainer">
      <!-- Mensagem de boas-vindas -->
      <div v-if="messages.length === 0" class="max-w-2xl mx-auto mt-20 text-center">
        <div class="text-6xl mb-6">🤖</div>
        <h2 class="text-3xl font-mono font-bold text-cyber-blue mb-4">
          Bem-vindo ao Cyberpunk AI Companion
        </h2>
        <p class="text-gray-400 font-mono mb-8">
          Seu assistente de RPG alimentado por IA. Faça perguntas sobre os PDFs carregados e receba respostas precisas com as fontes de informação.
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl mx-auto">
          <div class="bg-cyber-card border border-cyber-blue/30 rounded-lg p-4 text-left">
            <div class="text-cyber-magenta font-mono font-bold mb-2">💡 Dica</div>
            <p class="text-sm text-gray-400 font-mono">
              Use a sidebar para ingerir PDFs antes de começar a conversar.
            </p>
          </div>
          <div class="bg-cyber-card border border-cyber-blue/30 rounded-lg p-4 text-left">
            <div class="text-cyber-magenta font-mono font-bold mb-2">🎯 Recursos</div>
            <p class="text-sm text-gray-400 font-mono">
              Visualize fontes, modelos usados e tempo de resposta em cada mensagem.
            </p>
          </div>
        </div>
      </div>

      <!-- Mensagens do chat -->
      <div v-else class="max-w-4xl mx-auto">
        <ChatMessage
          v-for="message in messages"
          :key="message.id"
          :content="message.content"
          :isUser="message.isUser"
          :timestamp="message.timestamp"
          :metadata="message.metadata"
        />
        
        <!-- Loading indicator -->
        <LoadingIndicator v-if="isLoading" text="AI pensando..." />
      </div>
    </div>

    <!-- Input Area -->
    <div class="bg-cyber-card border-t border-cyber-blue/20 px-6 py-4">
      <div class="max-w-4xl mx-auto">
        <!-- Error message -->
        <div 
          v-if="errorMessage" 
          class="mb-3 bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-2 rounded font-mono text-sm flex items-center justify-between"
        >
          <span>{{ errorMessage }}</span>
          <button @click="errorMessage = ''" class="hover:text-red-300">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="sendMessage" class="flex gap-3">
          <input
            v-model="inputMessage"
            type="text"
            placeholder="Digite sua pergunta sobre os PDFs..."
            class="flex-1 bg-cyber-darker border border-cyber-blue/30 rounded-lg px-4 py-3 text-white font-mono placeholder-gray-500 focus:outline-none focus:border-cyber-blue transition-colors"
            :disabled="isLoading"
          />
          <button
            type="submit"
            :disabled="!inputMessage.trim() || isLoading"
            class="bg-cyber-blue hover:bg-cyber-blue/80 text-cyber-darker font-mono font-bold px-6 py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <svg 
              v-if="!isLoading"
              class="w-5 h-5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            <svg 
              v-else
              class="w-5 h-5 animate-spin" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span class="hidden sm:inline">{{ isLoading ? 'Enviando...' : 'Enviar' }}</span>
          </button>
        </form>

        <div class="mt-2 text-xs text-gray-500 font-mono text-center">
          Pressione Enter para enviar • Histórico salvo localmente
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch } from 'vue';
import ChatMessage from '../components/ChatMessage.vue';
import LoadingIndicator from '../components/LoadingIndicator.vue';
import { sendChat } from '../api.js';
import { saveMessages, loadMessages, generateMessageId } from '../utils.js';

const props = defineProps({
  sidebarOpen: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['toggle-sidebar']);

// Estado
const messages = ref([]);
const inputMessage = ref('');
const isLoading = ref(false);
const errorMessage = ref('');
const chatContainer = ref(null);

// Toggle da sidebar (mobile)
const toggleSidebar = () => {
  emit('toggle-sidebar');
};

// Envia mensagem para o chatbot
const sendMessage = async () => {
  if (!inputMessage.value.trim() || isLoading.value) return;

  const userMessage = {
    id: generateMessageId(),
    content: inputMessage.value,
    isUser: true,
    timestamp: Date.now()
  };

  // Adiciona mensagem do usuário
  messages.value.push(userMessage);
  const question = inputMessage.value;
  inputMessage.value = '';
  errorMessage.value = '';

  // Scroll para o final
  await scrollToBottom();

  // Indica que está carregando
  isLoading.value = true;

  try {
    // Chama a API
    const result = await sendChat(question);

    if (result.success) {
      // Adiciona resposta do bot
      const botMessage = {
        id: generateMessageId(),
        content: result.data.answer,
        isUser: false,
        timestamp: Date.now(),
        metadata: {
          model: result.data.model,
          elapsed_ms: result.data.elapsed_ms,
          source_chunks: result.data.source_chunks || []
        }
      };
      messages.value.push(botMessage);
    } else {
      // Mostra erro
      errorMessage.value = result.error;
      
      // Adiciona mensagem de erro no chat
      const errorBotMessage = {
        id: generateMessageId(),
        content: `❌ Erro: ${result.error}`,
        isUser: false,
        timestamp: Date.now(),
        metadata: null
      };
      messages.value.push(errorBotMessage);
    }
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error);
    errorMessage.value = 'Erro inesperado ao enviar mensagem';
  } finally {
    isLoading.value = false;
    await scrollToBottom();
  }
};

// Scroll automático para o final
const scrollToBottom = async () => {
  await nextTick();
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
  }
};

// Salva mensagens sempre que houver mudança
watch(messages, (newMessages) => {
  saveMessages(newMessages);
}, { deep: true });

// Carrega mensagens ao montar
onMounted(() => {
  const savedMessages = loadMessages();
  if (savedMessages.length > 0) {
    messages.value = savedMessages;
    nextTick(() => scrollToBottom());
  }
});

// Expõe método para limpar histórico (usado pelo App.vue)
defineExpose({
  clearHistory: () => {
    messages.value = [];
  }
});
</script>

<style scoped>
/* Custom scrollbar */
.chat-page > div:nth-child(2)::-webkit-scrollbar {
  width: 8px;
}

.chat-page > div:nth-child(2)::-webkit-scrollbar-track {
  background: rgba(10, 14, 39, 0.5);
}

.chat-page > div:nth-child(2)::-webkit-scrollbar-thumb {
  background: rgba(0, 243, 255, 0.3);
  border-radius: 4px;
}

.chat-page > div:nth-child(2)::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 243, 255, 0.5);
}
</style>
