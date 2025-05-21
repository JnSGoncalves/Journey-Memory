import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import GlobalStyles from '../GlobalStyles';

export default function TelaPosts() {
  return (
    <View style={styles.container}>
      <Text style={GlobalStyles.texto}>Você está na Tela de Posts</Text>
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
