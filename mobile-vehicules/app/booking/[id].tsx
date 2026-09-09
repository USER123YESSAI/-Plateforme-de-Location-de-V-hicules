import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { api } from '../../src/services/api';
import { Vehicle, Insurance, AvailabilityCheckResponse } from '../../src/types';
import { useAuth } from '../../src/context/AuthContext';
import { Colors, BorderRadius } from '../../src/constants/theme';
import { formatPrice } from '../../src/utils/formatters';
import {
  Calendar,
  MapPin,
  Shield,
  Clock,
  AlertCircle,
  CheckCircle,
  FileText,
} from 'lucide-react-native';

export default function BookingScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [insurances, setInsurances] = useState<Insurance[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Formulaire de réservation
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const inThreeDays = new Date(tomorrow);
  inThreeDays.setDate(inThreeDays.getDate() + 3);

  const formatDateYMD = (d: Date) => d.toISOString().split('T')[0];

  const [startDate, setStartDate] = useState<string>(formatDateYMD(tomorrow));
  const [endDate, setEndDate] = useState<string>(formatDateYMD(inThreeDays));
  const [pickupLocation, setPickupLocation] = useState<string>(
    "Aéroport International Hassan Djamous (NDJ)"
  );
  const [returnLocation, setReturnLocation] = useState<string>(
    "Aéroport International Hassan Djamous (NDJ)"
  );
  const [selectedInsuranceId, setSelectedInsuranceId] = useState<number | null>(null);
  const [notes, setNotes] = useState<string>('');

  // État du devis / disponibilité
  const [checking, setChecking] = useState<boolean>(false);
  const [quote, setQuote] = useState<AvailabilityCheckResponse | null>(null);
  const [availabilityError, setAvailabilityError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    loadVehicleAndInsurances();
  }, [id]);

  async function loadVehicleAndInsurances() {
    try {
      const [vRes, iRes] = await Promise.all([
        api.get(`/vehicles/${id}`),
        api.get('/insurances').catch(() => ({ data: { data: [] } })),
      ]);

      if (vRes.data?.data) {
        setVehicle(vRes.data.data);
      }
      if (iRes.data?.data) {
        setInsurances(iRes.data.data);
      }
    } catch (e) {
      console.warn('Erreur chargement:', e);
    } finally {
      setLoading(false);
    }
  }

  // Vérification de la disponibilité et calcul de devis
  useEffect(() => {
    if (vehicle && startDate && endDate) {
      checkQuote();
    }
  }, [vehicle, startDate, endDate, selectedInsuranceId]);

  async function checkQuote() {
    setChecking(true);
    setAvailabilityError(null);
    try {
      const res = await api.post('/vehicles/check-availability', {
        vehicle_id: id,
        start_date: startDate,
        end_date: endDate,
        insurance_id: selectedInsuranceId,
      });

      if (res.data?.success) {
        setQuote(res.data.data);
      } else {
        setQuote(null);
        setAvailabilityError(
          res.data?.data?.message || 'Ce véhicule est indisponible sur cette période.'
        );
      }
    } catch (e: any) {
      const msg =
        e.response?.data?.message ||
        e.response?.data?.data?.message ||
        'Erreur lors du calcul de disponibilité.';
      setQuote(null);
      setAvailabilityError(msg);
    } finally {
      setChecking(false);
    }
  }

  // Soumission de la réservation
  async function handleSubmitBooking() {
    if (!user) {
      Alert.alert(
        'Connexion requise',
        'Veuillez vous connecter ou créer un compte pour confirmer votre réservation.',
        [
          { text: 'Annuler', style: 'cancel' },
          { text: 'Se connecter', onPress: () => router.push('/login') },
        ]
      );
      return;
    }

    if (!quote?.available) {
      Alert.alert('Indisponible', 'Veuillez sélectionner des dates valides et disponibles.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post('/rentals', {
        vehicle_id: id,
        start_date: startDate,
        end_date: endDate,
        pickup_location: pickupLocation,
        return_location: returnLocation,
        insurance_id: selectedInsuranceId,
        notes: notes.trim() || null,
      });

      if (res.data?.success && res.data?.rental?.id) {
        Alert.alert(
          '🎉 Réservation confirmée !',
          'Votre demande a été enregistrée avec succès. Vous pouvez maintenant consulter votre bon de prise en charge.',
          [
            {
              text: 'Voir mon bon de réservation',
              onPress: () => router.replace(`/rental/${res.data.rental.id}`),
            },
          ]
        );
      } else {
        Alert.alert('Information', res.data?.message || 'Réservation créée.');
        router.replace('/(tabs)/rentals');
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Impossible de finaliser la réservation.';
      Alert.alert('Erreur', msg);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Résumé du véhicule */}
        {vehicle && (
          <View style={styles.vehicleSummaryCard}>
            <Text style={styles.vehicleName}>
              {vehicle.brand} {vehicle.model} ({vehicle.year})
            </Text>
            <Text style={styles.vehiclePlate}>
              Immatriculation : {vehicle.license_plate} &bull; {formatPrice(vehicle.daily_rate)} / jour
            </Text>
          </View>
        )}

        {/* Section 1 : Dates de location */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Calendar size={18} color={Colors.primary} />
            <Text style={styles.cardTitle}>Période de Location</Text>
          </View>

          <View style={styles.datesRow}>
            <View style={styles.dateField}>
              <Text style={styles.fieldLabel}>Date de départ (AAAA-MM-JJ)</Text>
              <TextInput
                style={styles.dateInput}
                value={startDate}
                onChangeText={setStartDate}
                placeholder="2026-09-10"
              />
            </View>

            <View style={styles.dateField}>
              <Text style={styles.fieldLabel}>Date de retour (AAAA-MM-JJ)</Text>
              <TextInput
                style={styles.dateInput}
                value={endDate}
                onChangeText={setEndDate}
                placeholder="2026-09-15"
              />
            </View>
          </View>
        </View>

        {/* Section 2 : Lieux de départ et de retour */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MapPin size={18} color={Colors.primary} />
            <Text style={styles.cardTitle}>Prise en Charge & Restitution</Text>
          </View>

          <Text style={styles.fieldLabel}>Lieu de retrait (Départ)</Text>
          <TextInput
            style={styles.input}
            value={pickupLocation}
            onChangeText={setPickupLocation}
            placeholder="Ex: Aéroport Hassan Djamous ou Agence Sabangali"
          />

          <Text style={[styles.fieldLabel, { marginTop: 12 }]}>Lieu de retour (Restitution)</Text>
          <TextInput
            style={styles.input}
            value={returnLocation}
            onChangeText={setReturnLocation}
            placeholder="Ex: Même point de retrait"
          />
        </View>

        {/* Section 3 : Assurance & Protections */}
        {insurances.length > 0 && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Shield size={18} color={Colors.primary} />
              <Text style={styles.cardTitle}>Assurance Complémentaire</Text>
            </View>

            <TouchableOpacity
              style={[
                styles.insuranceOption,
                selectedInsuranceId === null && styles.insuranceOptionActive,
              ]}
              onPress={() => setSelectedInsuranceId(null)}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.insuranceTitle}>Assurance au tiers standard</Text>
                <Text style={styles.insuranceDesc}>Incluse d'office (Responsabilité civile obligatoire)</Text>
              </View>
              <Text style={styles.insurancePrice}>Gratuit</Text>
            </TouchableOpacity>

            {insurances.map((ins) => (
              <TouchableOpacity
                key={ins.id}
                style={[
                  styles.insuranceOption,
                  selectedInsuranceId === ins.id && styles.insuranceOptionActive,
                ]}
                onPress={() => setSelectedInsuranceId(ins.id)}
              >
                <View style={{ flex: 1 }}>
                  <Text style={styles.insuranceTitle}>{ins.name}</Text>
                  <Text style={styles.insuranceDesc}>
                    {ins.description || 'Couverture étendue pour tout votre séjour'}
                  </Text>
                </View>
                <Text style={styles.insurancePrice}>+{formatPrice(ins.daily_rate)} / j</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Section 4 : Instructions particulières */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <FileText size={18} color={Colors.primary} />
            <Text style={styles.cardTitle}>Remarques ou Besoins Particuliers</Text>
          </View>

          <TextInput
            style={[styles.input, { height: 75, textAlignVertical: 'top' }]}
            value={notes}
            onChangeText={setNotes}
            placeholder="Ex: Arrivée vol AF890 à 14h30, besoin d'un siège enfant..."
            placeholderTextColor={Colors.placeholder}
            multiline
            numberOfLines={3}
          />
        </View>

        {/* Récapitulatif du Devis Calculé en direct */}
        <View style={styles.quoteCard}>
          <Text style={styles.quoteTitle}>Récapitulatif & Devis Instantané</Text>

          {checking ? (
            <View style={{ paddingVertical: 14, alignItems: 'center' }}>
              <ActivityIndicator size="small" color={Colors.primary} />
              <Text style={{ marginTop: 6, fontSize: 12, color: Colors.textMuted }}>
                Calcul du tarif en temps réel...
              </Text>
            </View>
          ) : availabilityError ? (
            <View style={styles.errorBanner}>
              <AlertCircle size={18} color={Colors.danger} />
              <Text style={styles.errorBannerText}>{availabilityError}</Text>
            </View>
          ) : quote?.calculation ? (
            <View style={styles.breakdown}>
              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>
                  Durée de la location :
                </Text>
                <Text style={styles.breakdownVal}>
                  {quote.calculation.total_days} jour(s)
                </Text>
              </View>

              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>
                  Tarif véhicule ({formatPrice(quote.calculation.daily_rate)} x {quote.calculation.total_days} j) :
                </Text>
                <Text style={styles.breakdownVal}>
                  {formatPrice(quote.calculation.subtotal)}
                </Text>
              </View>

              {quote.calculation.insurance_total ? (
                <View style={styles.breakdownRow}>
                  <Text style={styles.breakdownLabel}>
                    Option {quote.calculation.insurance_name} :
                  </Text>
                  <Text style={styles.breakdownVal}>
                    {formatPrice(quote.calculation.insurance_total)}
                  </Text>
                </View>
              ) : null}

              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>TOTAL À RÉGLER :</Text>
                <Text style={styles.totalVal}>
                  {formatPrice(quote.calculation.total_amount)}
                </Text>
              </View>
            </View>
          ) : null}
        </View>
      </ScrollView>

      {/* Bouton de confirmation fixe en bas */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.bottomLabel}>Montant Total</Text>
          <Text style={styles.bottomPrice}>
            {quote?.calculation ? formatPrice(quote.calculation.total_amount) : '-- FCFA'}
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.submitBtn,
            (!quote?.available || submitting) && styles.submitBtnDisabled,
          ]}
          disabled={!quote?.available || submitting}
          onPress={handleSubmitBooking}
          activeOpacity={0.85}
        >
          {submitting ? (
            <ActivityIndicator color="#ffffff" size="small" />
          ) : (
            <Text style={styles.submitBtnText}>Confirmer ma réservation</Text>
          )}
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
    padding: 16,
    paddingBottom: 90,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vehicleSummaryCard: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    padding: 16,
    marginBottom: 14,
  },
  vehicleName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#ffffff',
  },
  vehiclePlate: {
    fontSize: 12.5,
    color: 'rgba(255, 255, 255, 0.85)',
    marginTop: 4,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: BorderRadius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 14.5,
    fontWeight: '700',
    color: Colors.text,
  },
  datesRow: {
    flexDirection: 'row',
    gap: 12,
  },
  dateField: {
    flex: 1,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textMuted,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  dateInput: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: Colors.text,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: Colors.text,
  },
  insuranceOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: '#f8fafc',
    marginBottom: 8,
  },
  insuranceOptionActive: {
    borderColor: Colors.primary,
    backgroundColor: '#eff6ff',
  },
  insuranceTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.text,
  },
  insuranceDesc: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
  insurancePrice: {
    fontSize: 12.5,
    fontWeight: '700',
    color: Colors.primary,
    marginLeft: 10,
  },
  quoteCard: {
    backgroundColor: '#ffffff',
    borderRadius: BorderRadius.lg,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#bfdbfe',
    marginBottom: 14,
  },
  quoteTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: Colors.primary,
    marginBottom: 10,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#fee2e2',
    padding: 10,
    borderRadius: BorderRadius.md,
  },
  errorBannerText: {
    flex: 1,
    fontSize: 12,
    color: Colors.danger,
    fontWeight: '600',
  },
  breakdown: {
    gap: 8,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  breakdownLabel: {
    fontSize: 12.5,
    color: Colors.textMuted,
  },
  breakdownVal: {
    fontSize: 12.5,
    fontWeight: '600',
    color: Colors.text,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.text,
  },
  totalVal: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.primary,
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
  bottomLabel: {
    fontSize: 10.5,
    color: Colors.textMuted,
    textTransform: 'uppercase',
  },
  bottomPrice: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.primary,
  },
  submitBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: BorderRadius.md,
  },
  submitBtnDisabled: {
    backgroundColor: Colors.textLight,
  },
  submitBtnText: {
    color: '#ffffff',
    fontSize: 13.5,
    fontWeight: '700',
  },
});
