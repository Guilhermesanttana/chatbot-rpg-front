<template>
  <div 
    class="message animate-fade-in mb-4 flex"
    :class="{ 'justify-end': isUser, 'justify-start': !isUser }"
  >
    <div class="max-w-[80%]">
      <!-- Cabeçalho da mensagem -->
      <div class="flex items-center gap-2 mb-1 text-xs" :class="{ 'justify-end': isUser }">
        <span class="text-gray-400 font-mono">
          {{ isUser ? 'Você' : 'AI Companion' }}
        </span>
        <span class="text-gray-600">•</span>
        <span class="text-gray-500 font-mono text-[10px]">
          {{ formatTime(timestamp) }}
        </span>
      </div>

      <!-- Conteúdo da mensagem -->
      <div 
        class="message-bubble rounded-lg p-4 font-mono text-sm relative"
        :class="isUser ? 'bg-cyber-blue/20 border border-cyber-blue/50 text-white' : 'bg-cyber-card border border-cyber-magenta/30 text-gray-100'"
      >
        <!-- Texto da mensagem -->
        <div class="whitespace-pre-wrap leading-relaxed">{{ content }}</div>

        <!-- Metadados da resposta do bot -->
        <div v-if="!isUser && metadata" class="mt-3 pt-3 border-t border-gray-700 space-y-1">
          <div class="flex items-center gap-3 text-xs">
            <span class="text-cyber-magenta">
              <span class="opacity-70">Model:</span> {{ formatModelName(metadata.model) }}
            </span>
            <span class="text-gray-500">•</span>
            <span class="text-cyber-blue">
              <span class="opacity-70">Time:</span> {{ formatElapsedTime(metadata.elapsed_ms) }}
            </span>
          </div>

          <!-- Botão para mostrar fontes -->
          <button
            v-if="metadata.source_chunks && metadata.source_chunks.length > 0"
            @click="showSources = !showSources"
            class="mt-2 text-xs text-cyber-blue hover:text-cyber-magenta transition-colors flex items-center gap-1"
          >
            <svg 
              class="w-3 h-3 transition-transform"
              :class="{ 'rotate-180': showSources }"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
            {{ showSources ? 'Ocultar fontes' : `Mostrar fontes (${metadata.source_chunks.length})` }}
          </button>
        </div>

        <!-- Botão de copiar -->
        <button
          v-if="!isUser"
          @click="copyToClipboard"
          class="absolute top-2 right-2 p-1 hover:bg-white/10 rounded transition-colors"
          :title="copied ? 'Copiado!' : 'Copiar resposta'"
        >
          <svg v-if="!copied" class="w-4 h-4 text-gray-400 hover:text-cyber-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <svg v-else class="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </button>
      </div>

      <!-- Lista de fontes (expansível) -->
      <SourceList 
        v-if="!isUser && showSources && metadata?.source_chunks" 
        :sources="metadata.source_chunks"
        class="mt-2"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import SourceList from './SourceList.vue';
import { formatElapsedTime, formatModelName } from '../utils.js';

const props = defineProps({
  content: {
    type: String,
    required: true
  },
  isUser: {
    type: Boolean,
    default: false
  },
  timestamp: {
    type: Number,
    default: () => Date.now()
  },
  metadata: {
    type: Object,
    default: null
  }
});

const showSources = ref(false);
const copied = ref(false);

// Formata timestamp para exibição
const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
};

// Copia o conteúdo da mensagem para o clipboard
const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(props.content);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch (error) {
    console.error('Erro ao copiar:', error);
  }
};
</script>

<style scoped>
.message-bubble {
  box-shadow: 0 0 20px rgba(0, 243, 255, 0.1);
}

.message-bubble:hover {
  box-shadow: 0 0 30px rgba(0, 243, 255, 0.2);
}
</style>
