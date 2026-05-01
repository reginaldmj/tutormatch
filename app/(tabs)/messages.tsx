import { router } from 'expo-router';
import { FlatList, Pressable, Text, View } from 'react-native';
import { mockConversations } from '../../src/data/mockMessages';

export default function MessagesScreen() {
  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 28, fontWeight: '700', marginBottom: 16 }}>
        Messages
      </Text>

      <FlatList
        data={mockConversations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => router.push(`/chat/${item.id}` as any)}
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
            <Text style={{ marginTop: 4 }}>{item.lastMessage}</Text>
            <Text style={{ marginTop: 6, color: '#666' }}>
              {item.updatedAt}
            </Text>
          </Pressable>
        )}
      />
    </View>
  );
}