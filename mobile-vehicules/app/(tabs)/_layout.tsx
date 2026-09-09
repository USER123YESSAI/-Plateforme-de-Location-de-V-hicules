import React from 'react';
import { Tabs } from 'expo-router';
import { Colors } from '../../src/constants/theme';
import { Car, Search, Calendar, User } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor: Colors.border,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
        headerStyle: {
          backgroundColor: '#ffffff',
        },
        headerTitleStyle: {
          fontWeight: '700',
          color: Colors.text,
        },
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Explorer',
          tabBarLabel: 'Véhicules',
          tabBarIcon: ({ color, size }) => <Car size={size} color={color} />,
          headerShown: false,
        }}
      />

      <Tabs.Screen
        name="search"
        options={{
          title: 'Recherche',
          tabBarLabel: 'Recherche',
          tabBarIcon: ({ color, size }) => <Search size={size} color={color} />,
        }}
      />

      <Tabs.Screen
        name="rentals"
        options={{
          title: 'Mes Réservations',
          tabBarLabel: 'Réservations',
          tabBarIcon: ({ color, size }) => <Calendar size={size} color={color} />,
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Mon Profil',
          tabBarLabel: 'Profil',
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
