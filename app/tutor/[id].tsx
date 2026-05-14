import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { AppTheme, layout } from '@/constants/theme';

import { AppBottomTabs } from '../../src/components/AppBottomTabs';
import { ScreenState } from '../../src/components/ScreenState';
import { getTutorById } from '../../src/services/tutors';
import { Tutor } from '../../src/types/tutor';

export default function TutorProfileScreen() {
  const { id } = useLocalSearchParams();
  const tutorId = Array.isArray(id) ? id[0] : id;
  const [tutor, setTutor] = useState<Tutor | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    loadTutor();
  }, [tutorId]);

  async function loadTutor() {
    if (!tutorId) return;

    try {
      setErrorMessage('');
      setLoading(true);

      const data = await getTutorById(tutorId);

      setTutor(data);
    } catch (error) {
      console.log('LOAD TUTOR ERROR:', error);
      setErrorMessage('Could not load tutor profile. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.stateWrap}>
          <ScreenState message="Loading tutor..." />
        </View>
        <AppBottomTabs />
      </SafeAreaView>
    );
  }

  if (errorMessage) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.stateWrap}>
          <ScreenState
            title="Tutor Profile"
            message={errorMessage}
            buttonText="Retry"
            onPress={loadTutor}
          />
        </View>
        <AppBottomTabs />
      </SafeAreaView>
    );
  }

  if (!tutor) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.stateWrap}>
          <ScreenState message="Tutor not found." />
        </View>
        <AppBottomTabs />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Image
            source={{
              uri:
                tutor.avatar_url ??
                `https://api.dicebear.com/7.x/initials/png?seed=${encodeURIComponent(
                  tutor.name,
                )}`,
            }}
            style={styles.avatar}
          />

          <Text style={styles.name}>{tutor.name}</Text>
          <Text style={styles.subject}>{tutor.subject}</Text>

          <View style={styles.metaGrid}>
            <View style={styles.metaItem}>
              <Text style={styles.metaValue}>${tutor.price}</Text>
              <Text style={styles.metaLabel}>per hour</Text>
            </View>

            <View style={styles.metaItem}>
              <Text style={styles.metaValue}>{tutor.rating}</Text>
              <Text style={styles.metaLabel}>rating</Text>
            </View>
          </View>

          <View style={styles.bioBlock}>
            <Text style={styles.sectionLabel}>About</Text>
            <Text style={styles.bioText}>{tutor.bio ?? 'No bio available.'}</Text>
          </View>

          <Pressable
            onPress={() => router.push(`/booking/${tutor.id}` as any)}
            style={({ pressed }) => [
              styles.primaryButton,
              pressed ? styles.primaryButtonPressed : null,
            ]}
          >
            <Text style={styles.primaryButtonText}>Book Session</Text>
          </Pressable>
        </View>
      </ScrollView>
      <AppBottomTabs />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: AppTheme.colors.background,
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
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: AppTheme.colors.surfaceMuted,
    marginBottom: AppTheme.spacing.lg,
  },
  name: {
    fontSize: AppTheme.typography.screenTitle,
    fontWeight: '800',
    color: AppTheme.colors.text,
  },
  subject: {
    marginTop: AppTheme.spacing.xs,
    fontSize: AppTheme.typography.body,
    color: AppTheme.colors.muted,
  },
  metaGrid: {
    flexDirection: 'row',
    gap: AppTheme.spacing.md,
    marginTop: AppTheme.spacing.xxl,
  },
  metaItem: {
    flex: 1,
    padding: AppTheme.spacing.lg,
    borderRadius: AppTheme.radius.lg,
    backgroundColor: AppTheme.colors.surfaceWarm,
    borderWidth: 1,
    borderColor: '#fed7aa',
  },
  metaValue: {
    fontSize: 22,
    fontWeight: '800',
    color: AppTheme.colors.text,
  },
  metaLabel: {
    marginTop: AppTheme.spacing.xs,
    color: AppTheme.colors.amber,
    fontWeight: '700',
  },
  bioBlock: {
    marginTop: AppTheme.spacing.xxl,
  },
  sectionLabel: {
    color: AppTheme.colors.text,
    fontWeight: '800',
    marginBottom: AppTheme.spacing.sm,
  },
  bioText: {
    color: AppTheme.colors.muted,
    lineHeight: 22,
  },
  primaryButton: {
    marginTop: AppTheme.spacing.xxl,
    backgroundColor: AppTheme.colors.primary,
    minHeight: 48,
    justifyContent: 'center',
    borderRadius: AppTheme.radius.md,
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
