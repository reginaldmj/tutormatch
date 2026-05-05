import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { TutorCard } from '../../src/components/TutorCard';
import { getTutors } from '../../src/services/tutors';

export default function HomeScreen() {
  const [tutors, setTutors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTutors() {
      try {
        const data = await getTutors();
        setTutors(data ?? []);
      } catch (error) {
        console.log('LOAD TUTORS ERROR:', error);
      } finally {
        setLoading(false);
      }
    }

    loadTutors();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, padding: 20 }}>
        <Text>Loading tutors...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 28, fontWeight: '700', marginBottom: 16 }}>
        Find a Tutor
      </Text>

      {tutors.length === 0 ? (
        <Text>No tutors found.</Text>
      ) : (
        <FlatList
          data={tutors}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TutorCard
              name={item.name}
              subject={item.subject}
              price={item.price}
              rating={item.rating}
              onPress={() => router.push(`/tutor/${item.id}` as any)}
            />
          )}
        />
      )}
    </View>
  );
}