import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AppText from './AppText';

export default function TelaA() {
  return (
    <View style={styles.container}>
      <AppText>Você está na Tela A</AppText>
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
