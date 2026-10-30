import AsyncStorage from '@react-native-async-storage/async-storage';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { API } from '../services/api.js';

export default function Home({ usuario, onLogout, onAbrirProdutos, onAbrirUsuarios }) {
  async function carregarPerfil() {
    const token = await AsyncStorage.getItem('token');
    if (!token) return;

    try {
      const resposta = await fetch(`${API}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (resposta.ok) {
        const dados = await resposta.json();
        console.log('Perfil carregado:', dados.usuario);
      }
    } catch (error) {
      console.log('Falha ao carregar perfil:', error.message);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.ola}>Olá, {usuario?.nome || 'Usuário'}</Text>
      <Text style={styles.nivel}>Nível: {usuario?.nivel || 'usuario'}</Text>

      <Pressable style={styles.button} onPress={onAbrirProdutos}>
        <Text style={styles.buttonText}>Ver produtos</Text>
      </Pressable>

      {usuario?.nivel === 'admin' ? (
        <>
          <Pressable style={[styles.button, styles.secondary]} onPress={onAbrirUsuarios}>
            <Text style={styles.buttonText}>Gerenciar usuários</Text>
          </Pressable>
        </>
      ) : null}

      <Pressable style={[styles.button, styles.danger]} onPress={async () => {
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('usuario');
        onLogout();
      }}>
        <Text style={styles.buttonText}>Sair</Text>
      </Pressable>

      <Pressable style={styles.link} onPress={carregarPerfil}>
        <Text style={styles.linkText}>Atualizar perfil</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: '#f3f4f6',
  },
  ola: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
    color: '#111827',
  },
  nivel: {
    fontSize: 16,
    color: '#4b5563',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  secondary: {
    backgroundColor: '#10b981',
  },
  danger: {
    backgroundColor: '#dc2626',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  link: {
    marginTop: 18,
    alignItems: 'center',
  },
  linkText: {
    color: '#2563eb',
    fontWeight: '600',
  },
});
