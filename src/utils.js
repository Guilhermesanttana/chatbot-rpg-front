/**
 * Utilitários para gerenciamento de localStorage
 */

const STORAGE_KEY = 'cyberpunk_chat_history';

/**
 * Salva o histórico de chat no localStorage
 * @param {Array} messages - Array de mensagens
 */
export const saveMessages = (messages) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  } catch (error) {
    console.error('Erro ao salvar mensagens:', error);
  }
};

/**
 * Carrega o histórico de chat do localStorage
 * @returns {Array} Array de mensagens ou array vazio
 */
export const loadMessages = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Erro ao carregar mensagens:', error);
    return [];
  }
};

/**
 * Limpa o histórico de chat do localStorage
 */
export const clearMessages = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Erro ao limpar mensagens:', error);
  }
};

/**
 * Formata o tempo de resposta em ms para string legível
 * @param {number} ms - Tempo em milissegundos
 * @returns {string} Tempo formatado
 */
export const formatElapsedTime = (ms) => {
  if (ms < 1000) return `${Math.round(ms)}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}m ${seconds}s`;
};

/**
 * Formata o nome do modelo para exibição
 * @param {string} model - Nome do modelo
 * @returns {string} Nome formatado
 */
export const formatModelName = (model) => {
  if (!model) return 'Unknown Model';
  return model.replace(/[_-]/g, ' ').toUpperCase();
};

/**
 * Cria um ID único para mensagens
 * @returns {string} ID único
 */
export const generateMessageId = () => {
  return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};
