import { router } from 'expo-router';
import { FlatList, Pressable, Text, View } from 'react-native';
import { useBookings } from '../../src/context/BookingContext';
import { useChat } from '../../src/context/ChatContext';

export default function MessagesScreen() {
  const { bookings } = useBookings();
  const { messagesByConversation, getLastMessage } = useChat();

  const uniqueBookings = bookings.filter(
    (booking, index, self) =>
      index === self.findIndex((item) => item.tutorId === booking.tutorId),
  );

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 28, fontWeight: '700', marginBottom: 16 }}>
        Messages
      </Text>

      {uniqueBookings.length === 0 ? (
        <Text>No conversations yet. Book a tutor to start chatting.</Text>
      ) : (
        <FlatList
          data={uniqueBookings}
          extraData={messagesByConversation}
          keyExtractor={(item) => item.tutorId}
          renderItem={({ item }) => {
            const lastMessage = getLastMessage(item.tutorId);

            return (
              <Pressable
                onPress={() => router.push(`/chat/${item.tutorId}` as any)}
                style={{
                  padding: 16,
                  borderWidth: 1,
                  borderColor: '#ddd',
                  borderRadius: 12,
                  marginBottom: 12,
                }}
              >
                <Text style={{ fontSize: 18, fontWeight: '600' }}>
                  {item.tutorName}
                </Text>

                <Text style={{ marginTop: 4 }}>
                  {lastMessage?.text ?? `Start chatting about ${item.subject}`}
                </Text>

                <Text style={{ marginTop: 6, color: '#666' }}>
                  {lastMessage?.time ?? 'New conversation'}
                </Text>
              </Pressable>
            );
          }}
        />
      )}
    </View>
  );
}