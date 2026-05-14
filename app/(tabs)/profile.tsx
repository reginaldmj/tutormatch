import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { AppTheme, layout } from '@/constants/theme';

import { ScreenState } from '../../src/components/ScreenState';
import { useBookings } from '../../src/context/BookingContext';
import { supabase } from '../../src/lib/supabase';
import { Profile } from '../../src/types/profile';

export default function ProfileScreen() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const { bookings } = useBookings();

  const uniqueTutors = bookings.filter(
    (booking, index, self) =>
      index === self.findIndex((item) => item.tutorId === booking.tutorId),
  );

  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, []),
  );

  async function loadProfile() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      console.log('PROFILE ERROR:', error);
      return;
    }

    if (data) {
      setProfile(data);
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace('/auth/login' as any);
  }

  if (!profile) {
    return <ScreenState message="Loading profile..." />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
          <Text style={styles.title}>Profile</Text>

          <View style={styles.profileCard}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>
                {profile.full_name.charAt(0).toUpperCase()}
              </Text>
            </View>

            <Text style={styles.name}>{profile.full_name}</Text>
            <Text style={styles.role}>
              {profile.role === 'student' ? 'Student' : 'Tutor'}
            </Text>

            <View style={styles.divider} />

            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>{bookings.length}</Text>
                <Text style={styles.statLabel}>Bookings</Text>
              </View>

              <View style={styles.statBox}>
                <Text style={styles.statValue}>{uniqueTutors.length}</Text>
                <Text style={styles.statLabel}>Chats</Text>
              </View>
            </View>
          </View>

          <Pressable
            onPress={() => router.push('/profile/edit' as any)}
            style={({ pressed }) => [
              styles.secondaryButton,
              pressed ? styles.secondaryButtonPressed : null,
            ]}
          >
            <Text style={styles.secondaryButtonText}>Edit Profile</Text>
          </Pressable>

          <Pressable
            onPress={handleLogout}
            style={({ pressed }) => [
              styles.primaryButton,
              pressed ? styles.primaryButtonPressed : null,
            ]}
          >
            <Text style={styles.primaryButtonText}>Log Out</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: AppTheme.colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    padding: layout.screenPadding,
  },
  container: {
    width: '100%',
    maxWidth: layout.maxContentWidth,
  },
  title: {
    fontSize: AppTheme.typography.screenTitle,
    fontWeight: '800',
    color: AppTheme.colors.text,
    marginBottom: AppTheme.spacing.lg,
  },
  profileCard: {
    alignItems: 'center',
    padding: AppTheme.spacing.xxl,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    borderRadius: AppTheme.radius.xl,
    backgroundColor: AppTheme.colors.surface,
    ...AppTheme.shadows.card,
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppTheme.colors.primarySoft,
    marginBottom: AppTheme.spacing.lg,
  },
  avatarText: {
    color: AppTheme.colors.primary,
    fontSize: 28,
    fontWeight: '800',
  },
  name: {
    color: AppTheme.colors.text,
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
  },
  role: {
    marginTop: AppTheme.spacing.xs,
    color: AppTheme.colors.muted,
    fontWeight: '700',
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: AppTheme.colors.border,
    marginVertical: AppTheme.spacing.xxl,
  },
  statsRow: {
    width: '100%',
    flexDirection: 'row',
    gap: AppTheme.spacing.md,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    padding: AppTheme.spacing.lg,
    borderRadius: AppTheme.radius.lg,
    backgroundColor: AppTheme.colors.surfaceMuted,
  },
  statValue: {
    color: AppTheme.colors.text,
    fontSize: 22,
    fontWeight: '800',
  },
  statLabel: {
    marginTop: AppTheme.spacing.xs,
    color: AppTheme.colors.muted,
    fontWeight: '700',
  },
  secondaryButton: {
    marginTop: AppTheme.spacing.xxl,
    minHeight: 48,
    justifyContent: 'center',
    borderRadius: AppTheme.radius.md,
    backgroundColor: AppTheme.colors.primarySoft,
    paddingHorizontal: AppTheme.spacing.lg,
  },
  secondaryButtonPressed: {
    transform: [{ scale: 0.99 }],
  },
  secondaryButtonText: {
    color: AppTheme.colors.primary,
    textAlign: 'center',
    fontWeight: '800',
  },
  primaryButton: {
    marginTop: AppTheme.spacing.md,
    minHeight: 48,
    justifyContent: 'center',
    borderRadius: AppTheme.radius.md,
    backgroundColor: AppTheme.colors.primary,
    paddingHorizontal: AppTheme.spacing.lg,
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
