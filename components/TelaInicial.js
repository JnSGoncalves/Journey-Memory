import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import AppText from './AppText';
import GlobalStyles from '../GlobalStyles';

export default function TelaInicial() {
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/memory-journey-logo.png')}
        style={{ width: 200, height: 200 }}
      />

      <AppText style={GlobalStyles.texto}>
        {'Bem-vindo ao Memory Journey!\n' + 
        'Compartilhe aqui suas melhores memórias de viagens!'}
      </AppText>
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
