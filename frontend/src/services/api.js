// Configurazione base per le chiamate API
const API_BASE_URL = 'http://localhost:5001';

// Funzione helper per fare richieste
const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Qualcosa è andato storto');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// API Endpoints
export const api = {
  // Test connessione
  testConnection: () => apiRequest('/'),

  // Autenticazione
  register: (userData) => apiRequest('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),

  login: (credentials) => apiRequest('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),

  getProfile: () => apiRequest('/api/auth/profile'),

  // Quiz (per dopo)
  getQuizzes: () => apiRequest('/api/quizzes'),
  getQuiz: (id) => apiRequest(`/api/quizzes/${id}`),
  createQuiz: (quizData) => apiRequest('/api/quizzes', {
    method: 'POST',
    body: JSON.stringify(quizData),
  }),
};

export default api;