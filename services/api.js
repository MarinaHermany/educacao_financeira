import AsyncStorage from '@react-native-async-storage/async-storage';

export const API = 'http://localhost:3000';

export async function fetchAutenticado(endpoint, options = {}) {
  const token = await AsyncStorage.getItem('token');

  const headers = {
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const resposta = await fetch(`${API}${endpoint}`, {
    ...options,
    headers,
  });

  let dados = null;
  try {
    dados = await resposta.json();
  } catch (error) {
    dados = null;
  }

  if (!resposta.ok) {
    throw new Error(dados?.mensagem || 'Erro na requisição.');
  }

  return dados;
}
