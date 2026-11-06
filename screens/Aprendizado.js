import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

const assuntos = [
  ['Educação financeira', 'É o conjunto de conhecimentos e hábitos que ajudam a planejar o uso do dinheiro, fazer escolhas conscientes e lidar com imprevistos.'],
  ['Bolsa de valores', 'É um ambiente organizado onde investidores negociam valores mobiliários, como ações e cotas de fundos, seguindo regras e supervisão.'],
  ['Ações', 'Uma ação representa uma pequena participação em uma empresa. Seu preço pode subir ou cair conforme expectativas e condições de mercado.'],
  ['Como investir', 'Antes de escolher um investimento, considere objetivo, prazo, necessidade de liquidez e sua capacidade de lidar com oscilações.'],
  ['Risco e retorno', 'Retornos maiores não são garantidos e podem vir acompanhados de riscos maiores. Diversificação ajuda a distribuir riscos, mas não elimina perdas.'],
  ['Conceitos básicos', 'Liquidez é a facilidade de transformar um ativo em dinheiro; volatilidade descreve variações de preço; diversificação distribui recursos entre alternativas.'],
];

export default function Aprendizado({ navigation }) {
  return <ScrollView contentContainerStyle={styles.container}>
    <Pressable onPress={() => navigation.goBack()}><Text style={styles.voltar}>‹ Início</Text></Pressable>
    <Text style={styles.titulo}>Aprender sobre dinheiro</Text>
    <Text style={styles.intro}>Conceitos para entender o mercado e tomar decisões mais conscientes.</Text>
    {assuntos.map(([titulo, texto], index) => <View key={titulo} style={styles.card}>
      <Text style={styles.numero}>0{index + 1}</Text><Text style={styles.cardTitulo}>{titulo}</Text><Text style={styles.texto}>{texto}</Text>
    </View>)}
    <Text style={styles.aviso}>Material educativo geral; não é recomendação de investimento.</Text>
  </ScrollView>;
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#f5f7f4', padding: 22, paddingTop: 52 },
  voltar: { color: '#176b52', fontWeight: '700', marginBottom: 20, fontSize: 16 },
  titulo: { fontSize: 28, fontWeight: '800', color: '#18332b' },
  intro: { fontSize: 15, lineHeight: 22, color: '#68756e', marginTop: 8, marginBottom: 20 },
  card: { backgroundColor: 'white', borderRadius: 16, padding: 18, marginBottom: 11 },
  numero: { color: '#176b52', fontSize: 12, fontWeight: '800', marginBottom: 6 },
  cardTitulo: { color: '#18332b', fontSize: 17, fontWeight: '800', marginBottom: 6 },
  texto: { color: '#59685f', fontSize: 14, lineHeight: 21 },
  aviso: { color: '#849087', fontSize: 12, lineHeight: 18, marginVertical: 12 },
});
