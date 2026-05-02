import { createContext, ReactNode, useContext, useState } from 'react';
import { mockChatMessagesByConversation } from '../data/mockChatMessages';
import { ChatMessage } from '../types/chat';

type ChatContextType = {
  messagesByConversation: Record<string, ChatMessage[]>;
  addMessage: (conversationId: string, message: ChatMessage) => void;
  getLastMessage: (conversationId: string) => ChatMessage | undefined;
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [messagesByConversation, setMessagesByConversation] = useState<
    Record<string, ChatMessage[]>
  >(mockChatMessagesByConversation);

  function addMessage(conversationId: string, message: ChatMessage) {
    setMessagesByConversation((currentMessages) => ({
      ...currentMessages,
      [conversationId]: [...(currentMessages[conversationId] ?? []), message],
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