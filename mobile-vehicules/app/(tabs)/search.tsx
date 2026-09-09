import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { api } from '../../src/services/api';
import { Vehicle } from '../../src/types';
import { Colors, BorderRadius } from '../../src/constants/theme';
import { VehicleCard } from '../../src/components/VehicleCard';
import { Search, X, SlidersHorizontal } from 'lucide-react-native';

export default function SearchScreen() {
  const router = useRouter();

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [query, setQuery] = useState<string>('');
  const [transmissionFilter, setTransmissionFilter] = useState<'all' | 'automatic' | 'manual'>('all');
  const [fuelFilter, setFuelFilter] = useState<'all' | 'essence' | 'diesel' | 'electric'>('all');

  useEffect(() => {
    loadVehicles();
  }, []);

  async function loadVehicles() {
    try {
      const res = await api.get('/vehicles');
      if (res.data?.data) {
        setVehicles(res.data.data);
      }
    } catch (e) {
      console.warn('Erreur chargement véhicules:', e);
    } finally {
      setLoading(false);
    }
  }

  const filteredVehicles = vehicles.filter((v) => {
    const matchesQuery =
      query.trim() === '' ||
      `${v.brand} ${v.model} ${v.license_plate}`
        .toLowerCase()
        .includes(query.toLowerCase());

    const matchesTransmission =
      transmissionFilter === 'all' || v.transmission === transmissionFilter;

    const matchesFuel = fuelFilter === 'all' || v.fuel_type === fuelFilter;

    return matchesQuery && matchesTransmission && matchesFuel;
  });

  return (
    <View style={styles.container}>
      {/* Barre de recherche */}
      <View style={styles.searchBarContainer}>
        <View style={styles.searchBox}>
          <Search size={18} color={Colors.textMuted} />
          <TextInput
            style={styles.input}
            placeholder="Rechercher par marque ou modèle (ex: Prado, Yaris...)"
            placeholderTextColor={Colors.placeholder}
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <X size={18} color={Colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filtres rapides */}
      <View style={styles.filterSection}>
        <View style={styles.filterRow}>
          <Text style={styles.filterLabel}>Boîte :</Text>
          <TouchableOpacity
            style={[styles.filterChip, transmissionFilter === 'all' && styles.filterChipActive]}
            onPress={() => setTransmissionFilter('all')}
          >
            <Text style={[styles.filterChipText, transmissionFilter === 'all' && styles.filterChipTextActive]}>
              Toutes
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterChip, transmissionFilter === 'automatic' && styles.filterChipActive]}
            onPress={() => setTransmissionFilter('automatic')}
          >
            <Text style={[styles.filterChipText, transmissionFilter === 'automatic' && styles.filterChipTextActive]}>
              Automatique
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterChip, transmissionFilter === 'manual' && styles.filterChipActive]}
            onPress={() => setTransmissionFilter('manual')}
          >
            <Text style={[styles.filterChipText, transmissionFilter === 'manual' && styles.filterChipTextActive]}>
              Manuelle
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.filterRow}>
          <Text style={styles.filterLabel}>Énergie :</Text>
          <TouchableOpacity
            style={[styles.filterChip, fuelFilter === 'all' && styles.filterChipActive]}
            onPress={() => setFuelFilter('all')}
          >
            <Text style={[styles.filterChipText, fuelFilter === 'all' && styles.filterChipTextActive]}>
              Toutes
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterChip, fuelFilter === 'essence' && styles.filterChipActive]}
            onPress={() => setFuelFilter('essence')}
          >
            <Text style={[styles.filterChipText, fuelFilter === 'essence' && styles.filterChipTextActive]}>
              Essence
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterChip, fuelFilter === 'diesel' && styles.filterChipActive]}
            onPress={() => setFuelFilter('diesel')}
          >
            <Text style={[styles.filterChipText, fuelFilter === 'diesel' && styles.filterChipTextActive]}>
              Diesel
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Résultats */}
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsCount}>
          {filteredVehicles.length} véhicule(s) correspondant(s)
        </Text>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <FlatList
          data={filteredVehicles}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <VehicleCard
              vehicle={item}
              onPress={() => router.push(`/vehicle/${item.id}`)}
            />
          )}
          contentContainerStyle={{ paddingBottom: 24 }}
          ListEmptyComponent={
            <View style={styles.centerContainer}>
              <Text style={styles.emptyText}>Aucun véhicule ne correspond à vos filtres.</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  searchBarContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: '#ffffff',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: BorderRadius.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: Colors.text,
  },
  filterSection: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: 8,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textMuted,
    width: 60,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterChipText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  filterChipTextActive: {
    color: '#ffffff',
  },
  resultsHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  resultsCount: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  centerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 13,
    color: Colors.textMuted,
    textAlign: 'center',
  },
});
