import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface BadgeProps {
  label: string;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'neutral' | 'info';
  size?: 'sm' | 'md';
}

export function Badge({ label, variant = 'primary', size = 'sm' }: BadgeProps) {
  const stylesConfig = {
    primary: { bg: '#eff6ff', text: '#1d4ed8', border: '#bfdbfe' },
    success: { bg: '#dcfce7', text: '#15803d', border: '#bbf7d0' },
    warning: { bg: '#fef3c7', text: '#b45309', border: '#fde68a' },
    danger: { bg: '#fee2e2', text: '#b91c1c', border: '#fecaca' },
    neutral: { bg: '#f1f5f9', text: '#475569', border: '#e2e8f0' },
    info: { bg: '#e0e7ff', text: '#4338ca', border: '#c7d2fe' },
  };

  const current = stylesConfig[variant] || stylesConfig.neutral;

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: current.bg,
          borderColor: current.border,
          paddingVertical: size === 'sm' ? 2 : 4,
          paddingHorizontal: size === 'sm' ? 8 : 12,
        },
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            color: current.text,
            fontSize: size === 'sm' ? 10.5 : 12,
          },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 9999,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  text: {
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
});
