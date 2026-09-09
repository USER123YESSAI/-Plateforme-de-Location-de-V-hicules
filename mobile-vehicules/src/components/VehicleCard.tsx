import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Vehicle } from '../types';
import { Colors, BorderRadius } from '../constants/theme';
import { formatPrice, getImageUrl } from '../utils/formatters';
import { Badge } from './Badge';
import { Users, Fuel, Gauge, Car } from 'lucide-react-native';

interface VehicleCardProps {
  vehicle: Vehicle;
  onPress: () => void;
}

export function VehicleCard({ vehicle, onPress }: VehicleCardProps) {
  const [imageError, setImageError] = useState(false);
  const imageUrl = !imageError ? getImageUrl(vehicle.image) : null;

  const isAvailable = vehicle.status === 'available';

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.88}
    >
      {/* Image du véhicule */}
      <View style={styles.imageContainer}>
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            style={styles.image}
            onError={() => setImageError(true)}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholderContainer}>
            <Car size={40} color={Colors.textLight} />
            <Text style={styles.placeholderText}>
              {vehicle.brand} {vehicle.model}
            </Text>
          </View>
        )}

        {/* Badge Catégorie */}
        {vehicle.category && (
          <View style={styles.categoryBadgeWrapper}>
            <Badge label={vehicle.category.name} variant="primary" />
          </View>
        )}

        {/* Badge Disponibilité */}
        <View style={styles.statusBadgeWrapper}>
          <Badge
            label={isAvailable ? 'Disponible' : 'Réservé'}
            variant={isAvailable ? 'success' : 'neutral'}
          />
        </View>
      </View>

      {/* Contenu / Infos */}
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.vehicleTitle} numberOfLines={1}>
              {vehicle.brand} {vehicle.model}
            </Text>
            <Text style={styles.licensePlate}>{vehicle.license_plate} &bull; {vehicle.year}</Text>
          </View>
        </View>

        {/* Caractéristiques rapides */}
        <View style={styles.specsRow}>
          <View style={styles.specItem}>
            <Gauge size={14} color={Colors.textMuted} />
            <Text style={styles.specText}>
              {vehicle.transmission === 'automatic' ? 'Automatique' : 'Manuelle'}
            </Text>
          </View>

          <View style={styles.specItem}>
            <Fuel size={14} color={Colors.textMuted} />
            <Text style={styles.specText}>
              {vehicle.fuel_type.charAt(0).toUpperCase() + vehicle.fuel_type.slice(1)}
            </Text>
          </View>

          <View style={styles.specItem}>
            <Users size={14} color={Colors.textMuted} />
            <Text style={styles.specText}>{vehicle.seats} places</Text>
          </View>
        </View>

        {/* Pied de carte avec tarif */}
        <View style={styles.footer}>
          <View>
            <Text style={styles.priceLabel}>Tarif par jour</Text>
            <Text style={styles.priceValue}>{formatPrice(vehicle.daily_rate)}</Text>
          </View>

          <View style={styles.actionBtn}>
            <Text style={styles.actionBtnText}>Voir détails</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    marginHorizontal: 16,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  imageContainer: {
    height: 180,
    width: '100%',
    backgroundColor: '#f1f5f9',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  placeholderText: {
    marginTop: 8,
    fontSize: 12,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  categoryBadgeWrapper: {
    position: 'absolute',
    top: 12,
    left: 12,
  },
  statusBadgeWrapper: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  content: {
    padding: 16,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  vehicleTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.text,
  },
  licensePlate: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  specsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginTop: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#f1f5f9',
  },
  specItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  specText: {
    fontSize: 11.5,
    color: Colors.textMuted,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  priceLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    textTransform: 'uppercase',
  },
  priceValue: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.primary,
  },
  actionBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: BorderRadius.md,
  },
  actionBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
  },
});
