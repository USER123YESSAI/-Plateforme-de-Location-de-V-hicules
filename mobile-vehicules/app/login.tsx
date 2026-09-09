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
import { Mail, Lock, LogIn, Sparkles } from 'lucide-react-native';

export default function LoginModal() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin() {
    if (!email.trim() || !password) {
      setError('Veuillez renseigner votre email et mot de passe.');
      return;
    }

    setLoading(true);
    setError(null);

    const res = await login(email.trim(), password);
    setLoading(false);

    if (res.success) {
      router.back();
    } else {
      setError(res.message || 'Erreur lors de la connexion.');
    }
  }

  // Remplissage rapide pour test immédiat
  const fillTestClient = () => {
    setEmail('client@example.com');
    setPassword('client123');
    setError(null);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <HeaderLogo size="lg" showSubtitle />
          <Text style={styles.title}>Espace Client</Text>
          <Text style={styles.subtitle}>
            Connectez-vous pour louer et suivre vos réservations en direct.
          </Text>
        </View>

        {error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <View style={styles.form}>
          {/* Email */}
          <Text style={styles.label}>Adresse Email</Text>
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

          {/* Mot de passe */}
          <Text style={[styles.label, { marginTop: 14 }]}>Mot de Passe</Text>
          <View style={styles.inputWrapper}>
            <Lock size={18} color={Colors.textMuted} />
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor={Colors.placeholder}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          {/* Bouton de Connexion */}
          <TouchableOpacity
            style={styles.loginBtn}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" size="small" />
            ) : (
              <>
                <LogIn size={18} color="#ffffff" />
                <Text style={styles.loginBtnText}>Se Connecter</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Remplissage de test */}
          <TouchableOpacity
            style={styles.quickFillBtn}
            onPress={fillTestClient}
            activeOpacity={0.7}
          >
            <Sparkles size={16} color={Colors.secondary} />
            <Text style={styles.quickFillText}>
              Préremplir avec le compte test (client@example.com)
            </Text>
          </TouchableOpacity>

          {/* Lien Inscription */}
          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Pas encore de compte ? </Text>
            <TouchableOpacity onPress={() => router.push('/register')}>
              <Text style={styles.signupLink}>Créer un compte</Text>
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
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.text,
    marginTop: 16,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
  errorBox: {
    backgroundColor: '#fee2e2',
    padding: 12,
    borderRadius: BorderRadius.md,
    marginBottom: 16,
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
    gap: 6,
  },
  label: {
    fontSize: 12,
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
    paddingVertical: 11,
    gap: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: Colors.text,
  },
  loginBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: BorderRadius.md,
    marginTop: 18,
  },
  loginBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  quickFillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#fef3c7',
    paddingVertical: 10,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: '#fde68a',
    marginTop: 10,
  },
  quickFillText: {
    fontSize: 11.5,
    color: '#92400e',
    fontWeight: '700',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  footerText: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  signupLink: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },
});
