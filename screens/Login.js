import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { API } from '../services/api.js';

export default function Login({ onLogin, onIrParaCadastro }) {
  const [email, setEmail] = useState('usuario@loja.com');
  const [senha, setSenha] = useState('Usuario@123');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function fazerLogin() {
    setErro('');
    setCarregando(true);

    try {
      const resposta = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, senha }),
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(dados?.mensagem || 'Erro ao fazer login.');
      }

      await AsyncStorage.setItem('token', dados.token);
      await AsyncStorage.setItem('usuario', JSON.stringify(dados.usuario));
      onLogin?.(dados.usuario);
    } catch (error) {
      setErro(error.message || 'Não foi possível entrar.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Loja JWT</Text>
        <Text style={styles.subtitle}>Entre com sua conta</Text>

        <TextInput
          style={styles.input}
          placeholder="E-mail"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TextInput
          style={styles.input}
          placeholder="Senha"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
        />

        {erro ? <Text style={styles.erro}>{erro}</Text> : null}

        <Pressable style={styles.button} onPress={fazerLogin} disabled={carregando}>
          <Text style={styles.buttonText}>{carregando ? 'Entrando...' : 'Entrar'}</Text>
        </Pressable>

        <Pressable style={styles.link} onPress={onIrParaCadastro}>
          <Text style={styles.linkText}>Criar uma conta</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#f3f4f6',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
    color: '#111827',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 16,
    color: '#4b5563',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: '#f9fafb',
  },
  button: {
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  erro: {
    color: '#b91c1c',
    marginBottom: 10,
    fontWeight: '600',
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
