<template>
  <div class="source-list">
    <div 
      v-for="(source, index) in sources" 
      :key="index"
      class="source-item bg-cyber-darker/50 border border-cyber-blue/20 rounded p-3 mb-2 text-xs font-mono hover:border-cyber-blue/40 transition-colors"
    >
      <!-- Cabeçalho da fonte -->
      <div class="flex items-center justify-between mb-2">
        <div class="flex items-center gap-2">
          <svg class="w-4 h-4 text-cyber-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span class="text-gray-300 font-semibold">{{ source.document || 'Documento desconhecido' }}</span>
        </div>
        <div class="flex items-center gap-3">
          <span v-if="source.page !== undefined" class="text-gray-500">
            Página {{ source.page }}
          </span>
          <span 
            v-if="source.score !== undefined" 
            class="px-2 py-0.5 rounded text-[10px]"
            :class="getScoreClass(source.score)"
          >
            Score: {{ source.score.toFixed(3) }}
          </span>
        </div>
      </div>

      <!-- Conteúdo do chunk -->
      <div class="text-gray-400 leading-relaxed pl-6 border-l-2 border-cyber-magenta/30">
        {{ source.content || source.text || 'Sem conteúdo' }}
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  sources: {
    type: Array,
    required: true
  }
});

// Define a classe de cor baseada no score
const getScoreClass = (score) => {
  if (score >= 0.8) return 'bg-green-500/20 text-green-400';
  if (score >= 0.6) return 'bg-yellow-500/20 text-yellow-400';
  return 'bg-red-500/20 text-red-400';
};
</script>
