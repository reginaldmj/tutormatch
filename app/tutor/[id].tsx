import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { getTutorById } from '../../src/services/tutors';

export default function TutorProfileScreen() {
  const { id } = useLocalSearchParams();
  const tutorId = Array.isArray(id) ? id[0] : id;

  const [tutor, setTutor] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTutor() {
      if (!tutorId) return;

      try {
        const data = await getTutorById(tutorId);
        setTutor(data);
      } catch (error) {
        console.log('LOAD TUTOR ERROR:', error);
      } finally {
        setLoading(false);
      }
    }

    loadTutor();
  }, [tutorId]);

  if (loading) {
    return (
      <View style={{ flex: 1, padding: 20 }}>
        <Text>Loading tutor...</Text>
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

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 28, fontWeight: '700' }}>
        {tutor.name}
      </Text>

      <Text style={{ marginTop: 8, fontSize: 18 }}>
        {tutor.subject}
      </Text>

      <Text style={{ marginTop: 8 }}>
        ${tutor.price}/hour
      </Text>

      <Text style={{ marginTop: 8 }}>
        ⭐ {tutor.rating}
      </Text>

      <Text style={{ marginTop: 16 }}>
        {tutor.bio}
      </Text>

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