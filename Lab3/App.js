import 'react-native-gesture-handler';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';

import { ThemeProvider, useThemeToggle } from './context/ThemeContext';
import { GameProvider } from './context/GameContext';
import HomeScreen from './screens/HomeScreen';
import ChallengesScreen from './screens/ChallengesScreen';
import SettingsScreen from './screens/SettingsScreen';

const Tab = createBottomTabNavigator();

function AppNavigator() {
  const theme = useTheme();
  const { isDark } = useThemeToggle();

  const base = isDark ? DarkTheme : DefaultTheme;
  const navTheme = {
    ...base,
    colors: {
      ...base.colors,
      background: theme.bg,
      card: theme.tabBar,
      border: theme.tabBarBorder,
      text: theme.text,
      primary: theme.accent,
    },
  };

  return (
    <NavigationContainer theme={navTheme}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'Клікер') {
              iconName = focused ? 'game-controller' : 'game-controller-outline';
            } else if (route.name === 'Завдання') {
              iconName = focused ? 'flag' : 'flag-outline';
            } else if (route.name === 'Налаштування') {
              iconName = focused ? 'settings' : 'settings-outline';
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: theme.accent,
          tabBarInactiveTintColor: theme.textMuted,
          tabBarLabelStyle: { fontWeight: '600', fontSize: 11 },
          tabBarStyle: {
            backgroundColor: theme.tabBar,
            borderTopColor: theme.tabBarBorder,
            borderTopWidth: 1,
            paddingTop: 4,
          },
          headerStyle: {
            backgroundColor: theme.card,
            shadowColor: 'transparent',
            elevation: 0,
            borderBottomWidth: 1,
            borderBottomColor: theme.cardBorder,
          },
          headerTitleStyle: { fontWeight: '700', fontSize: 18, color: theme.text },
          headerTintColor: theme.text,
        })}
      >
        <Tab.Screen
          name="Клікер"
          component={HomeScreen}
          options={{ title: 'Gesture Clicker' }}
        />
        <Tab.Screen
          name="Завдання"
          component={ChallengesScreen}
          options={{ title: 'Завдання' }}
        />
        <Tab.Screen
          name="Налаштування"
          component={SettingsScreen}
          options={{ title: 'Налаштування' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <GameProvider>
          <AppNavigator />
        </GameProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
