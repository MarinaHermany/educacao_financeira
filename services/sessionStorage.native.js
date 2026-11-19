import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

export const getSessionToken = () => SecureStore.getItemAsync('token');
export const getStoredUser = () => AsyncStorage.getItem('usuario');

export async function saveSession(token, usuario) {
  await Promise.all([
    SecureStore.setItemAsync('token', token),
    AsyncStorage.setItem('usuario', JSON.stringify(usuario)),
  ]);
}

export async function clearSession() {
  await Promise.all([
    SecureStore.deleteItemAsync('token'),
    AsyncStorage.removeItem('usuario'),
  ]);
}
