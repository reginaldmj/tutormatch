import { FlatList, Pressable, RefreshControl, Text, View } from 'react-native';
import { useBookings } from '../../src/context/BookingContext';

export default function BookingsScreen() {
  // Pull bookings, loading state, refresh function, and cancel action from context
  const { bookings, loading, loadBookings, cancelBooking } = useBookings();

  // Show loading state while bookings are being fetched from Supabase
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
      <Text style={{ fontSize: 28, fontWeight: '700', marginBottom: 16 }}>
        My Bookings
      </Text>

      {/* Empty state */}
      {bookings.length === 0 ? (
        <Text>No bookings yet.</Text>
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={loadBookings}
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
              <Text style={{ fontSize: 18, fontWeight: '600' }}>
                {item.tutorName}
              </Text>

              {/* Booking details */}
              <Text style={{ marginTop: 4 }}>{item.subject}</Text>
              <Text style={{ marginTop: 4 }}>{item.time}</Text>
              <Text style={{ marginTop: 4 }}>Status: {item.status}</Text>

              {/* Only show cancel button for active bookings */}
              {item.status !== 'cancelled' && (
                <Pressable
                  onPress={() => cancelBooking(item.id)}
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