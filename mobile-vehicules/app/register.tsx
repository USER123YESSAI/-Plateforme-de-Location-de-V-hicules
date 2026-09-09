import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../src/context/AuthContext';
import { Colors, BorderRadius } from '../src/constants/theme';
import { HeaderLogo } from '../src/components/HeaderLogo';
import { User, Mail, Lock, Phone, UserPlus, CheckSquare, Square } from 'lucide-react-native';

export default function RegisterModal() {
  const router = useRouter();
  const { register } = useAuth();

  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>('');
  const [acceptTerms, setAcceptTerms] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  async function handleRegister() {
    if (!name.trim() || !email.trim() || !password) {
      setError('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    if (password !== passwordConfirmation) {
      setError('Les deux mots de passe ne correspondent pas.');
      return;
    }

    if (!acceptTerms) {
      setError('Vous devez accepter les conditions de location.');
      return;
    }

    setLoading(true);
    setError(null);

    const res = await register(
      name.trim(),
      email.trim(),
      password,
      passwordConfirmation,
      phone.trim() || undefined
    );

    setLoading(false);

    if (res.success) {
      router.back();
    } else {
      setError(res.message || "Erreur lors de l'inscription.");
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <HeaderLogo size="md" />
          <Text style={styles.title}>Créer un Compte Client</Text>
          <Text style={styles.subtitle}>
            Rejoignez Toumaï Drive pour réserver facilement vos véhicules.
          </Text>
        </View>

        {error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <View style={styles.form}>
          {/* Nom complet */}
          <Text style={styles.label}>Nom et Prénom *</Text>
          <View style={styles.inputWrapper}>
            <User size={18} color={Colors.textMuted} />
            <TextInput
              style={styles.input}
              placeholder="Ex: Mahamat Ali"
              placeholderTextColor={Colors.placeholder}
              value={name}
              onChangeText={setName}
            />
          </View>

          {/* Email */}
          <Text style={[styles.label, { marginTop: 12 }]}>Adresse Email *</Text>
          <View style={styles.inputWrapper}>
            <Mail size={18} color={Colors.textMuted} />
            <TextInput
              style={styles.input}
              placeholder="votre.email@exemple.com"
              placeholderTextColor={Colors.placeholder}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          {/* Téléphone */}
          <Text style={[styles.label, { marginTop: 12 }]}>Numéro de Téléphone</Text>
          <View style={styles.inputWrapper}>
            <Phone size={18} color={Colors.textMuted} />
            <TextInput
              style={styles.input}
              placeholder="+235 66 XX XX XX"
              placeholderTextColor={Colors.placeholder}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </View>

          {/* Mot de passe */}
          <Text style={[styles.label, { marginTop: 12 }]}>Mot de Passe *</Text>
          <View style={styles.inputWrapper}>
            <Lock size={18} color={Colors.textMuted} />
            <TextInput
              style={styles.input}
              placeholder="Minimum 8 caractères"
              placeholderTextColor={Colors.placeholder}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          {/* Confirmation */}
          <Text style={[styles.label, { marginTop: 12 }]}>Confirmer le Mot de Passe *</Text>
          <View style={styles.inputWrapper}>
            <Lock size={18} color={Colors.textMuted} />
            <TextInput
              style={styles.input}
              placeholder="Confirmer le mot de passe"
              placeholderTextColor={Colors.placeholder}
              value={passwordConfirmation}
              onChangeText={setPasswordConfirmation}
              secureTextEntry
            />
          </View>

          {/* Conditions Générales */}
          <TouchableOpacity
            style={styles.termsRow}
            onPress={() => setAcceptTerms(!acceptTerms)}
            activeOpacity={0.7}
          >
            {acceptTerms ? (
              <CheckSquare size={20} color={Colors.primary} />
            ) : (
              <Square size={20} color={Colors.textMuted} />
            )}
            <Text style={styles.termsText}>
              J'accepte les Conditions Générales de Location et la politique de confidentialité de Toumaï Drive.
            </Text>
          </TouchableOpacity>

          {/* Bouton d'Inscription */}
          <TouchableOpacity
            style={styles.submitBtn}
            onPress={handleRegister}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" size="small" />
            ) : (
              <>
                <UserPlus size={18} color="#ffffff" />
                <Text style={styles.submitBtnText}>Créer mon Compte</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Lien Connexion */}
          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Vous avez déjà un compte ? </Text>
            <TouchableOpacity onPress={() => router.push('/login')}>
              <Text style={styles.loginLink}>Se connecter</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#ffffff',
    flexGrow: 1,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 21,
    fontWeight: '800',
    color: Colors.text,
    marginTop: 14,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: 4,
  },
  errorBox: {
    backgroundColor: '#fee2e2',
    padding: 12,
    borderRadius: BorderRadius.md,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  errorText: {
    color: Colors.danger,
    fontSize: 12.5,
    fontWeight: '600',
    textAlign: 'center',
  },
  form: {
    gap: 4,
  },
  label: {
    fontSize: 11.5,
    fontWeight: '700',
    color: Colors.text,
    textTransform: 'uppercase',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 10,
  },
  input: {
    flex: 1,
    fontSize: 13.5,
    color: Colors.text,
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 14,
  },
  termsText: {
    flex: 1,
    fontSize: 11.5,
    color: Colors.textMuted,
    lineHeight: 16,
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: BorderRadius.md,
    marginTop: 18,
  },
  submitBtnText: {
    color: '#ffffff',
    fontSize: 14.5,
    fontWeight: '700',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  loginLink: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },
});
