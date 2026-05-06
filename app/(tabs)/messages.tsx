import { router } from 'expo-router';
import { useEffect } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';

import { ScreenState } from '../../src/components/ScreenState';
import { useBookings } from '../../src/context/BookingContext';
import { useChat } from '../../src/context/ChatContext';

export default function MessagesScreen() {
  // Bookings determine which tutors the user can message
  const { bookings } = useBookings();

  // ChatContext provides messages grouped by tutor and preview helpers
  const {
    messagesByConversation,
    getLastMessage,
    loadAllMessages,
  } = useChat();

  // Load all saved messages when Messages tab opens
  // This keeps previews visible after refresh
  useEffect(() => {
    loadAllMessages();
  }, []);

  // Only show one conversation per tutor
  const uniqueBookings = bookings.filter(
    (booking, index, self) =>
      index === self.findIndex((item) => item.tutorId === booking.tutorId),
  );

  return (
    <View style={{ flex: 1, padding: 20 }}>
      {/* Page title */}
      <Text style={{ fontSize: 28, fontWeight: '700', marginBottom: 16 }}>
        Messages
      </Text>

      {/* Empty state */}
      {uniqueBookings.length === 0 ? (
        <ScreenState message="No conversations yet. Book a tutor to start chatting." />
      ) : (
        <FlatList
          data={uniqueBookings}
          extraData={messagesByConversation}
          keyExtractor={(item) => item.tutorId}
          renderItem={({ item }) => {
            // Get latest message for this tutor
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
                {/* Tutor name */}
                <Text style={{ fontSize: 18, fontWeight: '600' }}>
                  {item.tutorName}
                </Text>

                {/* Latest message preview */}
                <Text style={{ marginTop: 4 }}>
                  {lastMessage?.text ?? `Start chatting about ${item.subject}`}
                </Text>

                {/* Latest message time */}
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