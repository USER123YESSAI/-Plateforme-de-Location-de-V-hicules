import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Rental } from '../types';
import { Colors, BorderRadius } from '../constants/theme';
import { formatDate, formatPrice } from '../utils/formatters';
import { Badge } from './Badge';
import { Calendar, MapPin, ChevronRight, Car } from 'lucide-react-native';

interface RentalCardProps {
  rental: Rental;
  onPress: () => void;
}

export function RentalCard({ rental, onPress }: RentalCardProps) {
  const statusConfig: Record<string, { label: string; variant: 'warning' | 'success' | 'primary' | 'neutral' | 'danger' }> = {
    pending: { label: 'En attente', variant: 'warning' },
    confirmed: { label: 'Confirmée', variant: 'success' },
    active: { label: 'En cours', variant: 'primary' },
    completed: { label: 'Terminée', variant: 'neutral' },
    cancelled: { label: 'Annulée', variant: 'danger' },
  };

  const currentStatus = statusConfig[rental.status] || { label: rental.status, variant: 'neutral' };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.85}
    >
      {/* En-tête avec véhicule et statut */}
      <View style={styles.header}>
        <View style={styles.vehicleInfo}>
          <View style={styles.carIconWrapper}>
            <Car size={20} color={Colors.primary} />
          </View>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.vehicleTitle} numberOfLines={1}>
              {rental.vehicle ? `${rental.vehicle.brand} ${rental.vehicle.model}` : `Réservation #${rental.id}`}
            </Text>
            {rental.vehicle && (
              <Text style={styles.licensePlate}>{rental.vehicle.license_plate}</Text>
            )}
          </View>
        </View>
        <Badge label={currentStatus.label} variant={currentStatus.variant} />
      </View>

      {/* Dates et durée */}
      <View style={styles.section}>
        <View style={styles.row}>
          <Calendar size={14} color={Colors.textMuted} />
          <Text style={styles.rowText}>
            Du <Text style={styles.bold}>{formatDate(rental.start_date)}</Text> au{' '}
            <Text style={styles.bold}>{formatDate(rental.end_date)}</Text> ({rental.total_days} jours)
          </Text>
        </View>

        {/* Lieu de départ */}
        <View style={styles.row}>
          <MapPin size={14} color={Colors.textMuted} />
          <Text style={styles.rowText} numberOfLines={1}>
            Départ : {rental.pickup_location || "Agence Centrale Toumaï Drive (N'Djamena)"}
          </Text>
        </View>
      </View>

      {/* Pied de carte avec total et chevron */}
      <View style={styles.footer}>
        <View>
          <Text style={styles.priceLabel}>Montant Total</Text>
          <Text style={styles.priceValue}>{formatPrice(rental.total_amount)}</Text>
        </View>

        <View style={styles.detailsBtn}>
          <Text style={styles.detailsBtnText}>Voir le bon</Text>
          <ChevronRight size={16} color={Colors.primary} />
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
    marginBottom: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderColor: '#f1f5f9',
  },
  vehicleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  carIconWrapper: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  vehicleTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
  },
  licensePlate: {
    fontSize: 11.5,
    color: Colors.textMuted,
    marginTop: 1,
  },
  section: {
    paddingVertical: 12,
    gap: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rowText: {
    fontSize: 12.5,
    color: Colors.textMuted,
    flex: 1,
  },
  bold: {
    fontWeight: '700',
    color: Colors.text,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderColor: '#f1f5f9',
  },
  priceLabel: {
    fontSize: 10.5,
    color: Colors.textMuted,
    textTransform: 'uppercase',
  },
  priceValue: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.primary,
  },
  detailsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  detailsBtnText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: Colors.primary,
  },
});
