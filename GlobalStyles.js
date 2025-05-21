// Estilos fixos
// styles/GlobalStyles.js
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'AppFonte',
    color: '#333',
    marginBottom: 10,
  },
  texto: {
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'AppFonte',
    color: '#555',
    lineHeight: 22,
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
});
