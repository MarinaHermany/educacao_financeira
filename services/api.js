import AsyncStorage from '@react-native-async-storage/async-storage';

// Defina EXPO_PUBLIC_API_URL para o destino atual: web, emulador ou IP da rede local.
export const API = (process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000').replace(/\/$/, '');
let onSessaoExpirada = null;

export function registrarSessaoExpirada(callback) {
  onSessaoExpirada = callback;
  return () => { if (onSessaoExpirada === callback) onSessaoExpirada = null; };
}

export async function fetchAutenticado(endpoint, options = {}) {
  const token = await AsyncStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;

  let resposta;
  try {
    resposta = await fetch(`${API}${endpoint}`, { ...options, headers });
  } catch {
    throw new Error('Não foi possível conectar à API. Verifique o endereço e sua conexão.');
  }
  const dados = await resposta.json().catch(() => null);
  if (resposta.status === 401) {
    await AsyncStorage.multiRemove(['token', 'usuario']);
    onSessaoExpirada?.();
  }
  if (!resposta.ok) throw new Error(dados?.mensagem || 'Não foi possível concluir a solicitação.');
  return dados;
}
