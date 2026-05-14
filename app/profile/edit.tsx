import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { AppTheme, layout } from '@/constants/theme';

import { AppBottomTabs } from '../../src/components/AppBottomTabs';
import { ScreenState } from '../../src/components/ScreenState';
import { supabase } from '../../src/lib/supabase';
import { Profile } from '../../src/types/profile';

export default function EditProfileScreen() {
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<Profile['role']>('student');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      console.log('EDIT PROFILE ERROR:', error);
      setLoading(false);
      return;
    }

    if (data) {
      setFullName(data.full_name ?? '');
      setRole(data.role ?? 'student');
    }

    setLoading(false);
  }

  async function handleSave() {
    if (!fullName.trim()) {
      Alert.alert('Missing name', 'Please enter your full name.');
      return;
    }

    setSaving(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setSaving(false);
      return;
    }

    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: fullName.trim(),
        role,
      })
      .eq('id', user.id);

    setSaving(false);

    if (error) {
      Alert.alert('Update failed', error.message);
      return;
    }

    Alert.alert('Profile updated', 'Your profile was saved.');
    router.back();
  }

  const saveDisabled = saving || !fullName.trim();

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.stateWrap}>
          <ScreenState message="Loading profile..." />
        </View>
        <AppBottomTabs />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.card}>
            <Text style={styles.title}>Edit Profile</Text>

            <Text style={styles.label}>Full Name</Text>
            <TextInput
              value={fullName}
              onChangeText={setFullName}
              placeholder="Full name"
              placeholderTextColor={AppTheme.colors.subtle}
              editable={!saving}
              style={styles.input}
            />

            <Text style={styles.label}>Role</Text>

            <View style={styles.chipRow}>
              {(['student', 'tutor'] as Profile['role'][]).map((option) => {
                const selected = role === option;

                return (
                  <Pressable
                    key={option}
                    disabled={saving}
                    onPress={() => setRole(option)}
                    style={({ pressed }) => [
                      styles.chip,
                      selected ? styles.chipSelected : null,
                      pressed && !saving ? styles.chipPressed : null,
                    ]}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        selected ? styles.chipTextSelected : null,
                      ]}
                    >
                      {option === 'student' ? 'Student' : 'Tutor'}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Pressable
              disabled={saveDisabled}
              onPress={handleSave}
              style={({ pressed }) => [
                styles.primaryButton,
                saveDisabled ? styles.primaryButtonDisabled : null,
                pressed && !saveDisabled ? styles.primaryButtonPressed : null,
              ]}
            >
              <Text style={styles.primaryButtonText}>
                {saving ? 'Saving...' : 'Save Profile'}
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <AppBottomTabs />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: AppTheme.colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  stateWrap: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    padding: layout.screenPadding,
  },
  card: {
    width: '100%',
    maxWidth: layout.maxContentWidth,
    padding: AppTheme.spacing.xxl,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    borderRadius: AppTheme.radius.xl,
    backgroundColor: AppTheme.colors.surface,
    ...AppTheme.shadows.card,
  },
  title: {
    fontSize: AppTheme.typography.screenTitle,
    fontWeight: '800',
    color: AppTheme.colors.text,
    marginBottom: AppTheme.spacing.xxl,
  },
  label: {
    color: AppTheme.colors.text,
    fontWeight: '800',
    marginBottom: AppTheme.spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    backgroundColor: AppTheme.colors.surface,
    minHeight: 48,
    borderRadius: AppTheme.radius.md,
    paddingHorizontal: AppTheme.spacing.md,
    marginBottom: AppTheme.spacing.lg,
    color: AppTheme.colors.text,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: AppTheme.spacing.sm,
    marginBottom: AppTheme.spacing.xxl,
  },
  chip: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: AppTheme.radius.pill,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    backgroundColor: AppTheme.colors.surface,
  },
  chipSelected: {
    borderColor: AppTheme.colors.primary,
    backgroundColor: AppTheme.colors.primary,
  },
  chipPressed: {
    transform: [{ scale: 0.98 }],
  },
  chipText: {
    color: AppTheme.colors.text,
    fontWeight: '800',
  },
  chipTextSelected: {
    color: AppTheme.colors.white,
  },
  primaryButton: {
    minHeight: 48,
    justifyContent: 'center',
    borderRadius: AppTheme.radius.md,
    backgroundColor: AppTheme.colors.primary,
    paddingHorizontal: AppTheme.spacing.lg,
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
    fontWeight: '800',
  },
});
