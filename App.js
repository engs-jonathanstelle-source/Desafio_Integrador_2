import { ActivityIndicator, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import AgendamentosScreen from './screens/AgendamentosScreen';

const Stack = createStackNavigator();

function Rotas() {
  const { usuario, carregando } = useAuth();

  if (carregando) {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#2D6A4F" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerTintColor: '#1B4332' }}>
      {usuario ? (
        <>
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Parque Urbano' }} />
          <Stack.Screen name="Agendamento" component={AgendamentosScreen} options={{ title: 'Agendar' }} />
        </>
      ) : (
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Rotas />
        <StatusBar style="dark" />
      </NavigationContainer>
    </AuthProvider>
  );
}
