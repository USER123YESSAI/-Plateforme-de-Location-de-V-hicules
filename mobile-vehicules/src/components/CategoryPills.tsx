import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Category } from '../types';
import { Colors, BorderRadius } from '../constants/theme';

interface CategoryPillsProps {
  categories: Category[];
  selectedCategoryId: number | null;
  onSelectCategory: (id: number | null) => void;
}

export function CategoryPills({
  categories,
  selectedCategoryId,
  onSelectCategory,
}: CategoryPillsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      <TouchableOpacity
        style={[
          styles.pill,
          selectedCategoryId === null && styles.pillActive,
        ]}
        onPress={() => onSelectCategory(null)}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.pillText,
            selectedCategoryId === null && styles.pillTextActive,
          ]}
        >
          Tous les véhicules
        </Text>
      </TouchableOpacity>

      {categories.map((cat) => {
        const isActive = selectedCategoryId === cat.id;
        return (
          <TouchableOpacity
            key={cat.id}
            style={[styles.pill, isActive && styles.pillActive]}
            onPress={() => onSelectCategory(cat.id)}
            activeOpacity={0.7}
          >
            <Text style={[styles.pillText, isActive && styles.pillTextActive]}>
              {cat.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  pillActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  pillText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  pillTextActive: {
    color: '#ffffff',
  },
});
