import { router, useLocalSearchParams } from 'expo-router';

import { useCallback, useEffect, useState } from 'react';

import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { AppTheme, layout } from '@/constants/theme';

import { AppBottomTabs } from '../../src/components/AppBottomTabs';
import { Banner } from '../../src/components/Banner';
import { ScreenState } from '../../src/components/ScreenState';
import { useBookings } from '../../src/context/BookingContext';
import {
  getTutorAvailability,
  reserveAvailabilitySlot,
} from '../../src/services/availability';
import { getTutorById } from '../../src/services/tutors';
import { TutorAvailability } from '../../src/types/availability';
import { Tutor } from '../../src/types/tutor';

export default function BookingScreen() {
  const { tutorId } = useLocalSearchParams();
  const id = Array.isArray(tutorId) ? tutorId[0] : tutorId;
  const { addBooking } = useBookings();
  const [tutor, setTutor] = useState<Tutor | null>(null);
  const [availability, setAvailability] = useState<TutorAvailability[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<TutorAvailability | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const loadBookingData = useCallback(async () => {
    if (!id) return;

    try {
      setErrorMessage('');
      setLoading(true);

      const tutorData = await getTutorById(id);
      const availabilityData = await getTutorAvailability(id);

      setTutor(tutorData);
      setAvailability(availabilityData);
    } catch (error) {
      console.log('LOAD BOOKING DATA ERROR:', error);
      setErrorMessage('Could not load booking details. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadBookingData();
  }, [loadBookingData]);

  async function handleConfirmBooking() {
    if (!tutor || !selectedSlot || submitting) {
      return;
    }

    setSubmitting(true);
    setErrorMessage('');

    try {
      await addBooking({
        tutorId: tutor.id,
        tutorName: tutor.name,
        subject: tutor.subject,
        time: `${selectedSlot.date} at ${selectedSlot.time}`,
        sessionDate: selectedSlot.date,
        sessionTime: selectedSlot.time,
        status: 'confirmed',
        availabilitySlotId: selectedSlot.id,
      });

      await reserveAvailabilitySlot(selectedSlot.id);

      setConfirmed(true);
    } catch (error) {
      console.log('CONFIRM BOOKING ERROR:', error);
      setErrorMessage(
        'This time may already be booked. Please choose another slot.',
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.stateWrap}>
          <ScreenState message="Loading booking..." />
        </View>
        <AppBottomTabs />
      </SafeAreaView>
    );
  }

  if (errorMessage && !tutor) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.stateWrap}>
          <ScreenState
            title="Book Session"
            message={errorMessage}
            buttonText="Retry"
            onPress={loadBookingData}
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

  if (confirmed) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.card}>
            <Banner type="success" message="Booking confirmed!" />

            <Text style={styles.title}>Booking Confirmed</Text>

            <Text style={styles.bodyText}>
              You booked {tutor.name} for {selectedSlot?.date} at{' '}
              {selectedSlot?.time}.
            </Text>

            <Pressable
              onPress={() => router.push('/(tabs)/bookings' as any)}
              style={({ pressed }) => [
                styles.primaryButton,
                pressed ? styles.primaryButtonPressed : null,
              ]}
            >
              <Text style={styles.primaryButtonText}>View My Bookings</Text>
            </Pressable>
          </View>
        </ScrollView>
        <AppBottomTabs />
      </SafeAreaView>
    );
  }

  const confirmDisabled = !selectedSlot || submitting;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          {errorMessage ? <Banner type="error" message={errorMessage} /> : null}

          <Text style={styles.title}>Book Session</Text>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryName}>{tutor.name}</Text>
            <Text style={styles.summarySubject}>{tutor.subject}</Text>
          </View>

          <Text style={styles.sectionLabel}>Choose an available time</Text>

          {availability.length === 0 ? (
            <Text style={styles.emptyText}>No available times for this tutor.</Text>
          ) : (
            <View style={styles.slotList}>
              {availability.map((slot) => {
                const selected = selectedSlot?.id === slot.id;

                return (
                  <Pressable
                    key={slot.id}
                    onPress={() => setSelectedSlot(slot)}
                    style={({ pressed }) => [
                      styles.slotCard,
                      selected ? styles.slotCardSelected : null,
                      pressed ? styles.slotCardPressed : null,
                    ]}
                  >
                    <Text style={styles.slotDate}>{slot.date}</Text>
                    <Text style={styles.slotTime}>{slot.time}</Text>
                  </Pressable>
                );
              })}
            </View>
          )}

          <Pressable
            disabled={confirmDisabled}
            onPress={handleConfirmBooking}
            style={({ pressed }) => [
              styles.primaryButton,
              confirmDisabled ? styles.primaryButtonDisabled : null,
              pressed && !confirmDisabled ? styles.primaryButtonPressed : null,
            ]}
          >
            <Text style={styles.primaryButtonText}>
              {submitting ? 'Booking...' : 'Confirm Booking'}
            </Text>
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
  title: {
    fontSize: AppTheme.typography.screenTitle,
    fontWeight: '800',
    color: AppTheme.colors.text,
  },
  bodyText: {
    marginTop: AppTheme.spacing.lg,
    color: AppTheme.colors.muted,
    lineHeight: 22,
  },
  summaryCard: {
    marginTop: AppTheme.spacing.xl,
    padding: AppTheme.spacing.lg,
    borderRadius: AppTheme.radius.lg,
    backgroundColor: AppTheme.colors.tealSoft,
    borderWidth: 1,
    borderColor: '#b9e4df',
  },
  summaryName: {
    color: AppTheme.colors.text,
    fontSize: AppTheme.typography.cardTitle,
    fontWeight: '800',
  },
  summarySubject: {
    marginTop: AppTheme.spacing.xs,
    color: AppTheme.colors.teal,
    fontWeight: '700',
  },
  sectionLabel: {
    marginTop: AppTheme.spacing.xxl,
    marginBottom: AppTheme.spacing.sm,
    color: AppTheme.colors.text,
    fontWeight: '800',
  },
  emptyText: {
    marginTop: AppTheme.spacing.sm,
    color: AppTheme.colors.muted,
  },
  slotList: {
    gap: AppTheme.spacing.sm,
  },
  slotCard: {
    padding: AppTheme.spacing.lg,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    borderRadius: AppTheme.radius.lg,
    backgroundColor: AppTheme.colors.surface,
  },
  slotCardSelected: {
    borderColor: AppTheme.colors.primary,
    backgroundColor: AppTheme.colors.primarySoft,
  },
  slotCardPressed: {
    transform: [{ scale: 0.99 }],
  },
  slotDate: {
    color: AppTheme.colors.text,
    fontWeight: '800',
  },
  slotTime: {
    marginTop: AppTheme.spacing.xs,
    color: AppTheme.colors.muted,
  },
  primaryButton: {
    marginTop: AppTheme.spacing.xxl,
    backgroundColor: AppTheme.colors.primary,
    minHeight: 48,
    justifyContent: 'center',
    borderRadius: AppTheme.radius.md,
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
