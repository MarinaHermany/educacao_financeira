import { useCallback, useState } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { fetchAutenticado } from '../services/api.js';

export default function Historico({ navigation }) {
  const [itens, setItens] = useState([]);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [editando, setEditando] = useState(null);
  const [novoValor, setNovoValor] = useState('');
  const [operacaoId, setOperacaoId] = useState(null);
  const [mensagem, setMensagem] = useState('');
  const [exclusaoPendente, setExclusaoPendente] = useState(null);
  const carregar = useCallback(() => {
    setCarregando(true);
    return fetchAutenticado('/simulacoes').then((dados) => { setItens(dados); setErro(''); }).catch((e) => setErro(e.message)).finally(() => setCarregando(false));
  }, []);
  useFocusEffect(useCallback(() => {
    let ativo = true;
    setCarregando(true);
    fetchAutenticado('/simulacoes').then((data) => { if (ativo) { setItens(data); setErro(''); } })
      .catch((e) => { if (ativo) setErro(e.message); })
      .finally(() => { if (ativo) setCarregando(false); });
    return () => { ativo = false; };
  }, []));
  async function salvar(item) {
    setErro(''); setMensagem(''); setOperacaoId(item.id);
    try {
      await fetchAutenticado(`/simulacoes/${item.id}`, { method: 'PUT', body: JSON.stringify({ investimentoId: item.investimentoId, valor: Number(novoValor.replace(',', '.')) }) });
      setEditando(null); setMensagem('Simulação atualizada.'); await carregar();
    } catch (e) { setErro(e.message); } finally { setOperacaoId(null); }
  }
  async function confirmarExclusao() {
    const item = exclusaoPendente;
    if (!item) return;
    setExclusaoPendente(null);
    setErro(''); setMensagem(''); setOperacaoId(item.id);
    try {
      await fetchAutenticado(`/simulacoes/${item.id}`, { method: 'DELETE' });
      setItens((atuais) => atuais.filter((simulacao) => simulacao.id !== item.id));
      setMensagem('Simulação excluída. O saldo virtual foi devolvido.');
    } catch (e) { setErro(e.message); }
    finally { setOperacaoId(null); }
  }
  return <View style={styles.container}>
    <Pressable onPress={() => navigation.goBack()}><Text style={styles.voltar}>‹ Início</Text></Pressable>
    <Text style={styles.titulo}>Histórico de prática</Text>
    <Text style={styles.intro}>Registros salvos pela API para sua conta.</Text>
    {erro ? <Text style={styles.erro}>{erro}</Text> : null}
    {mensagem ? <Text style={styles.mensagem}>{mensagem}</Text> : null}
    {carregando ? <Text style={styles.vazio}>Carregando histórico…</Text> : <FlatList
      data={itens} keyExtractor={(item) => String(item.id)}
      ListEmptyComponent={<Text style={styles.vazio}>Ainda não há simulações registradas.</Text>}
      contentContainerStyle={itens.length ? undefined : { flexGrow: 1 }}
      renderItem={({ item }) => <View style={styles.card}>
        <Text style={styles.nome}>{item.investimentoNome}</Text>
        <Text style={styles.valor}>{Number(item.valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Text>
        <Text style={styles.data}>{new Date(item.criadoEm).toLocaleString('pt-BR')}</Text>
        <Text style={styles.resultado}>{item.resultado}</Text>
        {editando === item.id ? <View>
          <TextInput style={styles.input} value={novoValor} onChangeText={setNovoValor} keyboardType="decimal-pad" accessibilityLabel="Novo valor virtual" />
          <View style={styles.acoes}><Pressable disabled={operacaoId === item.id} onPress={() => salvar(item)}><Text style={styles.acao}>Salvar</Text></Pressable><Pressable onPress={() => setEditando(null)}><Text style={styles.acao}>Cancelar</Text></Pressable></View>
        </View> : <View style={styles.acoes}>
          <Pressable onPress={() => { setEditando(item.id); setNovoValor(String(item.valor).replace('.', ',')); }}><Text style={styles.acao}>Editar valor</Text></Pressable>
          <Pressable disabled={operacaoId === item.id} onPress={() => setExclusaoPendente(item)}><Text style={styles.excluir}>{operacaoId === item.id ? 'Processando…' : 'Excluir'}</Text></Pressable>
        </View>}
      </View>}
    />}
    <Modal visible={Boolean(exclusaoPendente)} transparent animationType="fade" onRequestClose={() => setExclusaoPendente(null)}>
      <View style={styles.modalFundo}>
        <View style={styles.modalCartao} accessibilityRole="alert">
          <Text style={styles.modalTitulo}>Excluir simulação?</Text>
          <Text style={styles.modalTexto}>Esta ação removerá o registro e devolverá o valor à sua carteira virtual.</Text>
          <View style={styles.modalAcoes}>
            <Pressable accessibilityRole="button" onPress={() => setExclusaoPendente(null)} style={styles.botaoCancelar}><Text style={styles.textoCancelar}>Cancelar</Text></Pressable>
            <Pressable accessibilityRole="button" onPress={confirmarExclusao} style={styles.botaoExcluir}><Text style={styles.textoBotaoExcluir}>Excluir</Text></Pressable>
          </View>
        </View>
      </View>
    </Modal>
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
  vazio: { color: '#68756e', textAlign: 'center', marginVertical: 28 }, erro: { color: '#a33b35' }, mensagem: { color: '#176b52', marginBottom: 10 },
  input: { borderWidth: 1, borderColor: '#dce4de', padding: 11, borderRadius: 10, marginTop: 12 }, acoes: { flexDirection: 'row', gap: 22, marginTop: 14 }, acao: { color: '#176b52', fontWeight: '700' }, excluir: { color: '#a33b35', fontWeight: '700' },
  modalFundo: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center', padding: 24 }, modalCartao: { backgroundColor: 'white', borderRadius: 18, padding: 20 },
  modalTitulo: { color: '#18332b', fontSize: 19, fontWeight: '800' }, modalTexto: { color: '#68756e', lineHeight: 21, marginTop: 9 }, modalAcoes: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12, marginTop: 22 },
  botaoCancelar: { paddingVertical: 11, paddingHorizontal: 14 }, textoCancelar: { color: '#176b52', fontWeight: '700' }, botaoExcluir: { paddingVertical: 11, paddingHorizontal: 16, borderRadius: 10, backgroundColor: '#a33b35' }, textoBotaoExcluir: { color: 'white', fontWeight: '800' },
});
