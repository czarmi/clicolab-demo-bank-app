import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api/auth';

export async function loginRequest(email, password) {
  const { data } = await axios.post(`${API_URL}/login`, { email, password });
  return data;
}

export async function registerRequest(email, password, fullName) {
  const { data } = await axios.post(`${API_URL}/register`, { email, password, fullName });
  return data;
}

export function samlLoginUrl() {
  return `${API_URL}/saml/login`;
}
