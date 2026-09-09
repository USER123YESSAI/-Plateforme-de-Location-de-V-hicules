import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { api } from '../../src/services/api';
import { Vehicle } from '../../src/types';
import { Colors, BorderRadius } from '../../src/constants/theme';
import { formatPrice, getImageUrl } from '../../src/utils/formatters';
import { Badge } from '../../src/components/Badge';
import {
  Users,
  Fuel,
  Gauge,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  Car,
  MapPin,
} from 'lucide-react-native';

export default function VehicleDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [imageError, setImageError] = useState<boolean>(false);

  useEffect(() => {
    loadVehicle();
  }, [id]);

  async function loadVehicle() {
    try {
      const res = await api.get(`/vehicles/${id}`);
      if (res.data?.data) {
        setVehicle(res.data.data);
      }
    } catch (e) {
      console.warn('Erreur chargement véhicule:', e);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Chargement des caractéristiques...</Text>
      </View>
    );
  }

  if (!vehicle) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Véhicule introuvable.</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>Retour au catalogue</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const imageUrl = !imageError ? getImageUrl(vehicle.image) : null;
  const isAvailable = vehicle.status === 'available';

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Grande Photo du véhicule */}
        <View style={styles.imageWrapper}>
          {imageUrl ? (
            <Image
              source={{ uri: imageUrl }}
              style={styles.image}
              resizeMode="cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <View style={styles.placeholder}>
              <Car size={50} color={Colors.textLight} />
            </View>
          )}

          <View style={styles.badgeTopLeft}>
            {vehicle.category && (
              <Badge label={vehicle.category.name} variant="primary" />
            )}
          </View>

          <View style={styles.badgeTopRight}>
            <Badge
              label={isAvailable ? 'Disponible' : 'Réservé'}
              variant={isAvailable ? 'success' : 'neutral'}
            />
          </View>
        </View>

        <View style={styles.body}>
          {/* Titre & Immatriculation */}
          <View style={styles.titleSection}>
            <Text style={styles.vehicleTitle}>
              {vehicle.brand} {vehicle.model}
            </Text>
            <Text style={styles.plateAndYear}>
              Immatriculation : <Text style={styles.bold}>{vehicle.license_plate}</Text> &bull; Année {vehicle.year}
            </Text>
          </View>

          {/* Grille des caractéristiques techniques */}
          <View style={styles.specsGrid}>
            <View style={styles.specBox}>
              <Gauge size={18} color={Colors.primary} />
              <Text style={styles.specBoxLabel}>Boîte</Text>
              <Text style={styles.specBoxValue}>
                {vehicle.transmission === 'automatic' ? 'Automatique' : 'Manuelle'}
              </Text>
            </View>

            <View style={styles.specBox}>
              <Fuel size={18} color={Colors.primary} />
              <Text style={styles.specBoxLabel}>Énergie</Text>
              <Text style={styles.specBoxValue}>
                {vehicle.fuel_type.charAt(0).toUpperCase() + vehicle.fuel_type.slice(1)}
              </Text>
            </View>

            <View style={styles.specBox}>
              <Users size={18} color={Colors.primary} />
              <Text style={styles.specBoxLabel}>Capacité</Text>
              <Text style={styles.specBoxValue}>{vehicle.seats} Places</Text>
            </View>

            <View style={styles.specBox}>
              <Calendar size={18} color={Colors.primary} />
              <Text style={styles.specBoxLabel}>Climatisation</Text>
              <Text style={styles.specBoxValue}>Incluse</Text>
            </View>
          </View>

          {/* Avantages Toumaï Drive */}
          <View style={styles.advantagesCard}>
            <Text style={styles.cardTitle}>Inclus avec cette location</Text>
            
            <View style={styles.advantageRow}>
              <CheckCircle2 size={16} color={Colors.accent} />
              <Text style={styles.advantageText}>Kilométrage illimité sur le territoire national</Text>
            </View>

            <View style={styles.advantageRow}>
              <CheckCircle2 size={16} color={Colors.accent} />
              <Text style={styles.advantageText}>Assurance Responsabilité Civile au tiers obligatoire</Text>
            </View>

            <View style={styles.advantageRow}>
              <CheckCircle2 size={16} color={Colors.accent} />
              <Text style={styles.advantageText}>Véhicule révisé, nettoyé et désinfecté avant remise</Text>
            </View>

            <View style={styles.advantageRow}>
              <CheckCircle2 size={16} color={Colors.accent} />
              <Text style={styles.advantageText}>Assistance dépannage Toumaï 24h/24 et 7j/7</Text>
            </View>
          </View>

          {/* Lieux de retrait disponibles */}
          <View style={styles.pickupInfoCard}>
            <View style={styles.pickupHeader}>
              <MapPin size={18} color={Colors.primary} />
              <Text style={styles.cardTitle}>Points de Prise en Charge</Text>
            </View>
            <Text style={styles.pickupDesc}>
              Ce véhicule peut être mis à votre disposition à l'Aéroport International Hassan Djamous (accueil personnalisé avec pancarte) ou à notre Agence Centrale de N'Djamena.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Barre d'action inférieure fixe */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.priceLabel}>Prix de location</Text>
          <Text style={styles.priceValue}>{formatPrice(vehicle.daily_rate)} <Text style={styles.perDay}>/ jour</Text></Text>
        </View>

        <TouchableOpacity
          style={[styles.bookBtn, !isAvailable && styles.bookBtnDisabled]}
          disabled={!isAvailable}
          onPress={() => router.push(`/booking/${vehicle.id}`)}
          activeOpacity={0.85}
        >
          <Text style={styles.bookBtnText}>
            {isAvailable ? 'Réserver maintenant' : 'Actuellement loué'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingBottom: 90,
  },
  imageWrapper: {
    width: '100%',
    height: 230,
    backgroundColor: '#e2e8f0',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeTopLeft: {
    position: 'absolute',
    top: 14,
    left: 14,
  },
  badgeTopRight: {
    position: 'absolute',
    top: 14,
    right: 14,
  },
  body: {
    padding: 18,
  },
  titleSection: {
    marginBottom: 16,
  },
  vehicleTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.text,
  },
  plateAndYear: {
    fontSize: 13,
    color: Colors.textMuted,
    marginTop: 4,
  },
  bold: {
    fontWeight: '700',
    color: Colors.text,
  },
  specsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 18,
  },
  specBox: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: BorderRadius.md,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'flex-start',
  },
  specBoxLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 6,
    textTransform: 'uppercase',
  },
  specBoxValue: {
    fontSize: 13.5,
    fontWeight: '700',
    color: Colors.text,
    marginTop: 2,
  },
  advantagesCard: {
    backgroundColor: '#ffffff',
    borderRadius: BorderRadius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
    gap: 10,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  advantageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  advantageText: {
    fontSize: 12.5,
    color: Colors.text,
    flex: 1,
  },
  pickupInfoCard: {
    backgroundColor: '#eff6ff',
    borderRadius: BorderRadius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  pickupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  pickupDesc: {
    fontSize: 12.5,
    color: Colors.textMuted,
    lineHeight: 18,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    textTransform: 'uppercase',
  },
  priceValue: {
    fontSize: 19,
    fontWeight: '800',
    color: Colors.primary,
  },
  perDay: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.textMuted,
  },
  bookBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 22,
    paddingVertical: 13,
    borderRadius: BorderRadius.md,
  },
  bookBtnDisabled: {
    backgroundColor: Colors.textLight,
  },
  bookBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    color: Colors.textMuted,
  },
  errorText: {
    fontSize: 15,
    color: Colors.danger,
    marginBottom: 12,
  },
  backBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: BorderRadius.md,
  },
  backBtnText: {
    color: '#ffffff',
    fontWeight: '600',
  },
});
