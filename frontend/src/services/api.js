const API_URL = 'https://knowit-scrf.onrender.com/api' ||  'http://localhost:5001/api';

// Helper per gestire token
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};


// AUTH API


export const registerUser = async (username, email, password) => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password })
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Errore durante la registrazione');
  }
  
  return response.json();
};

export const loginUser = async (email, password) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Errore durante il login');
  }
  
  return response.json();
};

export const getCurrentUser = async () => {
  const response = await fetch(`${API_URL}/auth/me`, {
    headers: getAuthHeaders()
  });
  
  if (!response.ok) {
    throw new Error('Errore nel recupero dati utente');
  }
  
  return response.json();
};


// QUIZ API


export const getAllQuizzes = async (filters = {}) => {
  const queryParams = new URLSearchParams();
  
  if (filters.category) queryParams.append('category', filters.category);
  if (filters.search) queryParams.append('search', filters.search);
  
  const authHeaders = getAuthHeaders();
  
  // DEBUG
  console.log('Headers inviati:', authHeaders);
  console.log('URL:', `${API_URL}/quizzes?${queryParams}`);
  
  const response = await fetch(`${API_URL}/quizzes?${queryParams}`, {
    headers: authHeaders
  });
  
  if (!response.ok) {
    throw new Error('Errore nel recupero dei quiz');
  }
  
  return response.json();
};

export const getQuizById = async (quizId) => {
  const response = await fetch(`${API_URL}/quizzes/${quizId}`, {
    headers: getAuthHeaders()
  });
  
  if (!response.ok) {
    throw new Error('Errore nel recupero del quiz');
  }
  
  return response.json();
};

export const createQuiz = async (quizData) => {
  const response = await fetch(`${API_URL}/quizzes`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(quizData)
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Errore nella creazione del quiz');
  }
  
  return response.json();
};

export const addQuestion = async (quizId, questionData) => {
  const response = await fetch(`${API_URL}/quizzes/${quizId}/questions`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(questionData)
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Errore nell\'aggiunta della domanda');
  }
  
  return response.json();
};

export const deleteQuiz = async (quizId) => {
  const response = await fetch(`${API_URL}/quizzes/${quizId}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Errore nell\'eliminazione del quiz');
  }
  
  return response.json();
};

export const getMyQuizzes = async () => {
  const response = await fetch(`${API_URL}/quizzes/my/quizzes`, {
    headers: getAuthHeaders()
  });
  
  if (!response.ok) {
    throw new Error('Errore nel recupero dei tuoi quiz');
  }
  
  return response.json();
};


// TEST CONNECTION


export const testConnection = async () => {
  const response = await fetch(`${API_URL}/test`);
  return response.json();
};


// RESULTS Aprocess.envI

export const saveResult = async (resultData) => {
  const response = await fetch(`${API_URL}/results`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(resultData)
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Errore nel salvataggio del risultato');
  }
  
  return response.json();
};

export const getQuizLeaderboard = async (quizId, limit = 10) => {
  const response = await fetch(`${API_URL}/results/quiz/${quizId}?limit=${limit}`, {
    headers: getAuthHeaders()
  });
  
  if (!response.ok) {
    throw new Error('Errore nel recupero della leaderboard');
  }
  
  return response.json();
};

export const getUserResults = async (userId) => {
  const response = await fetch(`${API_URL}/results/user/${userId}`, {
    headers: getAuthHeaders()
  });
  
  if (!response.ok) {
    throw new Error('Errore nel recupero dei risultati utente');
  }
  
  return response.json();
};

export const getGlobalStats = async () => {
  const response = await fetch(`${API_URL}/results/stats/global`, {
    headers: getAuthHeaders()
  });
  
  if (!response.ok) {
    throw new Error('Errore nel recupero delle statistiche');
  }
  
  return response.json();
};

export const deleteResult = async (resultId) => {
  const response = await fetch(`${API_URL}/results/${resultId}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Errore nell\'eliminazione del risultato');
  }
  
  return response.json();
};