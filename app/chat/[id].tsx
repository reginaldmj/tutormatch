import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, Pressable, Text, TextInput, View } from 'react-native';
import { useBookings } from '../../src/context/BookingContext';
import { useChat } from '../../src/context/ChatContext';

export default function ChatScreen() {
  // Read tutor id from route: /chat/[id]
  const { id } = useLocalSearchParams();
  const tutorId = Array.isArray(id) ? id[0] : id;

  // Bookings let us find the tutor name for this chat
  const { bookings } = useBookings();

  // Chat context handles loading and sending Supabase messages
  const { messagesByConversation, loadMessages, addMessage } = useChat();

  // Text currently typed into the input
  const [messageText, setMessageText] = useState('');

  // Prevents double-sending messages
  const [sending, setSending] = useState(false);

  // Find the booking connected to this tutor
  const booking = bookings.find((booking) => booking.tutorId === tutorId);

  // Fallback name if booking is not loaded yet
  const tutorName = booking?.tutorName ?? 'Tutor';

  // Get messages for this specific tutor conversation
  const messages = tutorId ? messagesByConversation[tutorId] ?? [] : [];

  // Load saved messages from Supabase when chat opens
  useEffect(() => {
    if (tutorId) {
      loadMessages(tutorId);
    }
  }, [tutorId]);

  async function sendMessage() {
    // Guard against missing tutor, empty messages, or double taps
    if (!tutorId || !messageText.trim() || sending) return;

    setSending(true);

    try {
      await addMessage(tutorId, tutorName, messageText.trim());
      setMessageText('');
    } catch (error) {
      console.log('SEND MESSAGE ERROR:', error);
    } finally {
      setSending(false);
    }
  }

  const sendDisabled = !messageText.trim() || sending;

  return (
    <View style={{ flex: 1, padding: 20 }}>
      {/* Chat header */}
      <Text style={{ fontSize: 28, fontWeight: '700', marginBottom: 4 }}>
        {tutorName}
      </Text>

      <Text style={{ marginBottom: 16, color: '#666' }}>
        Tutor conversation
      </Text>

      {/* Message list */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => {
          const isStudent = item.sender === 'student';

          return (
            <View
              style={{
                alignSelf: isStudent ? 'flex-end' : 'flex-start',
                backgroundColor: isStudent ? '#111' : '#eee',
                padding: 12,
                borderRadius: 12,
                marginBottom: 10,
                maxWidth: '80%',
              }}
            >
              <Text style={{ color: isStudent ? 'white' : 'black' }}>
                {item.text}
              </Text>

              <Text
                style={{
                  marginTop: 4,
                  fontSize: 12,
                  color: isStudent ? '#ddd' : '#666',
                }}
              >
                {item.time}
              </Text>
            </View>
          );
        }}
      />

      {/* Message input row */}
      <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
        <TextInput
          placeholder="Type a message..."
          value={messageText}
          onChangeText={setMessageText}
          onSubmitEditing={sendMessage}
          returnKeyType="send"
          editable={!sending}
          style={{
            flex: 1,
            borderWidth: 1,
            borderColor: '#ddd',
            borderRadius: 10,
            padding: 12,
          }}
        />

        <Pressable
          disabled={sendDisabled}
          onPress={sendMessage}
          style={{
            backgroundColor: sendDisabled ? '#ccc' : 'black',
            padding: 12,
            borderRadius: 10,
            justifyContent: 'center',
          }}
        >
          <Text style={{ color: 'white', fontWeight: '600' }}>
            {sending ? 'Sending...' : 'Send'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}