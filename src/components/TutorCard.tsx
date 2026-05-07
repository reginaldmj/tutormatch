import { Image, Pressable, Text, View } from 'react-native';

type TutorCardProps = {
  name: string;
  subject: string;
  price: number;
  rating: number;

  // Optional tutor avatar URL.
  avatarUrl?: string | null;

  onPress: () => void;
};

export function TutorCard({
  name,
  subject,
  price,
  rating,
  avatarUrl,
  onPress,
}: TutorCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        flexDirection: 'row',
        gap: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 12,
        marginBottom: 12,
        backgroundColor: 'white',
      }}
    >
      {/* Avatar image */}
      <Image
        source={{
          uri:
            avatarUrl ??
            `https://api.dicebear.com/7.x/initials/png?seed=${encodeURIComponent(
              name,
            )}`,
        }}
        style={{
          width: 56,
          height: 56,
          borderRadius: 28,
          backgroundColor: '#eee',
        }}
      />

      {/* Tutor info */}
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 18, fontWeight: '700' }}>{name}</Text>

        <Text style={{ marginTop: 4, color: '#444' }}>{subject}</Text>

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
      </View>
    </Pressable>
  );
}