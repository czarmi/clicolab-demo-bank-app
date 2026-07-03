import axios from 'axios';

const CURRENCY_API_URL = import.meta.env.VITE_CURRENCY_API_URL || '/api/currency';

export async function getCurrentRates() {
  const { data } = await axios.get(`${CURRENCY_API_URL}/current`);
  return data;
}

export async function getRateHistory() {
  const { data } = await axios.get(`${CURRENCY_API_URL}/history`);
  return data;
}
