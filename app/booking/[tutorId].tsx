import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { ScreenState } from '../../src/components/ScreenState';
import { useBookings } from '../../src/context/BookingContext';
import { getTutorById } from '../../src/services/tutors';
import { Tutor } from '../../src/types/tutor';

// Temporary hard-coded time slots.
// Later, these can come from Supabase tutor availability.
const times = ['9:00 AM', '11:00 AM', '2:00 PM', '4:00 PM'];

export default function BookingScreen() {
  // Read tutorId from route: /booking/[tutorId]
  const { tutorId } = useLocalSearchParams();

  // Expo Router params can be string or string[], so normalize it.
  const id = Array.isArray(tutorId) ? tutorId[0] : tutorId;

  // BookingContext saves booking data to Supabase.
  const { addBooking } = useBookings();

  // Tutor loaded from Supabase.
  const [tutor, setTutor] = useState<Tutor | null>(null);

  // Loading state while tutor data is fetched.
  const [loading, setLoading] = useState(true);

  // User-friendly loading error.
  const [errorMessage, setErrorMessage] = useState('');

  // Selected booking time.
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // Shows success screen after booking completes.
  const [confirmed, setConfirmed] = useState(false);

  // Prevents duplicate booking submissions.
  const [submitting, setSubmitting] = useState(false);

  // Load tutor when screen opens.
  useEffect(() => {
    loadTutor();
  }, [id]);

  async function loadTutor() {
    if (!id) return;

    try {
      setErrorMessage('');
      setLoading(true);

      const data = await getTutorById(id);
      setTutor(data);
    } catch (error) {
      console.log('LOAD BOOKING TUTOR ERROR:', error);
      setErrorMessage('Could not load booking details. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleConfirmBooking() {
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
    return <ScreenState message="Loading booking..." />;
  }

  if (errorMessage) {
    return (
      <ScreenState
        title="Book Session"
        message={errorMessage}
        buttonText="Retry"
        onPress={loadTutor}
      />
    );
  }

  if (!tutor) {
    return <ScreenState message="Tutor not found." />;
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
      {/* Page title */}
      <Text style={{ fontSize: 28, fontWeight: '700' }}>Book Session</Text>

      {/* Tutor summary */}
      <Text style={{ marginTop: 12, fontSize: 18 }}>{tutor.name}</Text>
      <Text style={{ marginTop: 4 }}>{tutor.subject}</Text>

      {/* Time selection */}
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

      {/* Confirm button */}
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