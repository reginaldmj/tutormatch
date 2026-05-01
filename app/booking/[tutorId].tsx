import { useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';

export default function BookingScreen() {
  const { tutorId } = useLocalSearchParams();

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 28, fontWeight: '700' }}>
        Book Session
      </Text>

      <Text style={{ marginTop: 12 }}>
        Booking tutor ID: {tutorId}
      </Text>
    </View>
  );
}