import { useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';

export default function TutorProfileScreen() {
  const { id } = useLocalSearchParams();

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 28, fontWeight: '700' }}>
        Tutor Profile
      </Text>

      <Text style={{ marginTop: 12 }}>
        Tutor ID: {id}
      </Text>
    </View>
  );
}