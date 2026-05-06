import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, Pressable, Text, TextInput, View } from 'react-native';

import { ScreenState } from '../../src/components/ScreenState';
import { useBookings } from '../../src/context/BookingContext';
import { useChat } from '../../src/context/ChatContext';

export default function ChatScreen() {
  // Read dynamic route param from /chat/[id]
  const { id } = useLocalSearchParams();

  // Normalize route param because Expo Router can return string | string[]
  const tutorId = Array.isArray(id) ? id[0] : id;

  // Booking data is used to find the tutor name for this chat
  const { bookings } = useBookings();

  // ChatContext handles Supabase message loading/sending
  const { messagesByConversation, loadMessages, addMessage } = useChat();

  // Text currently typed in the input
  const [messageText, setMessageText] = useState('');

  // Prevents duplicate sends
  const [sending, setSending] = useState(false);

  // User-friendly error message
  const [errorMessage, setErrorMessage] = useState('');

  // Find the booking connected to this tutor
  const booking = bookings.find((booking) => booking.tutorId === tutorId);

  // Fallback if booking is not available yet
  const tutorName = booking?.tutorName ?? 'Tutor';

  // Get messages for this tutor conversation
  const messages = tutorId ? messagesByConversation[tutorId] ?? [] : [];

  // Load messages when chat opens
  useEffect(() => {
    fetchMessages();
  }, [tutorId]);

  async function fetchMessages() {
    if (!tutorId) return;

    try {
      setErrorMessage('');
      await loadMessages(tutorId);
    } catch (error) {
      console.log('LOAD CHAT ERROR:', error);
      setErrorMessage('Could not load messages. Please try again.');
    }
  }

  async function sendMessage() {
    if (!tutorId || !messageText.trim() || sending) return;

    setSending(true);
    setErrorMessage('');

    try {
      await addMessage(tutorId, tutorName, messageText.trim());
      setMessageText('');
    } catch (error) {
      console.log('SEND MESSAGE ERROR:', error);
      setErrorMessage('Could not send message. Please try again.');
    } finally {
      setSending(false);
    }
  }

  const sendDisabled = !messageText.trim() || sending;

  if (errorMessage) {
    return (
      <ScreenState
        title={tutorName}
        message={errorMessage}
        buttonText="Retry"
        onPress={fetchMessages}
      />
    );
  }

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
      {messages.length === 0 ? (
        <View style={{ flex: 1 }}>
          <ScreenState message="No messages yet. Start the conversation." />
        </View>
      ) : (
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
      )}

      {/* Input row */}
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