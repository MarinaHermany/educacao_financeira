import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function Usuarios({ navigation }) {
  return <View style={styles.container}>
    <Text style={styles.titulo}>Sua conta</Text>
    <Text style={styles.texto}>As funcionalidades administrativas foram mantidas no backend para uma etapa futura.</Text>
    <Pressable onPress={() => navigation.goBack()}><Text style={styles.link}>Voltar</Text></Pressable>
  </View>;
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f7f4', padding: 22, paddingTop: 52 },
  titulo: { fontSize: 26, fontWeight: '800', color: '#18332b' }, texto: { color: '#68756e', lineHeight: 22, marginVertical: 12 },
  link: { color: '#176b52', fontWeight: '700' },
});
