import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';

import {
  FlatList,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';

import { ScreenState } from '../../src/components/ScreenState';

import { useBookings } from '../../src/context/BookingContext';
import { useChat } from '../../src/context/ChatContext';

export default function ChatScreen() {
  // Read tutor id from dynamic route: /chat/[id]
  const { id } = useLocalSearchParams();

  // Expo Router params can be string or string[]
  // so normalize into a single string.
  const tutorId = Array.isArray(id)
    ? id[0]
    : id;

  // BookingContext provides booking data.
  // Used here to find tutor information.
  const { bookings } = useBookings();

  // ChatContext provides:
  // - message state
  // - realtime updates
  // - message loading
  // - message sending
  const {
    messagesByConversation,
    loadMessages,
    addMessage,
  } = useChat();

  // Controlled input state for message text.
  const [messageText, setMessageText] =
    useState('');

  // Prevent duplicate message sends.
  const [sending, setSending] =
    useState(false);

  // User-friendly error message.
  const [errorMessage, setErrorMessage] =
    useState('');

  // Find booking associated with this tutor conversation.
  const booking = bookings.find(
    (booking) =>
      booking.tutorId === tutorId,
  );

  // Fallback tutor name if booking isn't loaded yet.
  const tutorName =
    booking?.tutorName ?? 'Tutor';

  // Messages for this specific tutor conversation.
  const messages = tutorId
    ? messagesByConversation[tutorId] ??
      []
    : [];

  // Load messages when chat screen opens.
  useEffect(() => {
    fetchMessages();
  }, [tutorId]);

  async function fetchMessages() {
    if (!tutorId) return;

    try {
      setErrorMessage('');

      // Load messages from Supabase through ChatContext.
      await loadMessages(tutorId);
    } catch (error) {
      console.log(
        'LOAD CHAT ERROR:',
        error,
      );

      setErrorMessage(
        'Could not load messages. Please try again.',
      );
    }
  }

  async function sendMessage() {
    // Prevent invalid sends.
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
      // Save message to Supabase.
      // Realtime subscription updates UI automatically.
      await addMessage(
        tutorId,
        tutorName,
        messageText.trim(),
      );

      // Clear input after successful send.
      setMessageText('');
    } catch (error) {
      console.log(
        'SEND MESSAGE ERROR:',
        error,
      );

      setErrorMessage(
        'Could not send message. Please try again.',
      );
    } finally {
      setSending(false);
    }
  }

  // Disable send button while empty or sending.
  const sendDisabled =
    !messageText.trim() || sending;

  // Shared error UI.
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
    <View
      style={{
        flex: 1,
        padding: 20,
      }}
    >
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

      <Text
        style={{
          marginBottom: 16,
          color: '#666',
        }}
      >
        Tutor conversation
      </Text>

      {/* Empty state */}
      {messages.length === 0 ? (
        <View style={{ flex: 1 }}>
          <ScreenState message="No messages yet. Start the conversation." />
        </View>
      ) : (
        <FlatList
          data={messages}

          // Stable React list key.
          keyExtractor={(item) =>
            item.id
          }

          // Add bottom spacing so messages don't hide behind input.
          contentContainerStyle={{
            paddingBottom: 20,
          }}

          renderItem={({ item }) => {
            // Student messages appear on the right.
            const isStudent =
              item.sender === 'student';

            return (
              <View
                style={{
                  alignSelf: isStudent
                    ? 'flex-end'
                    : 'flex-start',

                  backgroundColor:
                    isStudent
                      ? '#111'
                      : '#eee',

                  padding: 12,
                  borderRadius: 12,
                  marginBottom: 10,

                  // Prevent giant message bubbles.
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
      )}

      {/* Message input row */}
      <View
        style={{
          flexDirection: 'row',
          gap: 8,
          marginTop: 12,
        }}
      >
        <TextInput
          placeholder="Type a message..."
          value={messageText}
          onChangeText={setMessageText}

          // Pressing keyboard send triggers message send.
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

        {/* Send button */}
        <Pressable
          disabled={sendDisabled}
          onPress={sendMessage}
          style={{
            backgroundColor:
              sendDisabled
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