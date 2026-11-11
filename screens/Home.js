import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { fetchAutenticado } from '../services/api.js';

const verde = '#176b52';

export default function Home({ navigation, usuario, onLogout }) {
  const [resumo, setResumo] = useState(null);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(true);
  useFocusEffect(useCallback(() => {
    let ativo = true;
    setCarregando(true);
    fetchAutenticado('/inicio')
      .then((dados) => { if (ativo) { setResumo(dados); setErro(''); } })
      .catch((e) => { if (ativo) setErro(e.message); })
      .finally(() => { if (ativo) setCarregando(false); });
    return () => { ativo = false; };
  }, []));
  const acessar = (tela) => navigation.navigate(tela);
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.topo}><Text style={styles.marca}>Trilha Financeira</Text><Pressable onPress={onLogout}><Text style={styles.sair}>Sair</Text></Pressable></View>
      <Text style={styles.ola}>Olá, {usuario?.nome || 'estudante'} 👋</Text>
      <Pressable onPress={() => acessar('Minha conta')}><Text style={styles.conta}>Minha conta{usuario?.nivel === 'admin' ? ' · Administração' : ''}</Text></Pressable>
      <Text style={styles.subtitulo}>Aprenda sobre investimentos praticando em um ambiente simulado.</Text>
      <View style={styles.saldo}>
        <Text style={styles.rotulo}>Saldo virtual disponível</Text>
        <Text style={styles.valor}>{resumo ? Number(resumo.saldoVirtual).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '—'}</Text>
        <Text style={styles.nota}>Créditos fictícios para fins educativos. Não representam dinheiro real.</Text>
      </View>
      {erro ? <Text style={styles.erro}>{erro}</Text> : null}
      <Text style={styles.titulo}>Sua jornada</Text>
      <Acao titulo="Aprender" texto="Explore conceitos do mercado financeiro" onPress={() => acessar('Aprendizado')} />
      <Acao titulo="Simular investimento" texto="Pratique decisões sem usar dinheiro real" onPress={() => acessar('Simulador')} />
      <Acao titulo="Histórico" texto={carregando ? 'Atualizando registros…' : resumo ? `${Number(resumo.totalSimulacoes)} simulações registradas` : 'Veja suas práticas anteriores'} onPress={() => acessar('Histórico')} />
      <View style={styles.dica}><Text style={styles.dicaTitulo}>Uma dica para começar</Text><Text style={styles.dicaTexto}>Antes de investir, entenda seus objetivos, prazo e riscos. Rentabilidade passada não garante resultados futuros.</Text></View>
    </ScrollView>
  );
}
function Acao({ titulo, texto, onPress }) {
  return <Pressable accessibilityRole="button" style={styles.acao} onPress={onPress}><View><Text style={styles.acaoTitulo}>{titulo}</Text><Text style={styles.acaoTexto}>{texto}</Text></View><Text style={styles.seta}>›</Text></Pressable>;
}
const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 22, paddingTop: 52, backgroundColor: '#f5f7f4' },
  topo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 26 },
  marca: { color: verde, fontSize: 16, fontWeight: '800' }, sair: { color: '#647067', fontWeight: '700' },
  conta: { color: verde, fontWeight: '700', marginTop: 8, marginBottom: 8 },
  ola: { color: '#18332b', fontSize: 27, fontWeight: '800' }, subtitulo: { color: '#68756e', fontSize: 15, lineHeight: 22, marginTop: 7, marginBottom: 20 },
  saldo: { backgroundColor: verde, padding: 20, borderRadius: 20, marginBottom: 27 }, rotulo: { color: '#d6ebe2', fontSize: 14 },
  valor: { color: 'white', fontSize: 29, fontWeight: '800', marginVertical: 7 }, nota: { color: '#d6ebe2', lineHeight: 18, fontSize: 12 },
  titulo: { fontSize: 19, color: '#18332b', fontWeight: '800', marginBottom: 12 },
  acao: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 17, borderRadius: 16, backgroundColor: 'white', marginBottom: 10 },
  acaoTitulo: { color: '#18332b', fontSize: 16, fontWeight: '800' }, acaoTexto: { color: '#68756e', fontSize: 13, marginTop: 4 }, seta: { color: verde, fontSize: 26 },
  dica: { backgroundColor: '#e8efe9', padding: 17, borderRadius: 16, marginTop: 12 }, dicaTitulo: { color: verde, fontWeight: '800', marginBottom: 6 }, dicaTexto: { color: '#52635a', lineHeight: 20 },
  erro: { color: '#a33b35', marginBottom: 12 },
});
