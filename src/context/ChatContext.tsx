import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { mockChatMessagesByConversation } from '../data/mockChatMessages';
import { ChatMessage } from '../types/chat';

type ChatContextType = {
  messagesByConversation: Record<string, ChatMessage[]>;
  addMessage: (conversationId: string, message: ChatMessage) => void;
  getLastMessage: (conversationId: string) => ChatMessage | undefined;
};

const STORAGE_KEY = 'chat_messages';

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [messagesByConversation, setMessagesByConversation] = useState<
    Record<string, ChatMessage[]>
  >({});

  // 🔹 Load messages from storage on app start
  useEffect(() => {
    async function loadMessages() {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);

        if (stored) {
          setMessagesByConversation(JSON.parse(stored));
        } else {
          setMessagesByConversation(mockChatMessagesByConversation);
        }
      } catch (error) {
        console.log('Error loading messages:', error);
        setMessagesByConversation(mockChatMessagesByConversation);
      }
    }

    loadMessages();
  }, []);

  // 🔹 Save messages whenever they change
  useEffect(() => {
    async function saveMessages() {
      try {
        await AsyncStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(messagesByConversation),
        );
      } catch (error) {
        console.log('Error saving messages:', error);
      }
    }

    // avoid saving empty initial state before load
    if (Object.keys(messagesByConversation).length > 0) {
      saveMessages();
    }
  }, [messagesByConversation]);

  function addMessage(conversationId: string, message: ChatMessage) {
    setMessagesByConversation((currentMessages) => ({
      ...currentMessages,
      [conversationId]: [
        ...(currentMessages[conversationId] ?? []),
        message,
      ],
    }));
  }

  function getLastMessage(conversationId: string) {
    const messages = messagesByConversation[conversationId] ?? [];
    return messages[messages.length - 1];
  }

  return (
    <ChatContext.Provider
      value={{ messagesByConversation, addMessage, getLastMessage }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);

  if (!context) {
    throw new Error('useChat must be used inside ChatProvider');
  }

  return context;
}