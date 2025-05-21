import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AppText from './AppText';

export default function TelaInicial() {
  return (
    <View style={styles.container}>
      <AppText>Bem-vindo à Tela Inicial</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
