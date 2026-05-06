import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useBookings } from '../../src/context/BookingContext';
import { getTutorById } from '../../src/services/tutors';
import { Tutor } from '../../src/types/tutor';

const times = ['9:00 AM', '11:00 AM', '2:00 PM', '4:00 PM'];

export default function BookingScreen() {
  // Read tutorId from the dynamic route: /booking/[tutorId]
  const { tutorId } = useLocalSearchParams();
  const id = Array.isArray(tutorId) ? tutorId[0] : tutorId;

  // Supabase booking action from BookingContext
  const { addBooking } = useBookings();

  // Tutor data loaded from Supabase
  const [tutor, setTutor] = useState<Tutor | null>(null);

  // Screen loading state while tutor is being fetched
  const [loading, setLoading] = useState(true);

  // Selected appointment time
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // Shows confirmation UI after booking is saved
  const [confirmed, setConfirmed] = useState(false);

  // Prevents double-submitting the booking
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadTutor() {
      if (!id) return;

      try {
        const data = await getTutorById(id);
        setTutor(data);
      } catch (error) {
        console.log('LOAD BOOKING TUTOR ERROR:', error);
      } finally {
        setLoading(false);
      }
    }

    loadTutor();
  }, [id]);

  async function handleConfirmBooking() {
    // Guard against missing data or double taps
    if (!tutor || !selectedTime || submitting) return;

    setSubmitting(true);

    try {
      await addBooking({
        tutorId: tutor.id,
        tutorName: tutor.name,
        subject: tutor.subject,
        time: selectedTime,
        status: 'confirmed',
      });

      setConfirmed(true);
    } catch (error) {
      console.log('CONFIRM BOOKING ERROR:', error);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <View style={{ flex: 1, padding: 20 }}>
        <Text>Loading booking...</Text>
      </View>
    );
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

  const confirmDisabled = !selectedTime || submitting;

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 28, fontWeight: '700' }}>Book Session</Text>

      <Text style={{ marginTop: 12, fontSize: 18 }}>{tutor.name}</Text>

      <Text style={{ marginTop: 4 }}>{tutor.subject}</Text>

      <Text style={{ marginTop: 20, fontWeight: '600' }}>Choose a time</Text>

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
        disabled={confirmDisabled}
        onPress={handleConfirmBooking}
        style={{
          marginTop: 24,
          backgroundColor: confirmDisabled ? '#ccc' : 'black',
          padding: 14,
          borderRadius: 10,
        }}
      >
        <Text style={{ color: 'white', textAlign: 'center', fontWeight: '600' }}>
          {submitting ? 'Booking...' : 'Confirm Booking'}
        </Text>
      </Pressable>
    </View>
  );
}