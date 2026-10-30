import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { API } from '../services/api.js';

export default function Usuarios({ onVoltar }) {
  const [usuarios, setUsuarios] = useState([]);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(true);

  async function carregarUsuarios() {
    setErro('');
    setCarregando(true);

    try {
      const token = await AsyncStorage.getItem('token');
      const resposta = await fetch(`${API}/usuarios`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(dados?.mensagem || 'Erro ao listar usuários.');
      }

      setUsuarios(dados || []);
    } catch (error) {
      setErro(error.message || 'Não foi possível listar usuários.');
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarUsuarios();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Usuários</Text>
        <Pressable style={styles.voltar} onPress={onVoltar}>
          <Text style={styles.voltarText}>Voltar</Text>
        </Pressable>
      </View>

      {erro ? <Text style={styles.erro}>{erro}</Text> : null}

      {carregando ? (
        <Text style={styles.loading}>Carregando...</Text>
      ) : (
        <FlatList
          data={usuarios}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.nome}>{item.nome}</Text>
              <Text style={styles.texto}>{item.email}</Text>
              <Text style={styles.texto}>Nível: {item.nivel}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
  voltar: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#dbeafe',
    borderRadius: 8,
  },
  voltarText: {
    color: '#1d4ed8',
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  nome: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  texto: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 2,
  },
  erro: {
    color: '#b91c1c',
    marginBottom: 12,
    fontWeight: '600',
  },
  loading: {
    textAlign: 'center',
    paddingVertical: 20,
    color: '#374151',
  },
});
