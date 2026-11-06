import { useCallback, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { fetchAutenticado } from '../services/api.js';

export default function Historico({ navigation }) {
  const [itens, setItens] = useState([]);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(true);
  useFocusEffect(useCallback(() => {
    let ativo = true;
    setCarregando(true);
    fetchAutenticado('/simulacoes').then((data) => { if (ativo) setItens(data); })
      .catch((e) => { if (ativo) setErro(e.message); })
      .finally(() => { if (ativo) setCarregando(false); });
    return () => { ativo = false; };
  }, []));
  return <View style={styles.container}>
    <Pressable onPress={() => navigation.goBack()}><Text style={styles.voltar}>‹ Início</Text></Pressable>
    <Text style={styles.titulo}>Histórico de prática</Text>
    <Text style={styles.intro}>Registros salvos pela API para sua conta.</Text>
    {erro ? <Text style={styles.erro}>{erro}</Text> : null}
    {carregando ? <Text style={styles.vazio}>Carregando histórico…</Text> : <FlatList
      data={itens} keyExtractor={(item) => String(item.id)}
      ListEmptyComponent={<Text style={styles.vazio}>Ainda não há simulações registradas.</Text>}
      contentContainerStyle={itens.length ? undefined : { flexGrow: 1 }}
      renderItem={({ item }) => <View style={styles.card}>
        <Text style={styles.nome}>{item.investimentoNome}</Text>
        <Text style={styles.valor}>{Number(item.valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Text>
        <Text style={styles.data}>{new Date(item.criadoEm).toLocaleString('pt-BR')}</Text>
        <Text style={styles.resultado}>{item.resultado}</Text>
      </View>}
    />}
  </View>;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f7f4', padding: 22, paddingTop: 52 },
  voltar: { color: '#176b52', fontWeight: '700', marginBottom: 20, fontSize: 16 },
  titulo: { fontSize: 28, fontWeight: '800', color: '#18332b' },
  intro: { color: '#68756e', marginTop: 7, marginBottom: 18 },
  card: { backgroundColor: 'white', padding: 17, borderRadius: 15, marginBottom: 10 },
  nome: { color: '#18332b', fontSize: 16, fontWeight: '800' },
  valor: { color: '#176b52', fontSize: 20, fontWeight: '800', marginTop: 7 },
  data: { color: '#849087', fontSize: 12, marginTop: 4 }, resultado: { color: '#59685f', lineHeight: 19, marginTop: 9 },
  vazio: { color: '#68756e', textAlign: 'center', marginVertical: 28 }, erro: { color: '#a33b35' },
});
