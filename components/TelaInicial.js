import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import GlobalStyles from '../GlobalStyles';

export default function TelaInicial() {
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/memory-journey-logo.png')}
        style={{ width: 200, height: 200 }}
      />

      <Text style={[styles.texto, GlobalStyles.texto]}>
        {'Bem-vindo ao Memory Journey!\n' + 
        'Compartilhe aqui suas melhores memórias de viagens!'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  texto: {
    textAlign: 'center',
  }
});
