import { FlatList, Pressable, Text, View } from 'react-native';
import { useBookings } from '../../src/context/BookingContext';

export default function BookingsScreen() {
  const { bookings, loading, cancelBooking } = useBookings();

  if (loading) {
    return (
      <View style={{ flex: 1, padding: 20 }}>
        <Text>Loading bookings...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 28, fontWeight: '700', marginBottom: 16 }}>
        My Bookings
      </Text>

      {bookings.length === 0 ? (
        <Text>No bookings yet.</Text>
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item) => item.id}
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
              <Text style={{ fontSize: 18, fontWeight: '600' }}>
                {item.tutorName}
              </Text>

              <Text>{item.subject}</Text>
              <Text>{item.time}</Text>
              <Text>Status: {item.status}</Text>

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