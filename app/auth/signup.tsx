import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { AppTheme, layout } from '@/constants/theme';

import { supabase } from '../../src/lib/supabase';

export default function SignupScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSignup() {
    if (!fullName.trim() || !email.trim() || !password) {
      Alert.alert('Missing fields', 'Enter name, email, and password.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Weak password', 'Password should be at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
      });

      if (error) {
        Alert.alert('Signup failed', error.message);
        return;
      }

      const userId = data.user?.id;

      if (!userId) {
        Alert.alert('Account created', 'Check your email, then log in.');
        router.push('/auth/login' as any);
        return;
      }

      const { error: profileError } = await supabase.from('profiles').insert({
        id: userId,
        full_name: fullName.trim(),
        role: 'student',
      });

      if (profileError) {
        Alert.alert('Profile error', profileError.message);
        return;
      }

      Alert.alert('Account created', 'Now log in.');
      router.push('/auth/login' as any);
    } finally {
      setLoading(false);
    }
  }

  const disabled = loading || !fullName.trim() || !email.trim() || !password;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.keyboardView}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <Text style={styles.brand}>TutorMatch</Text>
          <Text style={styles.title}>Create account</Text>

          <Text style={styles.label}>Full name</Text>
          <TextInput
            placeholder="Full name"
            placeholderTextColor={AppTheme.colors.subtle}
            value={fullName}
            onChangeText={setFullName}
            autoCapitalize="words"
            style={styles.input}
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            placeholder="you@example.com"
            placeholderTextColor={AppTheme.colors.subtle}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            style={styles.input}
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            placeholder="Password"
            placeholderTextColor={AppTheme.colors.subtle}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
          />

          <Pressable
            disabled={disabled}
            onPress={handleSignup}
            style={({ pressed }) => [
              styles.primaryButton,
              disabled ? styles.primaryButtonDisabled : null,
              pressed && !disabled ? styles.primaryButtonPressed : null,
            ]}
          >
            <Text style={styles.primaryButtonText}>
              {loading ? 'Creating account...' : 'Create Account'}
            </Text>
          </Pressable>

          <Pressable onPress={() => router.push('/auth/login' as any)}>
            <Text style={styles.linkText}>Already have an account? Login</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
    backgroundColor: AppTheme.colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: layout.screenPadding,
  },
  card: {
    width: '100%',
    maxWidth: 440,
    padding: AppTheme.spacing.xxl,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    borderRadius: AppTheme.radius.xl,
    backgroundColor: AppTheme.colors.surface,
    ...AppTheme.shadows.card,
  },
  brand: {
    color: AppTheme.colors.primary,
    fontWeight: '800',
    marginBottom: AppTheme.spacing.sm,
  },
  title: {
    fontSize: AppTheme.typography.authTitle,
    fontWeight: '800',
    color: AppTheme.colors.text,
    marginBottom: AppTheme.spacing.xxl,
  },
  label: {
    color: AppTheme.colors.text,
    fontWeight: '700',
    marginBottom: AppTheme.spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    backgroundColor: AppTheme.colors.surface,
    paddingHorizontal: AppTheme.spacing.md,
    minHeight: 48,
    borderRadius: AppTheme.radius.md,
    marginBottom: AppTheme.spacing.lg,
    color: AppTheme.colors.text,
  },
  primaryButton: {
    backgroundColor: AppTheme.colors.primary,
    minHeight: 48,
    justifyContent: 'center',
    paddingHorizontal: AppTheme.spacing.lg,
    borderRadius: AppTheme.radius.md,
    marginTop: AppTheme.spacing.sm,
  },
  primaryButtonDisabled: {
    backgroundColor: AppTheme.colors.disabled,
  },
  primaryButtonPressed: {
    backgroundColor: AppTheme.colors.primaryPressed,
    transform: [{ scale: 0.99 }],
  },
  primaryButtonText: {
    color: AppTheme.colors.white,
    textAlign: 'center',
    fontWeight: '700',
  },
  linkText: {
    marginTop: AppTheme.spacing.lg,
    textAlign: 'center',
    color: AppTheme.colors.primary,
    fontWeight: '700',
  },
});
