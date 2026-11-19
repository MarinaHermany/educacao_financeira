import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useEffect, useState } from 'react';
import Login from './screens/Login';
import CadastroUsuario from './screens/CadastroUsuario';
import Home from './screens/Home';
import Aprendizado from './screens/Aprendizado';
import Simulador from './screens/Simulador';
import Historico from './screens/Historico';
import { API, registrarSessaoExpirada } from './services/api.js';
import Usuarios from './screens/Usuarios';
import { clearSession, getSessionToken, getStoredUser } from './services/sessionStorage';

const Stack = createNativeStackNavigator();

export default function App() {
  const [usuario, setUsuario] = useState(null);
  const [autenticado, setAutenticado] = useState(false);
  const [carregando, setCarregando] = useState(true);

  async function carregarSessao() {
    try {
      const token = await getSessionToken();
      const usuarioSalvo = await getStoredUser();

      if (!token) {
        setUsuario(null);
        await clearSession();
        return;
      }

      const resposta = await fetch(`${API}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!resposta.ok) {
        await clearSession();
        setUsuario(null);
        return;
      }

      const dados = await resposta.json();
      const usuarioAtual = dados.usuario || JSON.parse(usuarioSalvo || '{}');
      setUsuario(usuarioAtual);
      setAutenticado(true);
    } catch {
      await clearSession();
      setUsuario(null);
      setAutenticado(false);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarSessao();
  }, []);

  useEffect(() => registrarSessaoExpirada(() => {
    setUsuario(null);
    setAutenticado(false);
  }), []);

  if (carregando) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {autenticado ? (
          <>
            <Stack.Screen name="Início">
              {(props) => <Home {...props} usuario={usuario} onLogout={async () => { await clearSession(); setUsuario(null); setAutenticado(false); }} />}
            </Stack.Screen>
            <Stack.Screen name="Aprendizado" component={Aprendizado} />
            <Stack.Screen name="Simulador" component={Simulador} />
            <Stack.Screen name="Histórico" component={Historico} />
            <Stack.Screen name="Minha conta">
              {(props) => <Usuarios {...props} usuario={usuario} />}
            </Stack.Screen>
          </>
        ) : (
          <>
            <Stack.Screen name="Login">
              {(props) => <Login {...props} onLogin={(user) => { setUsuario(user); setAutenticado(true); }} />}
            </Stack.Screen>
            <Stack.Screen name="Cadastro" component={CadastroUsuario} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
