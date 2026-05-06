import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { ScreenState } from '../../src/components/ScreenState';
import { getTutorById } from '../../src/services/tutors';
import { Tutor } from '../../src/types/tutor';

export default function TutorProfileScreen() {
  // Read tutor id from the dynamic route: /tutor/[id]
  const { id } = useLocalSearchParams();

  // Expo Router params can be string or string[], so normalize it
  const tutorId = Array.isArray(id) ? id[0] : id;

  // Stores the tutor loaded from Supabase
  const [tutor, setTutor] = useState<Tutor | null>(null);

  // Controls loading UI while tutor data is being fetched
  const [loading, setLoading] = useState(true);

  // Stores a user-friendly error message if loading fails
  const [errorMessage, setErrorMessage] = useState('');

  // Load tutor whenever the route id changes
  useEffect(() => {
    loadTutor();
  }, [tutorId]);

  async function loadTutor() {
    if (!tutorId) return;

    try {
      setErrorMessage('');
      setLoading(true);

      // Fetch tutor row from Supabase
      const data = await getTutorById(tutorId);

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

  // Shared error state with retry
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

  // Empty state if no tutor was found
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

      {/* Navigate to booking flow */}
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