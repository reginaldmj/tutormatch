import { useLocalSearchParams, router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { mockTutors } from '../../src/data/mockTutors';

export default function TutorProfileScreen() {
  const { id } = useLocalSearchParams();

  const tutor = mockTutors.find((tutor) => tutor.id === id);

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
        ${tutor.price}/hr
      </Text>

      <Text style={{ marginTop: 8 }}>
        ⭐ {tutor.rating}
      </Text>

      <Text style={{ marginTop: 16, lineHeight: 22 }}>
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