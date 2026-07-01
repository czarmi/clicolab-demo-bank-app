import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api/auth';

const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('clicolab_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function loginRequest(email, password) {
  const { data } = await api.post('/login', { email, password });
  return data;
}

export async function registerRequest(email, password, fullName) {
  const { data } = await api.post('/register', { email, password, fullName });
  return data;
}

export function samlLoginUrl() {
  return `${API_URL}/saml/login`;
}

export async function getCurrentUser() {
  const { data } = await api.get('/me');
  return data;
}

export function logout() {
  localStorage.removeItem('clicolab_token');
}
