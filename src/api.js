import axios from 'axios';

// Configuração da API base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Criar instância do axios com configuração padrão
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120000, // 2 minutos (importante para respostas longas do LLM)
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Verifica o status de saúde da API
 * @returns {Promise<Object>} Status da API
 */
export const checkHealth = async () => {
  try {
    const response = await api.get('/health');
    return { success: true, data: response.data };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.detail || error.message || 'Erro ao conectar com a API' 
    };
  }
};

/**
 * Ingere PDFs no sistema
 * @returns {Promise<Object>} Resultado da ingestão
 */
export const ingestPDFs = async () => {
  try {
    const response = await api.post('/ingest');
    return { success: true, data: response.data };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.detail || error.message || 'Erro ao ingerir PDFs' 
    };
  }
};

/**
 * Envia uma pergunta para o chatbot
 * @param {string} question - Pergunta do usuário
 * @returns {Promise<Object>} Resposta do chatbot com answer, source_chunks, model, elapsed_ms
 */
export const sendChat = async (question) => {
  try {
    const response = await api.post('/chat', { question });
    return { success: true, data: response.data };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.detail || error.message || 'Erro ao enviar mensagem' 
    };
  }
};

/**
 * Obtém lista de modelos disponíveis
 * @returns {Promise<Object>} Lista de modelos
 */
export const getModels = async () => {
  try {
    const response = await api.get('/models');
    return { success: true, data: response.data };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.detail || error.message || 'Erro ao buscar modelos' 
    };
  }
};

export default {
  checkHealth,
  ingestPDFs,
  sendChat,
  getModels,
};
