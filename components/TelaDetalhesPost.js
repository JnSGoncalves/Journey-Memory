import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, FlatList } from 'react-native';
import GlobalStyles from '../GlobalStyles';

export default function TelaDetalhesPost({ route }) {
  const { post } = route.params;

  return (
    <View style={styles.container}>
      {/* Cabeçalho com informações */}
      <View style={styles.cabecalho}>
        <Text style={[GlobalStyles.titulo, styles.titulo]}>{post.nome}</Text>
        <Text style={styles.localizacao}>📍 {post.localizacao}</Text>
        {post.comentario && (
          <Text style={[styles.comentario, GlobalStyles.texto]}>Comentário: {post.comentario}</Text>
        )}
        {post.data && (
          <Text style={styles.data}>Viagem realiza em: {post.data}</Text>
        )}
        {post.nomeUsuario && (
          <Text style={styles.data}>Publicada por: {post.nomeUsuario}</Text>
        )}
      </View>

      {/* Lista vertical de imagens */}
      <FlatList
        data={post.imagens || []}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Image source={{ uri: item }} style={styles.imagem} />
        )}
        contentContainerStyle={styles.listaImagens}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  cabecalho: {
    padding: 16,
    backgroundColor: '#e6f7fa',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  titulo: { 
    fontSize: 24, 
    textAlign: 'center',
    marginTop: 30,
  },
  localizacao: { fontSize: 16, color: '#555', marginTop: 8, textAlign: 'center' },
  comentario: { fontSize: 14, color: '#444', marginTop: 12 },
  data: { fontSize: 12, color: '#888', marginTop: 6 },
  listaImagens: { padding: 16 },
  imagem: {
    width: '100%',
    height: 250,
    marginBottom: 16,
    borderRadius: 8,
    resizeMode: 'cover',
  },
});
