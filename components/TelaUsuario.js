import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import GlobalStyles from '../GlobalStyles';

export default function TelaUsuario() {
  const [logado, setLogado] = useState(false);
  const [modoCadastro, setModoCadastro] = useState(false);

  const [nome, setNome] = useState('');
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmSenha, setConfirmSenha] = useState('');

  function handleLoginOuCadastro() {
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
      setLogado(true);
    } else {
      if (!usuario.trim() || !senha.trim()) {
        Alert.alert('Erro', 'Por favor, preencha usuário e senha.');
        return;
      }
      setLogado(true);
    }
  }

  if (logado) {
    return (
      <View style={styles.container}>
        <Text style={[styles.titulo, GlobalStyles.titulo]}>
          Bem-vindo, {nome || usuario}!
        </Text>
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
