import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, Pressable, Text, TextInput, View } from 'react-native';
import { useChat } from '../../src/context/ChatContext';
import { useBookings } from '../../src/context/BookingContext';

export default function ChatScreen() {
  const { id } = useLocalSearchParams();
  const tutorId = Array.isArray(id) ? id[0] : id;

  const { bookings } = useBookings();
  const { messagesByConversation, loadMessages, addMessage } = useChat();

  const [messageText, setMessageText] = useState('');

  const booking = bookings.find((booking) => booking.tutorId === tutorId);
  const tutorName = booking?.tutorName ?? 'Tutor';

  const messages = tutorId ? messagesByConversation[tutorId] ?? [] : [];

  useEffect(() => {
    if (tutorId) {
      loadMessages(tutorId);
    }
  }, [tutorId]);

  async function sendMessage() {
    if (!tutorId) return;
    if (!messageText.trim()) return;

    await addMessage(tutorId, tutorName, messageText.trim());

    setMessageText('');
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 28, fontWeight: '700', marginBottom: 4 }}>
        {tutorName}
      </Text>

      <Text style={{ marginBottom: 16, color: '#666' }}>
        Tutor conversation
      </Text>

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

      <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
        <TextInput
          placeholder="Type a message..."
          value={messageText}
          onChangeText={setMessageText}
          onSubmitEditing={sendMessage}
          returnKeyType="send"
          style={{
            flex: 1,
            borderWidth: 1,
            borderColor: '#ddd',
            borderRadius: 10,
            padding: 12,
          }}
        />

        <Pressable
          onPress={sendMessage}
          style={{
            backgroundColor: 'black',
            padding: 12,
            borderRadius: 10,
            justifyContent: 'center',
          }}
        >
          <Text style={{ color: 'white', fontWeight: '600' }}>Send</Text>
        </Pressable>
      </View>
    </View>
  );
}