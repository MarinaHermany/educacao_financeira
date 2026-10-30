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

export default function CadastroUsuario({ onVoltar, onCriado }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function cadastrar() {
    setErro('');
    setSucesso('');

    if (!nome.trim() || !email.trim() || !senha || !confirmarSenha) {
      setErro('Preencha nome, e-mail e senha.');
      return;
    }

    if (senha.length < 8) {
      setErro('A senha precisa ter no mínimo 8 caracteres.');
      return;
    }

    if (senha !== confirmarSenha) {
      setErro('As senhas não conferem.');
      return;
    }

    setCarregando(true);

    try {
      const resposta = await fetch(`${API}/auth/cadastro`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nome, email, senha }),
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(dados?.mensagem || 'Erro ao criar conta.');
      }

      setSucesso('Conta criada com sucesso!');
      setNome('');
      setEmail('');
      setSenha('');
      setConfirmarSenha('');

      if (onCriado) {
        onCriado();
      }
    } catch (error) {
      setErro(error.message || 'Não foi possível criar a conta.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.card}>
        <Text style={styles.title}>Criar conta</Text>

        <TextInput
          style={styles.input}
          placeholder="Nome completo"
          value={nome}
          onChangeText={setNome}
        />

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

        <TextInput
          style={styles.input}
          placeholder="Confirmar senha"
          value={confirmarSenha}
          onChangeText={setConfirmarSenha}
          secureTextEntry
        />

        {erro ? <Text style={styles.erro}>{erro}</Text> : null}
        {sucesso ? <Text style={styles.sucesso}>{sucesso}</Text> : null}

        <Pressable style={styles.button} onPress={cadastrar} disabled={carregando}>
          <Text style={styles.buttonText}>{carregando ? 'Criando...' : 'Cadastrar'}</Text>
        </Pressable>

        <Pressable style={styles.link} onPress={onVoltar}>
          <Text style={styles.linkText}>Voltar para login</Text>
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
    marginBottom: 18,
    color: '#111827',
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
    backgroundColor: '#10b981',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 4,
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
  sucesso: {
    color: '#047857',
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
