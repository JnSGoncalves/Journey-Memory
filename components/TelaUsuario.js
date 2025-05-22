import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import GlobalStyles from '../GlobalStyles';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { db } from '../services/firebaseConfig'
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';

export default function TelaUsuario() {
  const [logado, setLogado] = useState(false);
  const [modoCadastro, setModoCadastro] = useState(false);

  const [nome, setNome] = useState('');
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmSenha, setConfirmSenha] = useState('');

  async function setLogout(){
    await AsyncStorage.removeItem('usuarioLogado');
  }

  async function handleLoginOuCadastro() {
    if (modoCadastro) {
      if (!nome.trim() || !usuario.trim() || !senha.trim() || !confirmSenha.trim()) {
        Alert.alert('Erro', 'Por favor, preencha todos os campos.');
        return;
      }
      if (senha.length < 4) {
        Alert.alert('Erro', 'A senha deve ter no mínimo 4 caracteres.');
        return;
      }
      if (senha !== confirmSenha) {
        Alert.alert('Erro', 'As senhas não conferem.');
        return;
      }

      try {
        // Verifica se já existe um usuário com o mesmo nome de usuário
        const usuariosRef = collection(db, 'usuarios');
        const q = query(usuariosRef, where('usuario', '==', usuario));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          Alert.alert('Erro', 'Este nome de usuário já está em uso.');
          return;
        }

        // Cria novo usuário
        await addDoc(usuariosRef, {
          nome,
          usuario,
          senha
        });

        Alert.alert('Sucesso', 'Cadastro realizado! Faça login.');
        setModoCadastro(false);
        setNome('');
        setUsuario('');
        setSenha('');
        setConfirmSenha('');
      } catch (error) {
        console.error(error);
        Alert.alert('Erro', 'Falha ao cadastrar usuário.');
      }

    } else {
      // Login
      if (!usuario.trim() || !senha.trim()) {
        Alert.alert('Erro', 'Por favor, preencha usuário e senha.');
        return;
      }

      try {
        const usuariosRef = collection(db, 'usuarios');
        const q = query(usuariosRef, where('usuario', '==', usuario), where('senha', '==', senha));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const dados = querySnapshot.docs[0].data();
          setNome(dados.nome);
          await AsyncStorage.setItem('usuarioLogado', JSON.stringify({ uid: dados.id, nome: dados.nome, usuario: dados.usuario }));
          setLogado(true);

        } else {
          Alert.alert('Erro', 'Usuário ou senha incorretos.');
        }

      } catch (error) {
        console.error(error);
        Alert.alert('Erro', 'Falha ao fazer login.');
      }
    }
  }

  // const criarPostDeTeste = async () => {
  //   try {
  //     const docRef = await addDoc(collection(db, 'posts'), {
  //       nome: 'Post de Teste',
  //       comentario: 'Esse é um comentário de teste.',
  //       localizacao: 'São Paulo - SP',
  //       imagens: ['https://i.imgur.com/s2CLe9D.jpeg', 'https://via.placeholder.com/150'],
  //       uidUser: 'teste_uid',
  //       data: '2024-12-15', // <-- data da viagem fornecida pelo usuário
  //     });
  //     console.log('Post de teste criado com ID:', docRef.id);
  //   } catch (error) {
  //     console.error('Erro ao criar post de teste:', error);
  //   }
  // };



  if (logado) {
    return (
      <View style={styles.container}>
        <Text style={[styles.titulo, GlobalStyles.titulo]}>
          Bem-vindo, {nome}!
        </Text>

        <View style={{ marginTop: 24 }}>
          <Button
            title="Sair"
            color="#d9534f"
            onPress={() => {
              setLogado(false);
              setNome('');
              setUsuario('');
              setSenha('');
              setConfirmSenha('');
              setLogout();
              // criarPostDeTeste();
            }}
          />
        </View>
      </View>
    );
  }


  return (
    <View style={styles.container}>
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
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  titulo: {
    fontSize: 30,
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 12,
    borderRadius: 6,
  },
});
