import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useEffect, useState } from 'react';
import Login from './screens/Login';
import CadastroUsuario from './screens/CadastroUsuario';
import Home from './screens/Home';
import Produtos from './screens/Produtos';
import Usuarios from './screens/Usuarios';
import { API } from './services/api.js';

export default function App() {
  const [usuario, setUsuario] = useState(null);
  const [tela, setTela] = useState('login');
  const [carregando, setCarregando] = useState(true);

  async function carregarSessao() {
    try {
      const token = await AsyncStorage.getItem('token');
      const usuarioSalvo = await AsyncStorage.getItem('usuario');

      if (!token) {
        setUsuario(null);
        setTela('login');
        return;
      }

      const resposta = await fetch(`${API}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!resposta.ok) {
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('usuario');
        setUsuario(null);
        setTela('login');
        return;
      }

      const dados = await resposta.json();
      const usuarioAtual = dados.usuario || JSON.parse(usuarioSalvo || '{}');
      setUsuario(usuarioAtual);
      setTela('home');
    } catch (error) {
      console.log(error);
      setTela('login');
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarSessao();
  }, []);

  if (carregando) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (tela === 'login') {
    return (
      <Login
        onLogin={(usuarioLogado) => {
          setUsuario(usuarioLogado);
          setTela('home');
        }}
        onIrParaCadastro={() => setTela('cadastro')}
      />
    );
  }

  if (tela === 'cadastro') {
    return (
      <CadastroUsuario
        onVoltar={() => setTela('login')}
        onCriado={() => setTela('login')}
      />
    );
  }

  if (tela === 'home') {
    return (
      <Home
        usuario={usuario}
        onLogout={() => {
          setUsuario(null);
          setTela('login');
        }}
        onAbrirProdutos={() => setTela('produtos')}
        onAbrirUsuarios={() => setTela('usuarios')}
      />
    );
  }

  if (tela === 'produtos') {
    return <Produtos usuario={usuario} onVoltar={() => setTela('home')} />;
  }

  if (tela === 'usuarios') {
    return <Usuarios onVoltar={() => setTela('home')} />;
  }

  return null;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
