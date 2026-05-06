import { useState } from 'react';
import {
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  View,
} from 'react-native';

import { useBookings } from '../../src/context/BookingContext';

export default function BookingsScreen() {
  // Pull booking data and booking actions from BookingContext
  const {
    bookings,
    loading,
    loadBookings,
    cancelBooking,
  } = useBookings();

  // Stores user-friendly error messages for this screen
  const [errorMessage, setErrorMessage] = useState('');

  // Reload bookings from Supabase
  async function handleRefresh() {
    try {
      setErrorMessage('');

      await loadBookings();
    } catch (error) {
      console.log('REFRESH BOOKINGS ERROR:', error);

      setErrorMessage(
        'Could not refresh bookings. Please try again.',
      );
    }
  }

  // Cancel one booking in Supabase
  async function handleCancelBooking(bookingId: string) {
    try {
      setErrorMessage('');

      await cancelBooking(bookingId);
    } catch (error) {
      console.log('CANCEL BOOKING ERROR:', error);

      setErrorMessage(
        'Could not cancel booking. Please try again.',
      );
    }
  }

  // Initial loading state while bookings are fetched
  if (loading) {
    return (
      <View style={{ flex: 1, padding: 20 }}>
        <Text>Loading bookings...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>
      {/* Page title */}
      <Text
        style={{
          fontSize: 28,
          fontWeight: '700',
          marginBottom: 16,
        }}
      >
        My Bookings
      </Text>

      {/* Error message */}
      {errorMessage ? (
        <Text
          style={{
            marginBottom: 16,
            color: 'red',
          }}
        >
          {errorMessage}
        </Text>
      ) : null}

      {/* Empty state */}
      {bookings.length === 0 ? (
        <Text>No bookings yet.</Text>
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item) => item.id}

          // Pull-to-refresh reloads bookings from Supabase
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={handleRefresh}
            />
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
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '600',
                }}
              >
                {item.tutorName}
              </Text>

              {/* Booking details */}
              <Text style={{ marginTop: 4 }}>
                {item.subject}
              </Text>

              <Text style={{ marginTop: 4 }}>
                {item.time}
              </Text>

              <Text style={{ marginTop: 4 }}>
                Status: {item.status}
              </Text>

              {/* Hide cancel button once booking is cancelled */}
              {item.status !== 'cancelled' && (
                <Pressable
                  onPress={() =>
                    handleCancelBooking(item.id)
                  }
                  style={{
                    marginTop: 12,
                    backgroundColor: '#eee',
                    padding: 12,
                    borderRadius: 10,
                  }}
                >
                  <Text
                    style={{
                      textAlign: 'center',
                      fontWeight: '600',
                    }}
                  >
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