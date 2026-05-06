import { router } from 'expo-router';
import { useEffect } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';

import { ScreenState } from '../../src/components/ScreenState';
import { useBookings } from '../../src/context/BookingContext';
import { useChat } from '../../src/context/ChatContext';

export default function MessagesScreen() {
  // Bookings determine which tutors the user can message.
  // A conversation only appears after the user books a tutor.
  const { bookings } = useBookings();

  // ChatContext provides:
  // - messages grouped by tutorId
  // - preview helper
  // - function to load saved messages from Supabase
  const { messagesByConversation, getLastMessage, loadAllMessages } = useChat();

  // Load all saved messages when this tab opens.
  // This keeps message previews visible after refreshing the app.
  useEffect(() => {
    loadAllMessages();
  }, []);

  // If a user books the same tutor multiple times,
  // only show one message card for that tutor.
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
            // Find the latest message for this tutor.
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

                {/* Latest message timestamp */}
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