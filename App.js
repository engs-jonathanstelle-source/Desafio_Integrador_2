import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from './screens/HomeScreen';
import ListaScreen from './screens/ListaScreen';
import DetalhesScreens from './screens/DetalhesScreens';
import { cores } from './services/cores';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: { backgroundColor: cores.primaria },
          headerTintColor: cores.branco,
        }}
      >
        {/* Tela 1: boas-vindas */}
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        {/* Tela 2: mapa + lista de quadras */}
        <Stack.Screen name="Lista" component={ListaScreen} options={{ title: 'Mapa do Parque' }} />
        {/* Tela 3: seleção de horários */}
        <Stack.Screen name="Detalhes" component={DetalhesScreens} options={{ title: 'Agendar' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}