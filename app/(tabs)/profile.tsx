import { Text, View } from 'react-native';
import { useBookings } from '../../src/context/BookingContext';

export default function ProfileScreen() {
  const { bookings } = useBookings();

  const uniqueTutors = bookings.filter(
    (booking, index, self) =>
      index === self.findIndex((item) => item.tutorId === booking.tutorId),
  );

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 28, fontWeight: '700', marginBottom: 16 }}>
        Profile
      </Text>

      <View
        style={{
          padding: 16,
          borderWidth: 1,
          borderColor: '#ddd',
          borderRadius: 12,
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: '600' }}>RJ Student</Text>
        <Text style={{ marginTop: 6 }}>Role: Student</Text>
        <Text style={{ marginTop: 6 }}>
          Sessions booked: {bookings.length}
        </Text>
        <Text style={{ marginTop: 6 }}>
          Conversations: {uniqueTutors.length}
        </Text>
      </View>
    </View>
  );
}