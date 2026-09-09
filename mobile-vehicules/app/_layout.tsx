import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from '../src/context/AuthContext';
import { Colors } from '../src/constants/theme';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: '#ffffff',
            },
            headerTintColor: Colors.primary,
            headerTitleStyle: {
              fontWeight: '700',
              color: Colors.text,
            },
            headerShadowVisible: false,
            contentStyle: {
              backgroundColor: Colors.background,
            },
          }}
        >
          {/* Écrans principaux avec barre d'onglets */}
          <Stack.Screen
            name="(tabs)"
            options={{ headerShown: false }}
          />

          {/* Fiche détaillée du véhicule */}
          <Stack.Screen
            name="vehicle/[id]"
            options={{
              title: 'Détails du véhicule',
              headerBackTitle: 'Retour',
            }}
          />

          {/* Écran de réservation */}
          <Stack.Screen
            name="booking/[id]"
            options={{
              title: 'Réserver ce véhicule',
              headerBackTitle: 'Retour',
            }}
          />

          {/* Écran du bon de réservation / prise en charge */}
          <Stack.Screen
            name="rental/[id]"
            options={{
              title: 'Bon de Prise en Charge',
              headerBackTitle: 'Retour',
            }}
          />

          {/* Connexion / Inscription modales */}
          <Stack.Screen
            name="login"
            options={{
              title: 'Connexion Client',
              presentation: 'modal',
            }}
          />

          <Stack.Screen
            name="register"
            options={{
              title: 'Inscription',
              presentation: 'modal',
            }}
          />
        </Stack>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
