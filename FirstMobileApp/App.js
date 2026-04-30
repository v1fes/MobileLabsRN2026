import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar as RNStatusBar,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from './screens/HomeScreen';
import GalleryScreen from './screens/GalleryScreen';
import ProfileScreen from './screens/ProfileScreen';

const Tab = createMaterialTopTabNavigator();

function UniversityLogo() {
  return (
    <View style={styles.logoWrapper}>
      <View style={styles.logoRow}>
        <View style={[styles.logoCell, { backgroundColor: '#cc0000' }]} />
        <View style={[styles.logoCell, { backgroundColor: '#ff8800' }]} />
      </View>
      <View style={styles.logoRow}>
        <View style={[styles.logoCell, { backgroundColor: '#009933' }]} />
        <View style={[styles.logoCell, { backgroundColor: '#005b96' }]} />
      </View>
    </View>
  );
}

function AppHeader() {
  return (
    <View style={styles.appHeader}>
      <UniversityLogo />
      <Text style={styles.appHeaderTitle}>FirstMobileApp</Text>
      <View style={{ width: 40 }} />
    </View>
  );
}


export default function App() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <AppHeader />
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color }) => {
              let iconName;
              if (route.name === 'Головна') {
                iconName = focused ? 'home' : 'home-outline';
              } else if (route.name === 'Фотогалерея') {
                iconName = focused ? 'images' : 'images-outline';
              } else if (route.name === 'Профіль') {
                iconName = focused ? 'person' : 'person-outline';
              }
              return <Ionicons name={iconName} size={22} color={color} />;
            },
            tabBarActiveTintColor: '#6C63FF',
            tabBarInactiveTintColor: '#aaa',
            tabBarIndicatorStyle: { backgroundColor: '#6C63FF', height: 3, borderRadius: 2 },
            tabBarShowIcon: true,
            tabBarLabelStyle: { fontSize: 10, textTransform: 'none', fontWeight: '600' },
            tabBarStyle: { backgroundColor: '#1a1a2e' },
            tabBarItemStyle: { flexDirection: 'column', paddingVertical: 4 },
          })}
        >
          <Tab.Screen name="Головна" component={HomeScreen} />
          <Tab.Screen name="Фотогалерея" component={GalleryScreen} />
          <Tab.Screen name="Профіль" component={ProfileScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight : 0,
  },
  appHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#1a1a2e',
  },
  appHeaderTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.5,
  },
  logoWrapper: {
    width: 40,
    height: 40,
  },
  logoRow: {
    flexDirection: 'row',
    flex: 1,
  },
  logoCell: {
    flex: 1,
    margin: 1,
    borderRadius: 1,
  },
});
