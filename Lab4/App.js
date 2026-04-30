import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './screens/HomeScreen';
import BrowseScreen from './screens/BrowseScreen';
import FileViewScreen from './screens/FileViewScreen';
import FileInfoScreen from './screens/FileInfoScreen';

const Stack = createNativeStackNavigator();

const NAV_THEME = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#f0f2f8',
    card: '#1a1a2e',
    text: '#fff',
    border: 'transparent',
    primary: '#6C63FF',
  },
};

const HEADER_OPT = {
  headerTintColor: '#fff',
  headerTitleStyle: { fontWeight: '700', fontSize: 17 },
  headerStyle: { backgroundColor: '#1a1a2e' },
};

export default function App() {
  return (
    <NavigationContainer theme={NAV_THEME}>
      <Stack.Navigator screenOptions={HEADER_OPT}>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Файловий менеджер' }}
        />
        <Stack.Screen
          name="Browse"
          component={BrowseScreen}
          options={{ title: 'Огляд' }}
        />
        <Stack.Screen
          name="FileView"
          component={FileViewScreen}
          options={{ title: 'Файл' }}
        />
        <Stack.Screen
          name="FileInfo"
          component={FileInfoScreen}
          options={{ title: 'Інформація' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
