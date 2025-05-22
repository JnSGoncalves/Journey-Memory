import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import GlobalStyles from '../GlobalStyles';

export default function TelaNovoPost() {
  return (
    <View style={styles.container}>
      <Text style={GlobalStyles.texto}>
        Tela novo Post
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
});
