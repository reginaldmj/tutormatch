import { Text, View, Pressable } from 'react-native';

type TutorCardProps = {
  name: string;
  subject: string;
  price: number;
  rating: number;
  onPress?: () => void;
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
      }}
    >
      <Text style={{ fontSize: 18, fontWeight: '600' }}>{name}</Text>
      <Text>{subject}</Text>
      <Text>${price}/hr</Text>
      <Text>⭐ {rating}</Text>
    </Pressable>
  );
}