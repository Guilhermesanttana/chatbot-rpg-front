<template>
  <div id="app" class="flex h-screen overflow-hidden bg-cyber-darker">
    <!-- Sidebar -->
    <Sidebar 
      :isMobileOpen="sidebarOpen"
      @clear-history="handleClearHistory"
    />

    <!-- Main Content -->
    <main class="flex-1 overflow-hidden">
      <ChatPage 
        ref="chatPageRef"
        :sidebarOpen="sidebarOpen"
        @toggle-sidebar="toggleSidebar"
      />
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Sidebar from './components/Sidebar.vue';
import ChatPage from './pages/ChatPage.vue';
import { clearMessages } from './utils.js';

const sidebarOpen = ref(false);
const chatPageRef = ref(null);

// Toggle da sidebar (mobile)
const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value;
};

// Limpa o histórico de mensagens
const handleClearHistory = () => {
  if (confirm('Tem certeza que deseja limpar todo o histórico de conversas?')) {
    clearMessages();
    if (chatPageRef.value) {
      chatPageRef.value.clearHistory();
    }
  }
};
</script>

<style>
/* Reset e estilos globais */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
  overflow: hidden;
}

body {
  font-family: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;
  background-color: #050816;
  color: #ffffff;
}

#app {
  height: 100vh;
}

/* Estilos de seleção cyberpunk */
::selection {
  background-color: rgba(0, 243, 255, 0.3);
  color: #ffffff;
}

::-moz-selection {
  background-color: rgba(0, 243, 255, 0.3);
  color: #ffffff;
}

/* Estilos de scrollbar global */
::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

::-webkit-scrollbar-track {
  background: rgba(10, 14, 39, 0.5);
}

::-webkit-scrollbar-thumb {
  background: rgba(0, 243, 255, 0.3);
  border-radius: 5px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 243, 255, 0.5);
}

/* Animações */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in {
  animation: fadeIn 0.3s ease-out;
}

/* Estilos responsivos */
@media (max-width: 768px) {
  body {
    font-size: 14px;
  }
}
</style>
