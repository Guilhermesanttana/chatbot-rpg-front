<template>
  <aside 
    class="sidebar bg-cyber-card border-r border-cyber-blue/20 h-screen w-80 flex flex-col"
    :class="{ 'mobile-hidden': !isMobileOpen }"
  >
    <!-- Header da Sidebar -->
    <div class="p-6 border-b border-cyber-blue/20">
      <h2 class="text-xl font-mono font-bold text-cyber-blue">
        Cyberpunk AI
      </h2>
      <p class="text-xs text-gray-400 mt-1 font-mono">RPG Companion Assistant</p>
    </div>

    <!-- Status da API -->
    <div class="p-4 border-b border-cyber-blue/20">
      <div class="flex items-center gap-3">
        <div class="relative">
          <div 
            class="w-3 h-3 rounded-full"
            :class="apiStatus.isOnline ? 'bg-green-500' : 'bg-red-500'"
          ></div>
          <div 
            v-if="apiStatus.isOnline"
            class="absolute inset-0 w-3 h-3 rounded-full bg-green-500 animate-pulse-glow"
          ></div>
        </div>
        <div class="flex-1">
          <div class="text-xs font-mono text-gray-300">
            {{ apiStatus.isOnline ? 'API Online' : 'API Offline' }}
          </div>
          <div class="text-[10px] text-gray-500 font-mono">
            {{ apiStatus.message }}
          </div>
        </div>
        <button
          @click="checkAPIStatus"
          class="p-1 hover:bg-cyber-blue/10 rounded transition-colors"
          :disabled="apiStatus.checking"
          title="Verificar status"
        >
          <svg 
            class="w-4 h-4 text-cyber-blue"
            :class="{ 'animate-spin': apiStatus.checking }"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Actions -->
    <div class="p-4 space-y-3 flex-1 overflow-y-auto">
      <!-- Botão Ingerir PDFs -->
      <button
        @click="handleIngestPDFs"
        :disabled="ingestStatus.loading"
        class="w-full bg-cyber-magenta/20 hover:bg-cyber-magenta/30 border border-cyber-magenta text-white py-3 px-4 rounded font-mono text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <svg 
          v-if="!ingestStatus.loading" 
          class="w-5 h-5" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
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
        <span>{{ ingestStatus.loading ? 'Processando...' : 'Ingerir PDFs' }}</span>
      </button>

      <!-- Status da Ingestão -->
      <div 
        v-if="ingestStatus.message" 
        class="text-xs font-mono p-3 rounded border"
        :class="ingestStatus.success ? 'bg-green-500/10 border-green-500/50 text-green-400' : 'bg-red-500/10 border-red-500/50 text-red-400'"
      >
        {{ ingestStatus.message }}
      </div>

      <!-- Botão Modelos Disponíveis -->
      <button
        @click="toggleModels"
        class="w-full bg-cyber-blue/20 hover:bg-cyber-blue/30 border border-cyber-blue text-white py-3 px-4 rounded font-mono text-sm transition-all flex items-center justify-between"
      >
        <div class="flex items-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
          </svg>
          <span>Modelos Disponíveis</span>
        </div>
        <svg 
          class="w-4 h-4 transition-transform"
          :class="{ 'rotate-180': showModels }"
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <!-- Lista de Modelos -->
      <div 
        v-if="showModels"
        class="bg-cyber-darker/50 border border-cyber-blue/20 rounded p-3 space-y-2"
      >
        <div v-if="models.loading" class="text-xs text-gray-400 font-mono text-center py-2">
          Carregando modelos...
        </div>
        <div v-else-if="models.error" class="text-xs text-red-400 font-mono">
          {{ models.error }}
        </div>
        <div v-else-if="models.list.length === 0" class="text-xs text-gray-400 font-mono text-center py-2">
          Nenhum modelo encontrado
        </div>
        <div 
          v-else
          v-for="(model, index) in models.list" 
          :key="index"
          class="text-xs font-mono text-gray-300 bg-cyber-card/50 p-2 rounded border border-cyber-magenta/20 flex items-center gap-2"
        >
          <div class="w-2 h-2 rounded-full bg-cyber-magenta"></div>
          <span>{{ model }}</span>
        </div>
      </div>

      <!-- Botão Limpar Histórico -->
      <button
        @click="$emit('clear-history')"
        class="w-full bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-400 py-3 px-4 rounded font-mono text-sm transition-all flex items-center justify-center gap-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
        <span>Limpar Histórico</span>
      </button>
    </div>

    <!-- Footer -->
    <div class="p-4 border-t border-cyber-blue/20 text-[10px] text-gray-500 font-mono">
      <div class="flex items-center justify-between">
        <span>v1.0.0</span>
        <span>Made with 💜</span>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { checkHealth, ingestPDFs, getModels } from '../api.js';

defineEmits(['clear-history']);

const props = defineProps({
  isMobileOpen: {
    type: Boolean,
    default: false
  }
});

// Estado da API
const apiStatus = ref({
  isOnline: false,
  checking: false,
  message: 'Verificando...'
});

// Estado da ingestão
const ingestStatus = ref({
  loading: false,
  success: false,
  message: ''
});

// Estado dos modelos
const showModels = ref(false);
const models = ref({
  loading: false,
  error: null,
  list: []
});

// Verifica o status da API
const checkAPIStatus = async () => {
  apiStatus.value.checking = true;
  const result = await checkHealth();
  
  apiStatus.value.isOnline = result.success;
  apiStatus.value.message = result.success 
    ? `Conectado - ${result.data?.status || 'OK'}`
    : result.error;
  apiStatus.value.checking = false;
};

// Manipula a ingestão de PDFs
const handleIngestPDFs = async () => {
  ingestStatus.value.loading = true;
  ingestStatus.value.message = '';
  
  const result = await ingestPDFs();
  
  ingestStatus.value.loading = false;
  ingestStatus.value.success = result.success;
  ingestStatus.value.message = result.success
    ? `✓ ${result.data?.message || 'PDFs ingeridos com sucesso!'}`
    : `✗ ${result.error}`;

  // Limpa a mensagem após 5 segundos
  setTimeout(() => {
    ingestStatus.value.message = '';
  }, 5000);
};

// Toggle da lista de modelos
const toggleModels = async () => {
  showModels.value = !showModels.value;
  
  if (showModels.value && models.value.list.length === 0) {
    await loadModels();
  }
};

// Carrega os modelos disponíveis
const loadModels = async () => {
  models.value.loading = true;
  models.value.error = null;
  
  const result = await getModels();
  
  if (result.success) {
    models.value.list = result.data?.models || [];
  } else {
    models.value.error = result.error;
  }
  
  models.value.loading = false;
};

// Verifica o status ao montar o componente
onMounted(() => {
  checkAPIStatus();
  // Verifica o status a cada 30 segundos
  setInterval(checkAPIStatus, 30000);
});
</script>

<style scoped>
@media (max-width: 768px) {
  .sidebar.mobile-hidden {
    display: none;
  }
}
</style>
