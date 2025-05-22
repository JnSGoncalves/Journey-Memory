import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, FlatList, ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import GlobalStyles from '../GlobalStyles';
import { TouchableOpacity, Vibration } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { db } from '../services/firebaseConfig'
import { collection, addDoc, query, where, getDocs, doc, deleteDoc } from 'firebase/firestore';

export default function TelaUsuario() {
  const [logado, setLogado] = useState(false);
  const [modoCadastro, setModoCadastro] = useState(false);

  const [nome, setNome] = useState('');
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmSenha, setConfirmSenha] = useState('');

  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [nomeUsuarioLogado, setNomeUsuarioLogado] = useState(null);
  const [loadingAcesso, setLoadingAcesso] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    async function verificarLoginSalvo() {
      try {
        const dadosSalvos = await AsyncStorage.getItem('usuarioLogado');
        if (dadosSalvos) {
          const usuarioLogado = JSON.parse(dadosSalvos);
          setNome(usuarioLogado.nome);
          setUsuario(usuarioLogado.usuario);
          setNomeUsuarioLogado(usuarioLogado.usuario);
          setLogado(true);
        }
      } catch (error) {
        console.error('Erro ao verificar login salvo:', error);
      }
    }
    verificarLoginSalvo();
  }, []);

  async function carregarPosts() {
    if (!nomeUsuarioLogado) return;

    setLoadingPosts(true);
    try {
      const postsRef = collection(db, 'posts');
      const q = query(postsRef, where('nomeUsuario', '==', nomeUsuarioLogado));
      const querySnapshot = await getDocs(q);

      const listaPosts = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setPosts(listaPosts);
    } catch (error) {
      console.error('Erro ao carregar posts:', error);
      Alert.alert('Erro', 'Falha ao carregar posts.');
    } finally {
      setLoadingPosts(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      carregarPosts();
    }, [nomeUsuarioLogado])
  );

  async function handleExcluirPost(idPost) {
    try {
      await deleteDoc(doc(db, 'posts', idPost));
      setPosts(prevPosts => prevPosts.filter(post => post.id !== idPost));
      Alert.alert('Sucesso', 'Post excluído com sucesso.');
    } catch (error) {
      console.error('Erro ao excluir post:', error);
      Alert.alert('Erro', 'Não foi possível excluir o post.');
    }
  }

  async function setLogout() {
    try {
      await AsyncStorage.removeItem('usuarioLogado');
      setLogado(false);
      setNome('');
      setUsuario('');
      setSenha('');
      setConfirmSenha('');
      setPosts([]);
      setNomeUsuarioLogado(null);
    } catch (error) {
      console.error('Erro ao deslogar:', error);
    }
  }

  async function handleLoginOuCadastro() {
    setLoadingAcesso(true);

    if (modoCadastro) {
      if (!nome.trim() || !usuario.trim() || !senha.trim() || !confirmSenha.trim()) {
        Vibration.vibrate();
        Alert.alert('Erro', 'Por favor, preencha todos os campos.');
        setLoadingAcesso(false);
        return;
      }
      if (senha.length < 4) {
        Vibration.vibrate();
        Alert.alert('Erro', 'A senha deve ter no mínimo 4 caracteres.');
        setLoadingAcesso(false);
        return;
      }
      if (senha !== confirmSenha) {
        Vibration.vibrate();
        Alert.alert('Erro', 'As senhas não conferem.');
        setLoadingAcesso(false);
        return;
      }

      try {
        const usuariosRef = collection(db, 'usuarios');
        const q = query(usuariosRef, where('usuario', '==', usuario));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          Vibration.vibrate();
          Alert.alert('Erro', 'Este nome de usuário já está em uso.');
          setLoadingAcesso(false);
          return;
        }

        await addDoc(usuariosRef, { nome, usuario, senha });

        Vibration.vibrate();
        Alert.alert('Sucesso', 'Cadastro realizado! Faça login.');
        setModoCadastro(false);
        setNome('');
        setUsuario('');
        setSenha('');
        setConfirmSenha('');
      } catch (error) {
        console.error(error);
        Alert.alert('Erro', 'Falha ao cadastrar usuário.');
      } finally {
        setLoadingAcesso(false);
      }

    } else {
      if (!usuario.trim() || !senha.trim()) {
        Vibration.vibrate();
        Alert.alert('Erro', 'Por favor, preencha usuário e senha.');
        setLoadingAcesso(false);
        return;
      }

      try {
        const usuariosRef = collection(db, 'usuarios');
        const q = query(usuariosRef, where('usuario', '==', usuario), where('senha', '==', senha));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0];
          const dados = doc.data();
          setNome(dados.nome);
          setUsuario(dados.usuario);
          setNomeUsuarioLogado(dados.usuario);

          Vibration.vibrate();
          await AsyncStorage.setItem('usuarioLogado', JSON.stringify({ nome: dados.nome, usuario: dados.usuario }));

          setLogado(true);
        } else {
          Vibration.vibrate()
          Alert.alert('Erro', 'Usuário ou senha incorretos.');
        }
      } catch (error) {
        console.error(error);
        Alert.alert('Erro', 'Falha ao fazer login.');
      } finally {
        setLoadingAcesso(false);
      }
    }
  }

  if (logado) {
    return (
      <View style={styles.container}>
        <Text style={[styles.titulo, GlobalStyles.titulo]}>
          Bem-vindo, {nome}!
        </Text>

        <View style={{ marginVertical: 20, flex: 1 }}>
          <Text style={styles.subtitulo}>Seus Posts:</Text>
          {loadingPosts ? (
            <ActivityIndicator size="large" color="#33b9cb" />
          ) : posts.length === 0 ? (
            <Text>Nenhum post encontrado.</Text>
          ) : (
            <FlatList
              data={posts}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.postContainer}
                  onPress={() => navigation.navigate('TelaDetalhesPost', { post: item })}
                >
                  <Text style={styles.postTitulo}>{item.nome}</Text>
                  <Text>{item.comentario}</Text>
                  <Text style={styles.postData}>{item.data}</Text>
                  
                  <Button
                    title="Excluir"
                    color="#d9534f"
                    onPress={() => {
                      Alert.alert(
                        'Confirmar exclusão',
                        'Deseja realmente excluir este post?',
                        [
                          { text: 'Cancelar', style: 'cancel' },
                          { text: 'Excluir', style: 'destructive', onPress: () => handleExcluirPost(item.id) }
                        ]
                      );
                    }}
                  />
                </TouchableOpacity>
              )}
            />
          )}
        </View>

        <Button
          title="Sair"
          color="#d9534f"
          onPress={setLogout}
          disabled={loadingAcesso}
        />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={[GlobalStyles.titulo, styles.titulo]}>
          {modoCadastro ? 'Criar Conta' : 'Login'}
        </Text>

        {modoCadastro && (
          <TextInput
            style={styles.input}
            placeholder="Nome Completo"
            value={nome}
            onChangeText={setNome}
            autoCapitalize="words"
          />
        )}

        <TextInput
          style={styles.input}
          placeholder="Nome de usuário"
          value={usuario}
          onChangeText={setUsuario}
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Senha (no mínimo 4 caracteres)"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
        />

        {modoCadastro && (
          <TextInput
            style={styles.input}
            placeholder="Confirme sua Senha"
            value={confirmSenha}
            onChangeText={setConfirmSenha}
            secureTextEntry
          />
        )}

        <Button
          title={modoCadastro ? 'Cadastrar' : 'Entrar'}
          color="#33b9cb"
          onPress={handleLoginOuCadastro}
          disabled={loadingAcesso}
        />

        <View style={{ marginTop: 12 }}>
          <Button
            title={modoCadastro ? 'Já tem conta? Faça login' : 'Não tem conta? Cadastre-se'}
            onPress={() => {
              setModoCadastro(!modoCadastro);
              setNome('');
              setUsuario('');
              setSenha('');
              setConfirmSenha('');
            }}
            color="#888"
            disabled={loadingAcesso}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  titulo: {
    fontSize: 30,
    marginTop: 50,
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitulo: {
    fontSize: 20,
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 12,
    borderRadius: 6,
  },
  postContainer: {
    backgroundColor: '#f0f8ff',
    padding: 12,
    marginBottom: 12,
    borderRadius: 6,
  },
  postTitulo: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  postData: {
    marginTop: 6,
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
});