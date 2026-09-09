import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/theme';

interface HeaderLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
}

export function HeaderLogo({ size = 'md', showSubtitle = false }: HeaderLogoProps) {
  const heights = { sm: 32, md: 44, lg: 60 };
  const widths = { sm: 100, md: 140, lg: 190 };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/logo.jpg')}
        style={{
          height: heights[size],
          width: widths[size],
          resizeMode: 'contain',
        }}
      />
      {showSubtitle && (
        <Text style={styles.subtitle}>Location & Mobilité de Véhicules</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtitle: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
    fontWeight: '500',
  },
});
