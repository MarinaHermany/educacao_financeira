import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { API } from '../services/api.js';

export default function Login({ navigation, onLogin }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  async function fazerLogin() {
    setErro(''); setCarregando(true);
    try {
      const resposta = await fetch(`${API}/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: email.trim(), senha }) });
      const dados = await resposta.json().catch(() => ({}));
      if (!resposta.ok) throw new Error(dados.mensagem || 'Não foi possível entrar.');
      await AsyncStorage.setItem('token', dados.token); await AsyncStorage.setItem('usuario', JSON.stringify(dados.usuario));
      onLogin(dados.usuario);
    } catch (error) { setErro(error.message); } finally { setCarregando(false); }
  }
  return <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
    <View style={styles.card}>
      <Text style={styles.marca}>Trilha Financeira</Text><Text style={styles.title}>Aprenda a investir com confiança.</Text>
      <Text style={styles.subtitle}>Entre para continuar sua jornada de educação financeira.</Text>
      <TextInput style={styles.input} placeholder="E-mail" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" autoComplete="email" />
      <TextInput style={styles.input} placeholder="Senha" value={senha} onChangeText={setSenha} secureTextEntry autoComplete="password" />
      {erro ? <Text accessibilityRole="alert" style={styles.erro}>{erro}</Text> : null}
      <Pressable accessibilityRole="button" style={styles.button} onPress={fazerLogin} disabled={carregando}><Text style={styles.buttonText}>{carregando ? 'Entrando…' : 'Entrar'}</Text></Pressable>
      <Pressable style={styles.link} onPress={() => navigation.navigate('Cadastro')}><Text style={styles.linkText}>Ainda não tem conta? Cadastre-se</Text></Pressable>
      <Text style={styles.legal}>Conteúdo educativo. As simulações não envolvem dinheiro real nem recomendam investimentos.</Text>
    </View>
  </KeyboardAvoidingView>;
}
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 22, backgroundColor: '#f5f7f4' }, card: { backgroundColor: '#fff', borderRadius: 22, padding: 23 },
  marca: { color: '#176b52', fontSize: 15, fontWeight: '800', marginBottom: 25 }, title: { fontSize: 29, lineHeight: 35, fontWeight: '800', color: '#18332b' },
  subtitle: { fontSize: 15, lineHeight: 22, color: '#68756e', marginTop: 9, marginBottom: 23 },
  input: { borderWidth: 1, borderColor: '#dce4de', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 13, marginBottom: 12, fontSize: 16, backgroundColor: '#fbfcfb' },
  button: { backgroundColor: '#176b52', paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginTop: 5 }, buttonText: { color: '#fff', fontWeight: '800', fontSize: 16 },
  erro: { color: '#a33b35', marginBottom: 10, fontWeight: '600' }, link: { marginTop: 18, alignItems: 'center' }, linkText: { color: '#176b52', fontWeight: '700' },
  legal: { color: '#849087', fontSize: 12, textAlign: 'center', lineHeight: 17, marginTop: 20 },
});
