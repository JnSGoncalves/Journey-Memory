import React from 'react';
import { Text, StyleSheet } from 'react-native';

// Define a fonte dos textos
export default function AppText({ children, style, ...props }) {
  return (
    <Text style={[styles.texto, style]} {...props}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  texto: {
    fontFamily: 'AppFonte',
  },
});
