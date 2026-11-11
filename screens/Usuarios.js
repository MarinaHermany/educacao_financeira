import { useCallback, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { fetchAutenticado } from '../services/api.js';

export default function Usuarios({ navigation, route, usuario: usuarioProp }) {
  const usuario = usuarioProp || route.params?.usuario;
  const [nome, setNome] = useState(usuario?.nome || '');
  const [email, setEmail] = useState(usuario?.email || '');
  const [usuarios, setUsuarios] = useState([]);
  const [erro, setErro] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [carregando, setCarregando] = useState(false);
  const admin = usuario?.nivel === 'admin';
  useFocusEffect(useCallback(() => {
    if (!admin) return undefined;
    let ativo = true;
    fetchAutenticado('/usuarios').then((data) => { if (ativo) setUsuarios(data); }).catch((e) => { if (ativo) setErro(e.message); });
    return () => { ativo = false; };
  }, [admin]));
  async function salvarPerfil() {
    setErro(''); setMensagem(''); setCarregando(true);
    try { await fetchAutenticado('/usuarios/me', { method: 'PUT', body: JSON.stringify({ nome, email }) }); setMensagem('Seus dados foram atualizados.'); }
    catch (e) { setErro(e.message); } finally { setCarregando(false); }
  }
  async function alterarNivel(alvo) {
    const nivel = alvo.nivel === 'admin' ? 'usuario' : 'admin';
    setErro(''); setMensagem('');
    try {
      await fetchAutenticado(`/usuarios/${alvo.id}/nivel`, { method: 'PUT', body: JSON.stringify({ nivel }) });
      setUsuarios((lista) => lista.map((item) => item.id === alvo.id ? { ...item, nivel } : item));
      setMensagem(`Nível atualizado para ${nivel}.`);
    } catch (e) { setErro(e.message); }
  }
  return <View style={styles.container}>
    <Pressable onPress={() => navigation.goBack()}><Text style={styles.link}>‹ Voltar</Text></Pressable>
    <Text style={styles.titulo}>Minha conta</Text>
    <TextInput style={styles.input} value={nome} onChangeText={setNome} placeholder="Nome" />
    <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="E-mail" keyboardType="email-address" autoCapitalize="none" />
    <Pressable disabled={carregando} style={styles.botao} onPress={salvarPerfil}><Text style={styles.botaoTexto}>{carregando ? 'Salvando…' : 'Salvar dados'}</Text></Pressable>
    {erro ? <Text style={styles.erro}>{erro}</Text> : null}
    {mensagem ? <Text style={styles.mensagem}>{mensagem}</Text> : null}
    {admin ? <><Text style={styles.subtitulo}>Administração de usuários</Text><FlatList data={usuarios} keyExtractor={(item) => String(item.id)} renderItem={({ item }) => <View style={styles.card}>
      <View style={styles.detalhe}><Text style={styles.nome}>{item.nome}</Text><Text style={styles.texto}>{item.email} · {item.nivel}</Text></View>
      {Number(item.id) !== Number(usuario.id) ? <Pressable onPress={() => alterarNivel(item)}><Text style={styles.link}>{item.nivel === 'admin' ? 'Remover admin' : 'Promover a admin'}</Text></Pressable> : null}
    </View>} />
    </> : null}
  </View>;
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f7f4', padding: 22, paddingTop: 52 },
  titulo: { fontSize: 26, fontWeight: '800', color: '#18332b', marginVertical: 18 }, subtitulo: { fontSize: 19, fontWeight: '800', color: '#18332b', marginTop: 24, marginBottom: 12 },
  texto: { color: '#68756e', lineHeight: 22, marginVertical: 4 }, link: { color: '#176b52', fontWeight: '700' },
  input: { backgroundColor: 'white', borderWidth: 1, borderColor: '#dce4de', borderRadius: 11, padding: 13, marginBottom: 10 },
  botao: { backgroundColor: '#176b52', borderRadius: 11, padding: 13, alignItems: 'center' }, botaoTexto: { color: 'white', fontWeight: '800' },
  erro: { color: '#a33b35', marginTop: 10 }, mensagem: { color: '#176b52', marginTop: 10 },
  card: { backgroundColor: 'white', borderRadius: 13, padding: 14, marginBottom: 9, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  detalhe: { flex: 1 }, nome: { color: '#18332b', fontWeight: '800' },
});
