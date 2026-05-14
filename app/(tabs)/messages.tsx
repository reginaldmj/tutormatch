import { router } from 'expo-router';
import { useEffect } from 'react';
import {
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { AppTheme, layout } from '@/constants/theme';

import { ScreenState } from '../../src/components/ScreenState';
import { useBookings } from '../../src/context/BookingContext';
import { useChat } from '../../src/context/ChatContext';

export default function MessagesScreen() {
  const { bookings } = useBookings();
  const { messagesByConversation, getLastMessage, loadAllMessages } = useChat();

  useEffect(() => {
    loadAllMessages();
  }, []);

  const uniqueBookings = bookings.filter(
    (booking, index, self) =>
      index === self.findIndex((item) => item.tutorId === booking.tutorId),
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Messages</Text>

        {uniqueBookings.length === 0 ? (
          <ScreenState message="No conversations yet. Book a tutor to start chatting." />
        ) : (
          <FlatList
            data={uniqueBookings}
            extraData={messagesByConversation}
            keyExtractor={(item) => item.tutorId}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => {
              const lastMessage = getLastMessage(item.tutorId);

              return (
                <Pressable
                  onPress={() => router.push(`/chat/${item.tutorId}` as any)}
                  style={({ pressed }) => [
                    styles.conversationCard,
                    pressed ? styles.conversationCardPressed : null,
                  ]}
                >
                  <View style={styles.initialCircle}>
                    <Text style={styles.initialText}>
                      {item.tutorName.charAt(0).toUpperCase()}
                    </Text>
                  </View>

                  <View style={styles.conversationText}>
                    <View style={styles.conversationHeader}>
                      <Text numberOfLines={1} style={styles.tutorName}>
                        {item.tutorName}
                      </Text>
                      <Text numberOfLines={1} style={styles.timeText}>
                        {lastMessage?.time ?? 'New'}
                      </Text>
                    </View>

                    <Text numberOfLines={2} style={styles.previewText}>
                      {lastMessage?.text ?? `Start chatting about ${item.subject}`}
                    </Text>
                  </View>
                </Pressable>
              );
            }}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: AppTheme.colors.background,
  },
  container: {
    flex: 1,
    width: '100%',
    maxWidth: layout.maxContentWidth,
    alignSelf: 'center',
    padding: layout.screenPadding,
  },
  title: {
    fontSize: AppTheme.typography.screenTitle,
    fontWeight: '800',
    color: AppTheme.colors.text,
    marginBottom: AppTheme.spacing.lg,
  },
  listContent: {
    paddingBottom: AppTheme.spacing.xxl,
  },
  conversationCard: {
    flexDirection: 'row',
    gap: AppTheme.spacing.md,
    padding: AppTheme.spacing.lg,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    borderRadius: AppTheme.radius.lg,
    backgroundColor: AppTheme.colors.surface,
    marginBottom: AppTheme.spacing.md,
    ...AppTheme.shadows.soft,
  },
  conversationCardPressed: {
    borderColor: AppTheme.colors.primary,
    backgroundColor: AppTheme.colors.primarySoft,
    transform: [{ scale: 0.99 }],
  },
  initialCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppTheme.colors.tealSoft,
  },
  initialText: {
    color: AppTheme.colors.teal,
    fontWeight: '800',
  },
  conversationText: {
    flex: 1,
    minWidth: 0,
  },
  conversationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: AppTheme.spacing.md,
  },
  tutorName: {
    flex: 1,
    color: AppTheme.colors.text,
    fontSize: AppTheme.typography.cardTitle,
    fontWeight: '800',
  },
  timeText: {
    color: AppTheme.colors.subtle,
    fontSize: AppTheme.typography.caption,
    fontWeight: '700',
  },
  previewText: {
    marginTop: AppTheme.spacing.xs,
    color: AppTheme.colors.muted,
    lineHeight: 20,
  },
});
