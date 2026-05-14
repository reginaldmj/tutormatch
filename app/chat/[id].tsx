import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';

import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { AppTheme, layout } from '@/constants/theme';

import { AppBottomTabs } from '../../src/components/AppBottomTabs';
import { ScreenState } from '../../src/components/ScreenState';
import { useBookings } from '../../src/context/BookingContext';
import { useChat } from '../../src/context/ChatContext';

export default function ChatScreen() {
  const { id } = useLocalSearchParams();
  const tutorId = Array.isArray(id) ? id[0] : id;
  const { bookings } = useBookings();
  const {
    messagesByConversation,
    loadMessages,
    addMessage,
    markConversationRead,
  } = useChat();
  const [messageText, setMessageText] = useState('');
  const [sending, setSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const booking = bookings.find((booking) => booking.tutorId === tutorId);
  const tutorName = booking?.tutorName ?? 'Tutor';
  const messages = tutorId ? messagesByConversation[tutorId] ?? [] : [];

  useEffect(() => {
    fetchMessages();
  }, [tutorId]);

  async function fetchMessages() {
    if (!tutorId) return;

    try {
      setErrorMessage('');
      await loadMessages(tutorId);
      await markConversationRead(tutorId);
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
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.stateWrap}>
          <ScreenState
            title={tutorName}
            message={errorMessage}
            buttonText="Retry"
            onPress={fetchMessages}
          />
        </View>
        <AppBottomTabs />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <Text numberOfLines={1} style={styles.title}>
              {tutorName}
            </Text>
            <Text style={styles.subtitle}>Tutor conversation</Text>
          </View>

          {messages.length === 0 ? (
            <View style={styles.emptyWrap}>
              <ScreenState message="No messages yet. Start the conversation." />
            </View>
          ) : (
            <FlatList
              data={messages}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.messageList}
              renderItem={({ item }) => {
                const isStudent = item.sender === 'student';

                return (
                  <View
                    style={[
                      styles.messageBubble,
                      isStudent ? styles.studentBubble : styles.tutorBubble,
                    ]}
                  >
                    <Text
                      style={[
                        styles.messageText,
                        isStudent ? styles.studentMessageText : styles.tutorMessageText,
                      ]}
                    >
                      {item.text}
                    </Text>

                    <Text
                      style={[
                        styles.messageTime,
                        isStudent ? styles.studentMessageTime : styles.tutorMessageTime,
                      ]}
                    >
                      {item.time}
                    </Text>
                  </View>
                );
              }}
            />
          )}

          <View style={styles.inputRow}>
            <TextInput
              placeholder="Type a message"
              placeholderTextColor={AppTheme.colors.subtle}
              value={messageText}
              onChangeText={setMessageText}
              onSubmitEditing={sendMessage}
              returnKeyType="send"
              editable={!sending}
              style={styles.input}
            />

            <Pressable
              disabled={sendDisabled}
              onPress={sendMessage}
              style={({ pressed }) => [
                styles.sendButton,
                sendDisabled ? styles.sendButtonDisabled : null,
                pressed && !sendDisabled ? styles.sendButtonPressed : null,
              ]}
            >
              <Text style={styles.sendButtonText}>
                {sending ? 'Sending...' : 'Send'}
              </Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
      <AppBottomTabs />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: AppTheme.colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  stateWrap: {
    flex: 1,
  },
  container: {
    flex: 1,
    width: '100%',
    maxWidth: layout.maxContentWidth,
    alignSelf: 'center',
    padding: layout.screenPadding,
  },
  header: {
    marginBottom: AppTheme.spacing.lg,
  },
  title: {
    fontSize: AppTheme.typography.screenTitle,
    fontWeight: '800',
    color: AppTheme.colors.text,
  },
  subtitle: {
    marginTop: AppTheme.spacing.xs,
    color: AppTheme.colors.muted,
    fontWeight: '700',
  },
  emptyWrap: {
    flex: 1,
  },
  messageList: {
    paddingBottom: AppTheme.spacing.xl,
  },
  messageBubble: {
    padding: AppTheme.spacing.md,
    borderRadius: AppTheme.radius.lg,
    marginBottom: AppTheme.spacing.sm,
    maxWidth: '82%',
  },
  studentBubble: {
    alignSelf: 'flex-end',
    backgroundColor: AppTheme.colors.primary,
    borderBottomRightRadius: AppTheme.radius.sm,
  },
  tutorBubble: {
    alignSelf: 'flex-start',
    backgroundColor: AppTheme.colors.surface,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    borderBottomLeftRadius: AppTheme.radius.sm,
  },
  messageText: {
    lineHeight: 20,
  },
  studentMessageText: {
    color: AppTheme.colors.white,
  },
  tutorMessageText: {
    color: AppTheme.colors.text,
  },
  messageTime: {
    marginTop: AppTheme.spacing.xs,
    fontSize: AppTheme.typography.caption,
    fontWeight: '700',
  },
  studentMessageTime: {
    color: '#dbeafe',
  },
  tutorMessageTime: {
    color: AppTheme.colors.subtle,
  },
  inputRow: {
    flexDirection: 'row',
    gap: AppTheme.spacing.sm,
    paddingTop: AppTheme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: AppTheme.colors.border,
  },
  input: {
    flex: 1,
    minHeight: 48,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    borderRadius: AppTheme.radius.md,
    backgroundColor: AppTheme.colors.surface,
    paddingHorizontal: AppTheme.spacing.md,
    color: AppTheme.colors.text,
  },
  sendButton: {
    minWidth: 86,
    minHeight: 48,
    justifyContent: 'center',
    borderRadius: AppTheme.radius.md,
    backgroundColor: AppTheme.colors.primary,
    paddingHorizontal: AppTheme.spacing.md,
  },
  sendButtonDisabled: {
    backgroundColor: AppTheme.colors.disabled,
  },
  sendButtonPressed: {
    backgroundColor: AppTheme.colors.primaryPressed,
    transform: [{ scale: 0.98 }],
  },
  sendButtonText: {
    color: AppTheme.colors.white,
    textAlign: 'center',
    fontWeight: '800',
  },
});
