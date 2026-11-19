import AsyncStorage from '@react-native-async-storage/async-storage';

export const getSessionToken = () => AsyncStorage.getItem('token');
export const getStoredUser = () => AsyncStorage.getItem('usuario');

export async function saveSession(token, usuario) {
  await AsyncStorage.multiSet([
    ['token', token],
    ['usuario', JSON.stringify(usuario)],
  ]);
}

export async function clearSession() {
  await AsyncStorage.multiRemove(['token', 'usuario']);
}
