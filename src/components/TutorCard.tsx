import { Pressable, Text, View } from 'react-native';

type TutorCardProps = {
  // Tutor display name
  name: string;

  // Tutor subject/specialty
  subject: string;

  // Hourly tutoring price
  price: number;

  // Tutor rating shown to users
  rating: number;

  // Runs when the user taps the card
  onPress: () => void;
};

export function TutorCard({
  name,
  subject,
  price,
  rating,
  onPress,
}: TutorCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        padding: 16,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 12,
        marginBottom: 12,
        backgroundColor: 'white',
      }}
    >
      {/* Tutor name */}
      <Text style={{ fontSize: 18, fontWeight: '700' }}>{name}</Text>

      {/* Tutor subject */}
      <Text style={{ marginTop: 4, color: '#444' }}>{subject}</Text>

      {/* Price and rating row */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 12,
        }}
      >
        <Text>${price}/hour</Text>
        <Text>⭐ {rating}</Text>
      </View>
    </Pressable>
  );
}