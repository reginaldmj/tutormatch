import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useBookings } from '../../src/context/BookingContext';
import { mockTutors } from '../../src/data/mockTutors';

const times = ['9:00 AM', '11:00 AM', '2:00 PM', '4:00 PM'];

export default function BookingScreen() {
  const { tutorId } = useLocalSearchParams();
  const id = Array.isArray(tutorId) ? tutorId[0] : tutorId;

  const { addBooking } = useBookings();

  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const tutor = mockTutors.find((tutor) => tutor.id === id);

  async function handleConfirmBooking() {
    if (!tutor || !selectedTime) return;

    await addBooking({
      tutorId: tutor.id,
      tutorName: tutor.name,
      subject: tutor.subject,
      time: selectedTime,
      status: 'confirmed',
    });

    setConfirmed(true);
  }

  if (!tutor) {
    return (
      <View style={{ flex: 1, padding: 20 }}>
        <Text>Tutor not found.</Text>
      </View>
    );
  }

  if (confirmed) {
    return (
      <View style={{ flex: 1, padding: 20 }}>
        <Text style={{ fontSize: 28, fontWeight: '700' }}>
          Booking Confirmed
        </Text>

        <Text style={{ marginTop: 16 }}>
          You booked {tutor.name} at {selectedTime}.
        </Text>

        <Pressable
          onPress={() => router.push('/(tabs)/bookings' as any)}
          style={{
            marginTop: 24,
            backgroundColor: 'black',
            padding: 14,
            borderRadius: 10,
          }}
        >
          <Text style={{ color: 'white', textAlign: 'center', fontWeight: '600' }}>
            View My Bookings
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 28, fontWeight: '700' }}>Book Session</Text>

      <Text style={{ marginTop: 12, fontSize: 18 }}>{tutor.name}</Text>

      <Text style={{ marginTop: 4 }}>{tutor.subject}</Text>

      <Text style={{ marginTop: 20, fontWeight: '600' }}>
        Choose a time
      </Text>

      {times.map((time) => (
        <Pressable
          key={time}
          onPress={() => setSelectedTime(time)}
          style={{
            padding: 14,
            borderWidth: 1,
            borderColor: selectedTime === time ? 'black' : '#ddd',
            borderRadius: 10,
            marginTop: 10,
          }}
        >
          <Text>{time}</Text>
        </Pressable>
      ))}

      <Pressable
        disabled={!selectedTime}
        onPress={handleConfirmBooking}
        style={{
          marginTop: 24,
          backgroundColor: selectedTime ? 'black' : '#ccc',
          padding: 14,
          borderRadius: 10,
        }}
      >
        <Text style={{ color: 'white', textAlign: 'center', fontWeight: '600' }}>
          Confirm Booking
        </Text>
      </Pressable>
    </View>
  );
}