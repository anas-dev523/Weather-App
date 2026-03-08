import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

import SearchScreen from './screens/SearchScreen';
import WeatherResultScreen from './screens/WeatherResultScreen';
import ForecastScreen from './screens/ForecastScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator
        initialRouteName="Search"
        screenOptions={{
          headerStyle: { backgroundColor: '#0f0f1a' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: '600' },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen
          name="Search"
          component={SearchScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="WeatherResult"
          component={WeatherResultScreen}
          options={({ route }) => ({ title: route.params?.cityName ?? 'Météo' })}
        />
        <Stack.Screen
          name="Forecast"
          component={ForecastScreen}
          options={{ title: 'Prévisions 5 jours' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
