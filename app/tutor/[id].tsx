import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { ScreenState } from '../../src/components/ScreenState';
import { getTutorById } from '../../src/services/tutors';
import { Tutor } from '../../src/types/tutor';

export default function TutorProfileScreen() {
  // Read the dynamic route parameter from /tutor/[id]
  const { id } = useLocalSearchParams();

  // Expo Router params can be string or string[], so normalize it
  const tutorId = Array.isArray(id) ? id[0] : id;

  // Stores the tutor loaded from Supabase
  const [tutor, setTutor] = useState<Tutor | null>(null);

  // Controls loading UI while fetching tutor data
  const [loading, setLoading] = useState(true);

  // Stores user-friendly error messages
  const [errorMessage, setErrorMessage] = useState('');

  // Load tutor whenever tutorId changes
  useEffect(() => {
    loadTutor();
  }, [tutorId]);

  async function loadTutor() {
    // If there is no id in the URL, stop early
    if (!tutorId) return;

    try {
      // Clear previous errors and show loading state
      setErrorMessage('');
      setLoading(true);

      // Fetch tutor from Supabase
      const data = await getTutorById(tutorId);

      // Save tutor into local state
      setTutor(data);
    } catch (error) {
      console.log('LOAD TUTOR ERROR:', error);
      setErrorMessage('Could not load tutor profile. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  // Shared loading state
  if (loading) {
    return <ScreenState message="Loading tutor..." />;
  }

  // Shared error state with retry action
  if (errorMessage) {
    return (
      <ScreenState
        title="Tutor Profile"
        message={errorMessage}
        buttonText="Retry"
        onPress={loadTutor}
      />
    );
  }

  // Empty state if Supabase returns no tutor
  if (!tutor) {
    return <ScreenState message="Tutor not found." />;
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>
      {/* Tutor name */}
      <Text style={{ fontSize: 28, fontWeight: '700' }}>{tutor.name}</Text>

      {/* Tutor subject */}
      <Text style={{ marginTop: 8, fontSize: 18 }}>{tutor.subject}</Text>

      {/* Tutor price */}
      <Text style={{ marginTop: 8 }}>${tutor.price}/hour</Text>

      {/* Tutor rating */}
      <Text style={{ marginTop: 8 }}>⭐ {tutor.rating}</Text>

      {/* Tutor bio */}
      <Text style={{ marginTop: 16 }}>{tutor.bio}</Text>

      {/* Navigate to booking screen */}
      <Pressable
        onPress={() => router.push(`/booking/${tutor.id}` as any)}
        style={{
          marginTop: 24,
          backgroundColor: 'black',
          padding: 14,
          borderRadius: 10,
        }}
      >
        <Text style={{ color: 'white', textAlign: 'center', fontWeight: '600' }}>
          Book Session
        </Text>
      </Pressable>
    </View>
  );
}