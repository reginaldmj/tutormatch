import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

import { supabase } from '../lib/supabase';
import { ChatMessage } from '../types/chat';

type ChatContextType = {
  messagesByConversation: Record<string, ChatMessage[]>;
  unreadCount: number;
  loadMessages: (tutorId: string) => Promise<void>;
  loadAllMessages: () => Promise<void>;
  addMessage: (tutorId: string, tutorName: string, text: string) => Promise<void>;
  markConversationRead: (tutorId: string) => Promise<void>;
  getLastMessage: (tutorId: string) => ChatMessage | undefined;
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [messagesByConversation, setMessagesByConversation] = useState<
    Record<string, ChatMessage[]>
  >({});

  function formatMessage(message: any): ChatMessage {
    return {
      id: message.id,
      tutorId: message.tutor_id,
      tutorName: message.tutor_name,
      sender: 'student',
      text: message.text,
      isRead: message.is_read ?? false,
      time: new Date(message.created_at).toLocaleTimeString([], {
        hour: 'numeric',
        minute: '2-digit',
      }),
    };
  }

  const unreadCount = Object.values(messagesByConversation)
    .flat()
    .filter((message) => !message.isRead).length;

  useEffect(() => {
    loadAllMessages();
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel('messages-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        (payload) => {
          const newMessage = formatMessage(payload.new);
          const tutorId = newMessage.tutorId;

          setMessagesByConversation((current) => {
            const existingMessages = current[tutorId] ?? [];

            const alreadyExists = existingMessages.some(
              (message) => message.id === newMessage.id,
            );

            if (alreadyExists) return current;

            return {
              ...current,
              [tutorId]: [...existingMessages, newMessage],
            };
          });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function loadMessages(tutorId: string) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('sender_id', user.id)
      .eq('tutor_id', tutorId)
      .order('created_at', { ascending: true });

    if (error) {
      console.log('MESSAGES ERROR:', error);
      return;
    }

    setMessagesByConversation((current) => ({
      ...current,
      [tutorId]: (data ?? []).map(formatMessage),
    }));
  }

  async function loadAllMessages() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('sender_id', user.id)
      .order('created_at', { ascending: true });

    if (error) {
      console.log('ALL MESSAGES ERROR:', error);
      return;
    }

    const groupedMessages: Record<string, ChatMessage[]> = {};

    (data ?? []).forEach((message) => {
      const tutorId = message.tutor_id;

      if (!groupedMessages[tutorId]) {
        groupedMessages[tutorId] = [];
      }

      groupedMessages[tutorId].push(formatMessage(message));
    });

    setMessagesByConversation(groupedMessages);
  }

  async function addMessage(tutorId: string, tutorName: string, text: string) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } = await supabase
      .from('messages')
      .insert({
        sender_id: user.id,
        tutor_id: tutorId,
        tutor_name: tutorName,
        text,
        is_read: true,
      })
      .select('*')
      .single();

    if (error) {
      console.log('ADD MESSAGE ERROR:', error);
      return;
    }

    if (data) {
      const newMessage = {
        ...formatMessage(data),
        time: 'Now',
      };

      setMessagesByConversation((current) => {
        const currentMessages = current[tutorId] ?? [];

        const alreadyExists = currentMessages.some(
          (message) => message.id === newMessage.id,
        );

        if (alreadyExists) return current;

        return {
          ...current,
          [tutorId]: [...currentMessages, newMessage],
        };
      });
    }
  }

  async function markConversationRead(tutorId: string) {
    const { error } = await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('tutor_id', tutorId);

    if (error) {
      console.log('MARK CONVERSATION READ ERROR:', error);
      return;
    }

    setMessagesByConversation((current) => ({
      ...current,
      [tutorId]: (current[tutorId] ?? []).map((message) => ({
        ...message,
        isRead: true,
      })),
    }));
  }

  function getLastMessage(tutorId: string) {
    const messages = messagesByConversation[tutorId] ?? [];
    return messages[messages.length - 1];
  }

  return (
    <ChatContext.Provider
      value={{
        messagesByConversation,
        unreadCount,
        loadMessages,
        loadAllMessages,
        addMessage,
        markConversationRead,
        getLastMessage,
      }}
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