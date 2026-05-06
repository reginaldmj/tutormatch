import { useState } from 'react';

import {
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  View,
} from 'react-native';

import { ScreenState } from '../../src/components/ScreenState';
import { useBookings } from '../../src/context/BookingContext';

export default function BookingsScreen() {
  // BookingContext provides:
  // - bookings loaded from Supabase
  // - loading state
  // - reload function
  // - cancel booking action
  const { bookings, loading, loadBookings, cancelBooking } = useBookings();

  // User-friendly error shown on this screen only
  const [errorMessage, setErrorMessage] = useState('');

  // Pull-to-refresh reloads bookings from Supabase
  async function handleRefresh() {
    try {
      setErrorMessage('');
      await loadBookings();
    } catch (error) {
      console.log('REFRESH BOOKINGS ERROR:', error);
      setErrorMessage('Could not refresh bookings. Please try again.');
    }
  }

  // Cancels a booking by updating its status in Supabase
  async function handleCancelBooking(bookingId: string) {
    try {
      setErrorMessage('');
      await cancelBooking(bookingId);
    } catch (error) {
      console.log('CANCEL BOOKING ERROR:', error);
      setErrorMessage('Could not cancel booking. Please try again.');
    }
  }

  // Shared loading UI while bookings are being fetched
  if (loading) {
    return <ScreenState message="Loading bookings..." />;
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>
      {/* Page title */}
      <Text style={{ fontSize: 28, fontWeight: '700', marginBottom: 16 }}>
        My Bookings
      </Text>

      {/* Error message */}
      {errorMessage ? (
        <Text style={{ marginBottom: 16, color: 'red' }}>
          {errorMessage}
        </Text>
      ) : null}

      {/* Empty state */}
      {bookings.length === 0 ? (
        <ScreenState message="No bookings yet." />
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={handleRefresh} />
          }
          renderItem={({ item }) => (
            <View
              style={{
                padding: 16,
                borderWidth: 1,
                borderColor: '#ddd',
                borderRadius: 12,
                marginBottom: 12,
              }}
            >
              {/* Tutor name */}
              <Text style={{ fontSize: 18, fontWeight: '600' }}>
                {item.tutorName}
              </Text>

              {/* Booking details */}
              <Text style={{ marginTop: 4 }}>{item.subject}</Text>
              <Text style={{ marginTop: 4 }}>{item.time}</Text>
              <Text style={{ marginTop: 4 }}>Status: {item.status}</Text>

              {/* Cancel button only appears for active bookings */}
              {item.status !== 'cancelled' && (
                <Pressable
                  onPress={() => handleCancelBooking(item.id)}
                  style={{
                    marginTop: 12,
                    backgroundColor: '#eee',
                    padding: 12,
                    borderRadius: 10,
                  }}
                >
                  <Text style={{ textAlign: 'center', fontWeight: '600' }}>
                    Cancel Booking
                  </Text>
                </Pressable>
              )}
            </View>
          )}
        />
      )}
    </View>
  );
}