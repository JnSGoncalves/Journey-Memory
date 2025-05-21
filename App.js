import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as Font from 'expo-font';
import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';

import TelaInicial from './components/TelaInicial';
import TelaA from './components/TelaA';
import TelaB from './components/TelaB';

const Tab = createBottomTabNavigator();

export default function App() {
  const [fonteCarregada, setFonteCarregada] = useState(false);

  useEffect(() => {
    async function carregarFontes() {
      await Font.loadAsync({
        'AppFonte': require('./assets/fonts/SpaceMono-Regular.ttf'),
      });
      setFonteCarregada(true);
    }

    carregarFontes();
  }, []);

  if (!fonteCarregada) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen name="Início" component={TelaInicial} />
        <Tab.Screen name="Tela A" component={TelaA} />
        <Tab.Screen name="Tela B" component={TelaB} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
