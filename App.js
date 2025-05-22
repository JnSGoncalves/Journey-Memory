import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Font from 'expo-font';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View, LogBox } from 'react-native';

import { IconHome, IconMountain, IconUser } from './components/IconsSvg';
import TelaUsuario from './components/TelaUsuario';
import TelaNovoPost from './components/TelaNovoPost';
import TelaInicial from './components/TelaInicial';
import TelaPosts from './components/TelaPosts';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function Tabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="Início"
        component={TelaInicial}
        options={{
          tabBarIcon: ({ color, size }) => <IconHome color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Posts"
        component={TelaPosts}
        options={{
          tabBarIcon: ({ color, size }) => <IconMountain color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Conta"
        component={TelaUsuario}
        options={{
          tabBarIcon: ({ color, size }) => <IconUser color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [fonteCarregada, setFonteCarregada] = useState(false);

  useEffect(() => {
    const carregarFontes = async () => {
      try {
        await Font.loadAsync({
          AppFonte: require('./assets/fonts/SpaceMono-Regular.ttf'),
          AppFonteBold: require('./assets/fonts/SpaceMono-Bold.ttf'),
        });
        setFonteCarregada(true);
      } catch (error) {
        console.warn('Erro ao carregar fonte:', error);
      }
    };

    carregarFontes();

    LogBox.ignoreLogs(['Remote debugger']);
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
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Tabs" component={Tabs} />
        <Stack.Screen name="TelaNovoPost" component={TelaNovoPost} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
