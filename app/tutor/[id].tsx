import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { getTutorById } from '../../src/services/tutors';

export default function TutorProfileScreen() {
  // Read the dynamic route parameter from /tutor/[id]
  const { id } = useLocalSearchParams();

  // Expo Router params can be string or string[], so normalize it
  const tutorId = Array.isArray(id) ? id[0] : id;

  // Stores the tutor loaded from Supabase
  const [tutor, setTutor] = useState<any>(null);

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

  // Loading state
  if (loading) {
    return (
      <View style={{ flex: 1, padding: 20 }}>
        <Text>Loading tutor...</Text>
      </View>
    );
  }

  // Error state with retry button
  if (errorMessage) {
    return (
      <View style={{ flex: 1, padding: 20 }}>
        <Text style={{ fontSize: 28, fontWeight: '700', marginBottom: 16 }}>
          Tutor Profile
        </Text>

        <Text style={{ marginBottom: 16 }}>{errorMessage}</Text>

        <Pressable
          onPress={loadTutor}
          style={{
            backgroundColor: 'black',
            padding: 14,
            borderRadius: 10,
          }}
        >
          <Text style={{ color: 'white', textAlign: 'center', fontWeight: '600' }}>
            Retry
          </Text>
        </Pressable>
      </View>
    );
  }

  // Empty state if Supabase returns no tutor
  if (!tutor) {
    return (
      <View style={{ flex: 1, padding: 20 }}>
        <Text>Tutor not found.</Text>
      </View>
    );
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