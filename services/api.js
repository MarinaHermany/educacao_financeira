import AsyncStorage from '@react-native-async-storage/async-storage';

// Defina EXPO_PUBLIC_API_URL para o destino atual: web, emulador ou IP da rede local.
export const API = (process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000').replace(/\/$/, '');

export async function fetchAutenticado(endpoint, options = {}) {
  const token = await AsyncStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;

  const resposta = await fetch(`${API}${endpoint}`, { ...options, headers });
  const dados = await resposta.json().catch(() => null);
  if (!resposta.ok) throw new Error(dados?.mensagem || 'Não foi possível concluir a solicitação.');
  return dados;
}
