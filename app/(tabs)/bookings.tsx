import { useState } from 'react';

import {
  FlatList,
  Pressable,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { AppTheme, layout } from '@/constants/theme';

import { Banner } from '../../src/components/Banner';
import { ScreenState } from '../../src/components/ScreenState';
import { useBookings } from '../../src/context/BookingContext';
import { Booking } from '../../src/types/booking';

const statusTones: Record<
  Booking['status'],
  { backgroundColor: string; color: string }
> = {
  confirmed: {
    backgroundColor: AppTheme.colors.successSoft,
    color: AppTheme.colors.success,
  },
  cancelled: {
    backgroundColor: AppTheme.colors.dangerSoft,
    color: AppTheme.colors.danger,
  },
  completed: {
    backgroundColor: AppTheme.colors.primarySoft,
    color: AppTheme.colors.primary,
  },
};

export default function BookingsScreen() {
  const { bookings, loading, loadBookings, cancelBooking } = useBookings();
  const [errorMessage, setErrorMessage] = useState('');

  async function handleRefresh() {
    try {
      setErrorMessage('');
      await loadBookings();
    } catch (error) {
      console.log('REFRESH BOOKINGS ERROR:', error);
      setErrorMessage('Could not refresh bookings. Please try again.');
    }
  }

  async function handleCancelBooking(bookingId: string) {
    try {
      setErrorMessage('');
      await cancelBooking(bookingId);
    } catch (error) {
      console.log('CANCEL BOOKING ERROR:', error);
      setErrorMessage('Could not cancel booking. Please try again.');
    }
  }

  if (loading) {
    return <ScreenState message="Loading bookings..." />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>My Bookings</Text>

        {errorMessage ? <Banner type="error" message={errorMessage} /> : null}

        {bookings.length === 0 ? (
          <ScreenState message="No bookings yet." />
        ) : (
          <FlatList
            data={bookings}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl refreshing={loading} onRefresh={handleRefresh} />
            }
            renderItem={({ item }) => {
              const tone = statusTones[item.status];

              return (
                <View style={styles.bookingCard}>
                  <View style={styles.cardHeader}>
                    <View style={styles.cardHeaderText}>
                      <Text numberOfLines={1} style={styles.tutorName}>
                        {item.tutorName}
                      </Text>
                      <Text numberOfLines={1} style={styles.subject}>
                        {item.subject}
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.statusBadge,
                        { backgroundColor: tone.backgroundColor },
                      ]}
                    >
                      <Text style={[styles.statusText, { color: tone.color }]}>
                        {item.status}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.timeText}>{item.time}</Text>

                  {item.status !== 'cancelled' ? (
                    <Pressable
                      onPress={() => handleCancelBooking(item.id)}
                      style={({ pressed }) => [
                        styles.cancelButton,
                        pressed ? styles.cancelButtonPressed : null,
                      ]}
                    >
                      <Text style={styles.cancelButtonText}>Cancel Booking</Text>
                    </Pressable>
                  ) : null}
                </View>
              );
            }}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: AppTheme.colors.background,
  },
  container: {
    flex: 1,
    width: '100%',
    maxWidth: layout.maxContentWidth,
    alignSelf: 'center',
    padding: layout.screenPadding,
  },
  title: {
    fontSize: AppTheme.typography.screenTitle,
    fontWeight: '800',
    color: AppTheme.colors.text,
    marginBottom: AppTheme.spacing.lg,
  },
  listContent: {
    paddingBottom: AppTheme.spacing.xxl,
  },
  bookingCard: {
    padding: AppTheme.spacing.lg,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    borderRadius: AppTheme.radius.lg,
    backgroundColor: AppTheme.colors.surface,
    marginBottom: AppTheme.spacing.md,
    ...AppTheme.shadows.soft,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: AppTheme.spacing.md,
  },
  cardHeaderText: {
    flex: 1,
    minWidth: 0,
  },
  tutorName: {
    fontSize: AppTheme.typography.cardTitle,
    fontWeight: '800',
    color: AppTheme.colors.text,
  },
  subject: {
    marginTop: AppTheme.spacing.xs,
    color: AppTheme.colors.muted,
  },
  statusBadge: {
    borderRadius: AppTheme.radius.pill,
    paddingVertical: 6,
    paddingHorizontal: AppTheme.spacing.md,
  },
  statusText: {
    fontSize: AppTheme.typography.caption,
    fontWeight: '800',
    textTransform: 'capitalize',
  },
  timeText: {
    marginTop: AppTheme.spacing.lg,
    color: AppTheme.colors.text,
    fontWeight: '700',
  },
  cancelButton: {
    marginTop: AppTheme.spacing.lg,
    minHeight: 44,
    justifyContent: 'center',
    borderRadius: AppTheme.radius.md,
    backgroundColor: AppTheme.colors.dangerSoft,
    paddingHorizontal: AppTheme.spacing.lg,
  },
  cancelButtonPressed: {
    transform: [{ scale: 0.99 }],
  },
  cancelButtonText: {
    color: AppTheme.colors.danger,
    textAlign: 'center',
    fontWeight: '800',
  },
});
