import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Image, ScrollView, Text, Alert, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Platform, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../services/firebaseConfig';
import GlobalStyles from '../GlobalStyles';

export default function TelaNovoPost() {
  const [nome, setNome] = useState('');
  const [localizacao, setLocalizacao] = useState('');
  const [data, setData] = useState(null);
  const [mostrarPicker, setMostrarPicker] = useState(false);
  const [comentario, setComentario] = useState('');
  const [imagens, setImagens] = useState([]);
  const [enviando, setEnviando] = useState(false);
  const [nomeUsuario, setNomeUsuario] = useState('');

  const TAMANHO_MAX_MB = 20;
  const TAMANHO_MAX_BYTES = TAMANHO_MAX_MB * 1024 * 1024;

  useEffect(() => {
    const buscarUsuario = async () => {
      try {
        const usuarioSalvo = await AsyncStorage.getItem('usuarioLogado');
        if (usuarioSalvo) {
          const usuarioObj = JSON.parse(usuarioSalvo);
          setNomeUsuario(usuarioObj.usuario);
        }
      } catch (e) {
        console.error('Erro ao buscar usuário:', e);
      }
    };

    buscarUsuario();
  }, []);

  const aoSelecionarData = (event, selectedDate) => {
    setMostrarPicker(Platform.OS === 'ios');
    if (selectedDate) setData(selectedDate);
  };


  const selecionarImagem = async () => {
    if (imagens.length >= 15) {
      return Alert.alert('Limite atingido', 'Máximo de 15 imagens por post.');
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: true,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      selectionLimit: 15 - imagens.length,
    });

    if (!resultado.canceled) {
      const novasImagens = resultado.assets || [];

      // Verificar tamanho antes de adicionar
      const verificacaoPromises = novasImagens.map(async (imagem) => {
        try {
          const fileInfo = await FileSystem.getInfoAsync(imagem.uri);
          if (fileInfo.size > TAMANHO_MAX_BYTES) {
            Alert.alert(
              'Imagem muito grande',
              `"${imagem.fileName || 'imagem'}" ultrapassa 20MB.`
            );
            return null;
          }
          return imagem;
        } catch (error) {
          console.error('Erro na verificação:', error);
          Alert.alert('Erro', 'Não foi possível verificar a imagem.');
          return null;
        }
      });

      const imagensValidas = (await Promise.all(verificacaoPromises)).filter(Boolean);

      setImagens((prev) => [...prev, ...imagensValidas].slice(0, 15));
    }
  };

  const uploadParaCloudinary = async (imagem) => {
    const data = new FormData();
    data.append('file', {
      uri: imagem.uri,
      type: 'image/jpeg',
      name: 'upload.jpg',
    });
    data.append('upload_preset', 'preset_publico');

    const res = await axios.post(
      'https://api.cloudinary.com/v1_1/dgovhcmcr/image/upload',
      data,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );

    return res.data.secure_url;
  };

  const criarPost = async () => {
    if (imagens.length === 0) {
      return Alert.alert('Imagens obrigatórias', 'Selecione pelo menos uma imagem para criar o post.');
    }

    try {
      setEnviando(true);

      const urlsImagens = await Promise.all(
        imagens.map((img) => uploadParaCloudinary(img))
      );

      await addDoc(collection(db, 'posts'), {
        nome,
        localizacao,
        data,
        comentario,
        imagens: urlsImagens,
        nomeUsuario: nomeUsuario || 'desconhecido',
      });

      Alert.alert('Sucesso', 'Post criado com sucesso!');
      setNome('');
      setLocalizacao('');
      setData('');
      setComentario('');
      setImagens([]);
    } catch (e) {
      console.error(e);
      Alert.alert('Erro', 'Falha ao criar o post');
    } finally {
      setEnviando(false);
    }
  };


  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text style={[styles.titulo, GlobalStyles.titulo]}>Novo Post</Text>
      <TextInput
        placeholder="Nome da viagem"
        value={nome}
        onChangeText={setNome}
        style={{ marginBottom: 10, borderBottomWidth: 1 }}
      />
      <TextInput
        placeholder="Localização"
        value={localizacao}
        onChangeText={setLocalizacao}
        style={{ marginBottom: 10, borderBottomWidth: 1 }}
      />
      <TouchableOpacity onPress={() => setMostrarPicker(true)} style={{ marginBottom: 10, borderBottomWidth: 1, paddingVertical: 10 }}>
        <Text style={{ color: data ? '#000' : '#aaa' }}>
          {data ? data.toLocaleDateString() : 'Selecionar data da viagem'}
        </Text>
      </TouchableOpacity>
        {mostrarPicker && (
          <DateTimePicker
            value={data || new Date()}
            mode="date"
            display="default"
            onChange={aoSelecionarData}
          />
        )
      }
      <TextInput
        placeholder="Comentário"
        value={comentario}
        onChangeText={setComentario}
        style={{ marginBottom: 10, borderBottomWidth: 1 }}
        multiline
      />
      <Button title="Selecionar Imagens" onPress={selecionarImagem} />
      <ScrollView horizontal>
        {imagens.map((img, idx) => (
          <Image
            key={idx}
            source={{ uri: img.uri }}
            style={{ width: 100, height: 100, margin: 5 }}
          />
        ))}
      </ScrollView>
      <Button
        title={enviando ? 'Enviando...' : 'Criar Post'}
        onPress={criarPost}
        disabled={enviando}
      />
    </ScrollView>
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
    marginTop: 40,
    marginBottom: 25,
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
