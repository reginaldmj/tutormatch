import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, Pressable, Text, TextInput, View } from 'react-native';

import { useBookings } from '../../src/context/BookingContext';
import { useChat } from '../../src/context/ChatContext';

export default function ChatScreen() {
  // Read the dynamic route parameter from /chat/[id]
  const { id } = useLocalSearchParams();

  // Expo Router params can be string | string[]
  // Normalize into a single string
  const tutorId = Array.isArray(id) ? id[0] : id;

  // Access bookings from BookingContext
  // Used to find the tutor name for this conversation
  const { bookings } = useBookings();

  // Access chat state and actions from ChatContext
  const {
    messagesByConversation,
    loadMessages,
    addMessage,
  } = useChat();

  // Stores the text currently typed into the input
  const [messageText, setMessageText] = useState('');

  // Prevents users from double-sending messages
  const [sending, setSending] = useState(false);

  // Stores user-friendly UI errors
  const [errorMessage, setErrorMessage] = useState('');

  // Find the booking tied to this tutor
  const booking = bookings.find(
    (booking) => booking.tutorId === tutorId,
  );

  // Fallback tutor name if booking isn't found yet
  const tutorName = booking?.tutorName ?? 'Tutor';

  // Get messages for this tutor conversation
  const messages = tutorId
    ? messagesByConversation[tutorId] ?? []
    : [];

  // Load saved messages from Supabase when screen opens
  useEffect(() => {
    async function fetchMessages() {
      if (!tutorId) return;

      try {
        // Clear old errors
        setErrorMessage('');

        // Load messages from Supabase
        await loadMessages(tutorId);
      } catch (error) {
        console.log('LOAD CHAT ERROR:', error);

        setErrorMessage(
          'Could not load messages. Please try again.',
        );
      }
    }

    fetchMessages();
  }, [tutorId]);

  // Send a new chat message
  async function sendMessage() {
    // Prevent empty messages or double taps
    if (
      !tutorId ||
      !messageText.trim() ||
      sending
    ) {
      return;
    }

    setSending(true);
    setErrorMessage('');

    try {
      // Save message to Supabase
      await addMessage(
        tutorId,
        tutorName,
        messageText.trim(),
      );

      // Clear input after sending
      setMessageText('');
    } catch (error) {
      console.log('SEND MESSAGE ERROR:', error);

      setErrorMessage(
        'Could not send message. Please try again.',
      );
    } finally {
      setSending(false);
    }
  }

  // Disable send button while sending
  const sendDisabled =
    !messageText.trim() || sending;

  return (
    <View style={{ flex: 1, padding: 20 }}>
      {/* Chat header */}
      <Text
        style={{
          fontSize: 28,
          fontWeight: '700',
          marginBottom: 4,
        }}
      >
        {tutorName}
      </Text>

      {/* Subtitle */}
      <Text
        style={{
          marginBottom: 16,
          color: '#666',
        }}
      >
        Tutor conversation
      </Text>

      {/* Error banner */}
      {errorMessage ? (
        <Text
          style={{
            marginBottom: 16,
            color: 'red',
          }}
        >
          {errorMessage}
        </Text>
      ) : null}

      {/* Chat messages */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}

        // Adds spacing below messages
        contentContainerStyle={{
          paddingBottom: 20,
        }}

        renderItem={({ item }) => {
          // Student messages align right
          const isStudent =
            item.sender === 'student';

          return (
            <View
              style={{
                alignSelf: isStudent
                  ? 'flex-end'
                  : 'flex-start',

                backgroundColor: isStudent
                  ? '#111'
                  : '#eee',

                padding: 12,
                borderRadius: 12,
                marginBottom: 10,
                maxWidth: '80%',
              }}
            >
              {/* Message text */}
              <Text
                style={{
                  color: isStudent
                    ? 'white'
                    : 'black',
                }}
              >
                {item.text}
              </Text>

              {/* Message timestamp */}
              <Text
                style={{
                  marginTop: 4,
                  fontSize: 12,

                  color: isStudent
                    ? '#ddd'
                    : '#666',
                }}
              >
                {item.time}
              </Text>
            </View>
          );
        }}
      />

      {/* Message input row */}
      <View
        style={{
          flexDirection: 'row',
          gap: 8,
          marginTop: 12,
        }}
      >
        {/* Text input */}
        <TextInput
          placeholder="Type a message..."
          value={messageText}
          onChangeText={setMessageText}

          // Send on keyboard submit
          onSubmitEditing={sendMessage}

          returnKeyType="send"

          // Disable while sending
          editable={!sending}

          style={{
            flex: 1,
            borderWidth: 1,
            borderColor: '#ddd',
            borderRadius: 10,
            padding: 12,
          }}
        />

        {/* Send button */}
        <Pressable
          disabled={sendDisabled}
          onPress={sendMessage}
          style={{
            backgroundColor: sendDisabled
              ? '#ccc'
              : 'black',

            padding: 12,
            borderRadius: 10,
            justifyContent: 'center',
          }}
        >
          <Text
            style={{
              color: 'white',
              fontWeight: '600',
            }}
          >
            {sending
              ? 'Sending...'
              : 'Send'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}