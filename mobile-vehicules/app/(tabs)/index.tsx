import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { api } from '../../src/services/api';
import { Vehicle, Category } from '../../src/types';
import { Colors, BorderRadius } from '../../src/constants/theme';
import { HeaderLogo } from '../../src/components/HeaderLogo';
import { CategoryPills } from '../../src/components/CategoryPills';
import { VehicleCard } from '../../src/components/VehicleCard';
import { useAuth } from '../../src/context/AuthContext';
import { ShieldCheck, Sparkles } from 'lucide-react-native';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setError(null);
      const [vehiclesRes, categoriesRes] = await Promise.all([
        api.get('/vehicles'),
        api.get('/categories'),
      ]);

      if (vehiclesRes.data?.data) {
        setVehicles(vehiclesRes.data.data);
      }
      if (categoriesRes.data?.data) {
        setCategories(categoriesRes.data.data);
      }
    } catch (err: any) {
      console.warn('Erreur lors du chargement des données:', err);
      setError('Impossible de joindre le serveur. Vérifiez votre connexion.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const filteredVehicles = selectedCategory
    ? vehicles.filter((v) => v.category_id === selectedCategory)
    : vehicles;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Barre supérieure avec Logo & Connexion */}
      <View style={styles.topBar}>
        <HeaderLogo size="md" />

        {user ? (
          <TouchableOpacity
            style={styles.userBadge}
            onPress={() => router.push('/(tabs)/profile')}
          >
            <Text style={styles.userBadgeText} numberOfLines={1}>
              {user.name.split(' ')[0]}
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => router.push('/login')}
          >
            <Text style={styles.loginButtonText}>Connexion</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={filteredVehicles}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <VehicleCard
            vehicle={item}
            onPress={() => router.push(`/vehicle/${item.id}`)}
          />
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.primary]}
          />
        }
        ListHeaderComponent={
          <View>
            {/* Bannière Promotionnelle */}
            <View style={styles.banner}>
              <View style={styles.bannerBadge}>
                <Sparkles size={13} color={Colors.secondary} />
                <Text style={styles.bannerBadgeText}>TOUMAÏ DRIVE EXPRESS</Text>
              </View>
              <Text style={styles.bannerTitle}>
                Louez votre véhicule en toute sérénité au Tchad
              </Text>
              <Text style={styles.bannerSubtitle}>
                Flotte récente, climatisée et révisée &bull; Prise en charge à l'aéroport ou en ville.
              </Text>

              <View style={styles.bannerFeatures}>
                <View style={styles.featureItem}>
                  <ShieldCheck size={14} color="#ffffff" />
                  <Text style={styles.featureText}>Assistance 24/7</Text>
                </View>
                <View style={styles.featureItem}>
                  <ShieldCheck size={14} color="#ffffff" />
                  <Text style={styles.featureText}>Zéro frais caché</Text>
                </View>
              </View>
            </View>

            {/* Sélecteur de Catégories */}
            <View style={styles.categoriesHeader}>
              <Text style={styles.sectionTitle}>Nos Véhicules Disponibles</Text>
              <Text style={styles.vehicleCount}>
                {filteredVehicles.length} véhicule(s)
              </Text>
            </View>

            <CategoryPills
              categories={categories}
              selectedCategoryId={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          </View>
        }
        ListEmptyComponent={
          loading ? (
            <View style={styles.centerContainer}>
              <ActivityIndicator size="large" color={Colors.primary} />
              <Text style={styles.loadingText}>Chargement des véhicules...</Text>
            </View>
          ) : error ? (
            <View style={styles.centerContainer}>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity style={styles.retryButton} onPress={loadData}>
                <Text style={styles.retryButtonText}>Réessayer</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.centerContainer}>
              <Text style={styles.emptyText}>
                Aucun véhicule disponible dans cette catégorie.
              </Text>
            </View>
          )
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  userBadge: {
    backgroundColor: '#eff6ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  userBadgeText: {
    color: Colors.primary,
    fontWeight: '700',
    fontSize: 12.5,
  },
  loginButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: BorderRadius.md,
  },
  loginButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 12.5,
  },
  listContent: {
    paddingBottom: 24,
  },
  banner: {
    margin: 16,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    padding: 18,
  },
  bannerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  bannerBadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#ffffff',
    lineHeight: 24,
  },
  bannerSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.85)',
    marginTop: 6,
    lineHeight: 17,
  },
  bannerFeatures: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 14,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  featureText: {
    fontSize: 11,
    color: '#ffffff',
    fontWeight: '600',
  },
  categoriesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    paddingHorizontal: 16,
    marginTop: 8,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.text,
  },
  vehicleCount: {
    fontSize: 12,
    color: Colors.textMuted,
    fontWeight: '500',
  },
  centerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 13,
    color: Colors.textMuted,
  },
  errorText: {
    fontSize: 13,
    color: Colors.danger,
    textAlign: 'center',
    marginBottom: 14,
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: BorderRadius.md,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
  },
  emptyText: {
    fontSize: 13,
    color: Colors.textMuted,
    textAlign: 'center',
  },
});
