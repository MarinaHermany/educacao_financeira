import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { fetchAutenticado } from '../services/api.js';

export default function Simulador({ navigation }) {
  const [investimentos, setInvestimentos] = useState([]);
  const [selecionado, setSelecionado] = useState(null);
  const [valor, setValor] = useState('');
  const [saldo, setSaldo] = useState(null);
  const [erro, setErro] = useState('');
  const [resultado, setResultado] = useState('');
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    Promise.all([fetchAutenticado('/investimentos'), fetchAutenticado('/inicio')])
      .then(([lista, inicio]) => { setInvestimentos(lista); setSaldo(Number(inicio.saldoVirtual)); })
      .catch((e) => setErro(e.message));
  }, []);

  async function registrar() {
    setErro(''); setResultado('');
    const quantia = Number(valor.replace(',', '.'));
    if (!selecionado) return setErro('Escolha um tipo de investimento.');
    if (!Number.isFinite(quantia) || quantia <= 0) return setErro('Informe um valor maior que zero.');
    setCarregando(true);
    try {
      const dados = await fetchAutenticado('/simulacoes', { method: 'POST', body: JSON.stringify({ investimentoId: selecionado.id, valor: quantia }) });
      setSaldo(Number(dados.saldoVirtual)); setResultado(dados.simulacao.resultado); setValor('');
    } catch (e) { setErro(e.message); }
    finally { setCarregando(false); }
  }

  return <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
    <Pressable onPress={() => navigation.goBack()}><Text style={styles.voltar}>‹ Início</Text></Pressable>
    <Text style={styles.titulo}>Simulador</Text>
    <Text style={styles.intro}>Pratique com créditos virtuais. Nenhuma operação financeira real é realizada.</Text>
    <View style={styles.saldo}><Text style={styles.rotulo}>Saldo virtual</Text><Text style={styles.saldoValor}>{saldo == null ? 'Carregando…' : saldo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Text></View>
    <Text style={styles.label}>1. Escolha uma categoria</Text>
    {investimentos.map((item) => <Pressable key={item.id} onPress={() => setSelecionado(item)} style={[styles.opcao, selecionado?.id === item.id && styles.opcaoAtiva]}>
      <Text style={styles.nome}>{item.nome}</Text><Text style={styles.descricao}>{item.descricao}</Text>
    </Pressable>)}
    <Text style={styles.label}>2. Valor para praticar</Text>
    <TextInput style={styles.input} value={valor} onChangeText={setValor} keyboardType="decimal-pad" placeholder="Ex.: 250" />
    {erro ? <Text accessibilityRole="alert" style={styles.erro}>{erro}</Text> : null}
    {resultado ? <View style={styles.confirmacao}><Text style={styles.confirmacaoTitulo}>Simulação registrada</Text><Text style={styles.descricao}>{resultado}</Text></View> : null}
    <Pressable accessibilityRole="button" style={styles.botao} disabled={carregando || saldo == null} onPress={registrar}><Text style={styles.botaoTexto}>{carregando ? 'Registrando…' : 'Registrar simulação'}</Text></Pressable>
    <Text style={styles.aviso}>O sistema registra a prática, mas não estima rentabilidade nem usa cotações reais.</Text>
    <Pressable onPress={() => navigation.navigate('Histórico')}><Text style={styles.link}>Ver meu histórico</Text></Pressable>
  </ScrollView>;
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#f5f7f4', padding: 22, paddingTop: 52 },
  voltar: { color: '#176b52', fontWeight: '700', marginBottom: 20, fontSize: 16 },
  titulo: { fontSize: 28, fontWeight: '800', color: '#18332b' },
  intro: { fontSize: 15, lineHeight: 22, color: '#68756e', marginTop: 8, marginBottom: 18 },
  saldo: { backgroundColor: '#176b52', padding: 17, borderRadius: 16, marginBottom: 22 },
  rotulo: { color: '#d6ebe2' }, saldoValor: { color: 'white', fontSize: 24, fontWeight: '800', marginTop: 5 },
  label: { color: '#18332b', fontWeight: '800', fontSize: 15, marginTop: 10, marginBottom: 9 },
  opcao: { backgroundColor: 'white', borderWidth: 1, borderColor: '#e1e8e2', padding: 15, borderRadius: 13, marginBottom: 9 },
  opcaoAtiva: { borderColor: '#176b52', backgroundColor: '#edf5ef' }, nome: { color: '#18332b', fontWeight: '800' },
  descricao: { color: '#68756e', lineHeight: 19, marginTop: 4, fontSize: 13 },
  input: { backgroundColor: 'white', borderWidth: 1, borderColor: '#dce4de', padding: 14, fontSize: 16, borderRadius: 12 },
  botao: { backgroundColor: '#176b52', paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginTop: 16 },
  botaoTexto: { color: 'white', fontWeight: '800' }, erro: { color: '#a33b35', marginTop: 10 },
  confirmacao: { backgroundColor: '#e8efe9', borderRadius: 13, padding: 14, marginTop: 14 },
  confirmacaoTitulo: { color: '#176b52', fontWeight: '800' }, aviso: { color: '#849087', fontSize: 12, lineHeight: 18, marginTop: 13 },
  link: { textAlign: 'center', color: '#176b52', fontWeight: '800', marginTop: 18, marginBottom: 15 },
});
