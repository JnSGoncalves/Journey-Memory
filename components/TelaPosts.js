import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../services/firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import GlobalStyles from '../GlobalStyles';

export default function TelaPosts({ navigation }) {
  const [posts, setPosts] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [usuarioLogado, setUsuarioLogado] = useState(null);

  async function verificarLogin() {
    try {
      const jsonValue = await AsyncStorage.getItem('usuarioLogado');
      if (jsonValue != null) {
        const usuario = JSON.parse(jsonValue);
        setUsuarioLogado(usuario);
      } else {
        setUsuarioLogado(null);
      }
    } catch (e) {
      console.error('Erro ao ler usuário logado:', e);
      setUsuarioLogado(null);
    }
  }

  async function carregarPosts() {
    try {
      const querySnapshot = await getDocs(collection(db, 'posts'));
      const listaPosts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPosts(listaPosts);
    } catch (e) {
      console.error('Erro ao carregar posts:', e);
      Alert.alert('Erro', 'Falha ao carregar os posts.');
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setCarregando(true);
      verificarLogin();
      carregarPosts();
    });

    return unsubscribe;
  }, [navigation]);

  if (carregando) {
    return (
      <View style={styles.carregando}>
        <ActivityIndicator size="large" color="#33b9cb" />
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('TelaDetalhesPost', { post: item })}>
      {item.imagens?.[0] && <Image source={{ uri: item.imagens[0] }} style={styles.imagem} />}
      <View style={styles.info}>
        <Text style={styles.titulo}>{item.nome}</Text>
        <Text style={styles.local}>{item.localizacao}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={[GlobalStyles.titulo, styles.tituloPagina]}>Viagens Publicadas</Text>

      <FlatList
        data={posts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.lista}
      />

      <TouchableOpacity
        style={[styles.botaoAdicionar, !usuarioLogado && styles.botaoDesabilitado]}
        onPress={() => {
          if (!usuarioLogado) {
            Alert.alert('Acesso restrito', 'Faça login para adicionar um post.');
            return;
          }
          navigation.navigate('TelaNovoPost');
        }}
      >
        <Ionicons name="add" size={32} color={usuarioLogado ? '#fff' : '#888'} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  carregando: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  tituloPagina: { fontSize: 26, textAlign: 'center', marginTop: 50, marginBottom: 20 },
  lista: { paddingHorizontal: 16, paddingBottom: 80 },
  card: { backgroundColor: '#f2f2f2', borderRadius: 8, marginBottom: 16, overflow: 'hidden', elevation: 3 },
  imagem: { width: '100%', height: 180 },
  info: { padding: 12 },
  titulo: { fontSize: 18, fontWeight: 'bold' },
  local: { fontSize: 14, color: '#555', marginTop: 4 },
  botaoAdicionar: {
    position: 'absolute', bottom: 24, right: 24,
    backgroundColor: '#33b9cb', width: 60, height: 60, borderRadius: 30,
    justifyContent: 'center', alignItems: 'center', elevation: 5
  },
  botaoDesabilitado: { backgroundColor: '#e0e0e0' },
  textoAviso: { color: '#666', fontSize: 10, marginTop: 4, textAlign: 'center' },
});
