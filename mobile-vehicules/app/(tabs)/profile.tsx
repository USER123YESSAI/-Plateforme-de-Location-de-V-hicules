import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';
import { Colors, BorderRadius } from '../../src/constants/theme';
import { HeaderLogo } from '../../src/components/HeaderLogo';
import {
  User,
  Mail,
  Phone,
  CreditCard,
  PhoneCall,
  MessageSquare,
  Shield,
  FileText,
  LogOut,
  LogIn,
} from 'lucide-react-native';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter de votre compte Toumaï Drive ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Déconnexion',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/(tabs)');
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* En-tête Profil */}
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user ? user.name.charAt(0).toUpperCase() : 'TD'}
          </Text>
        </View>

        {user ? (
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userRole}>
              Client Toumaï Drive &bull; {user.email}
            </Text>
          </View>
        ) : (
          <View style={styles.userInfo}>
            <Text style={styles.userName}>Bienvenue sur Toumaï Drive</Text>
            <Text style={styles.userRole}>Connectez-vous pour louer un véhicule</Text>
          </View>
        )}
      </View>

      {/* Bouton de connexion si non connecté */}
      {!user ? (
        <View style={styles.loginCard}>
          <Text style={styles.loginCardTitle}>Accédez à tous vos avantages</Text>
          <Text style={styles.loginCardText}>
            Réservez vos véhicules en 3 clics, retrouvez vos contrats et téléchargez vos bons de prise en charge officiels.
          </Text>
          <TouchableOpacity
            style={styles.loginBtn}
            onPress={() => router.push('/login')}
          >
            <LogIn size={18} color="#ffffff" />
            <Text style={styles.loginBtnText}>Se connecter / S'inscrire</Text>
          </TouchableOpacity>
        </View>
      ) : (
        /* Informations du Compte */
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mes Coordonnées</Text>

          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Mail size={18} color={Colors.textMuted} />
              <View style={styles.infoTextWrapper}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{user.email}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Phone size={18} color={Colors.textMuted} />
              <View style={styles.infoTextWrapper}>
                <Text style={styles.infoLabel}>Téléphone</Text>
                <Text style={styles.infoValue}>
                  {user.phone || 'Non renseigné'}
                </Text>
              </View>
            </View>

            <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
              <CreditCard size={18} color={Colors.textMuted} />
              <View style={styles.infoTextWrapper}>
                <Text style={styles.infoLabel}>Permis de conduire</Text>
                <Text style={styles.infoValue}>
                  {user.license_number || 'À présenter le jour du départ'}
                </Text>
              </View>
            </View>
          </View>
        </View>
      )}

      {/* Assistance & Agence Toumaï Drive */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Assistance & Agence Toumaï Drive</Text>

        <View style={styles.contactCard}>
          <View style={styles.contactHeader}>
            <HeaderLogo size="sm" />
          </View>

          <View style={styles.contactRow}>
            <PhoneCall size={16} color={Colors.primary} />
            <Text style={styles.contactText}>
              Assistance 24/7 : <Text style={styles.bold}>+235 66 00 00 00</Text>
            </Text>
          </View>

          <View style={styles.contactRow}>
            <MessageSquare size={16} color="#16a34a" />
            <Text style={styles.contactText}>
              WhatsApp Support : <Text style={styles.bold}>+235 99 00 00 00</Text>
            </Text>
          </View>

          <View style={styles.contactRow}>
            <Mail size={16} color={Colors.primary} />
            <Text style={styles.contactText}>contact@toumaidrive.com</Text>
          </View>

          <View style={styles.locationNote}>
            <Text style={styles.locationText}>
              📍 Agence Principale : Quartier Sabangali & Aéroport International Hassan Djamous, N'Djamena, Tchad.
            </Text>
          </View>
        </View>
      </View>

      {/* Informations Légales */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mentions & Confidentialité</Text>

        <View style={styles.legalCard}>
          <View style={styles.legalRow}>
            <FileText size={16} color={Colors.textMuted} />
            <Text style={styles.legalText}>Conditions Générales de Location</Text>
          </View>
          <View style={styles.legalRow}>
            <Shield size={16} color={Colors.textMuted} />
            <Text style={styles.legalText}>Politique de Confidentialité</Text>
          </View>
        </View>
      </View>

      {/* Bouton de Déconnexion */}
      {user && (
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <LogOut size={18} color={Colors.danger} />
          <Text style={styles.logoutText}>Se déconnecter</Text>
        </TouchableOpacity>
      )}

      <Text style={styles.versionText}>Toumaï Drive Mobile v1.0.0 &bull; Expo</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 16,
    paddingBottom: 36,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 18,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  avatarText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#ffffff',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.text,
  },
  userRole: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  loginCard: {
    backgroundColor: '#eff6ff',
    borderRadius: BorderRadius.lg,
    padding: 18,
    borderWidth: 1,
    borderColor: '#bfdbfe',
    marginBottom: 16,
  },
  loginCardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.primary,
  },
  loginCardText: {
    fontSize: 12.5,
    color: Colors.textMuted,
    marginTop: 6,
    lineHeight: 18,
    marginBottom: 14,
  },
  loginBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    borderRadius: BorderRadius.md,
  },
  loginBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  section: {
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoCard: {
    backgroundColor: '#ffffff',
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    gap: 12,
  },
  infoTextWrapper: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    textTransform: 'uppercase',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 2,
  },
  contactCard: {
    backgroundColor: '#ffffff',
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    gap: 10,
  },
  contactHeader: {
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  contactText: {
    fontSize: 13,
    color: Colors.text,
  },
  bold: {
    fontWeight: '700',
  },
  locationNote: {
    marginTop: 6,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  locationText: {
    fontSize: 12,
    color: Colors.textMuted,
    lineHeight: 16,
  },
  legalCard: {
    backgroundColor: '#ffffff',
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 14,
    gap: 12,
  },
  legalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  legalText: {
    fontSize: 13,
    color: Colors.text,
    fontWeight: '500',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#ffffff',
    paddingVertical: 14,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.dangerLight,
    marginTop: 6,
    marginBottom: 16,
  },
  logoutText: {
    color: Colors.danger,
    fontSize: 14.5,
    fontWeight: '700',
  },
  versionText: {
    textAlign: 'center',
    fontSize: 11,
    color: Colors.textLight,
  },
});
