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
  // Messages grouped by tutor id.
  // Example:
  // {
  //   "tutor-123": [message1, message2]
  // }
  messagesByConversation: Record<string, ChatMessage[]>;

  // Loads messages for one tutor conversation.
  loadMessages: (tutorId: string) => Promise<void>;

  // Loads all messages for preview cards.
  loadAllMessages: () => Promise<void>;

  // Saves a new message to Supabase.
  addMessage: (
    tutorId: string,
    tutorName: string,
    text: string,
  ) => Promise<void>;

  // Gets the newest message for preview display.
  getLastMessage: (
    tutorId: string,
  ) => ChatMessage | undefined;
};

const ChatContext = createContext<
  ChatContextType | undefined
>(undefined);

export function ChatProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [messagesByConversation, setMessagesByConversation] =
    useState<Record<string, ChatMessage[]>>({});

  // Converts a raw Supabase message row into the app's ChatMessage shape.
  function formatMessage(message: any): ChatMessage {
    return {
      id: message.id,
      tutorId: message.tutor_id,
      tutorName: message.tutor_name,
      sender: 'student',
      text: message.text,
      time: new Date(message.created_at).toLocaleTimeString([], {
        hour: 'numeric',
        minute: '2-digit',
      }),
    };
  }

  // Load saved messages once when ChatProvider mounts.
  // This keeps message previews visible after refreshing the app.
  useEffect(() => {
    loadAllMessages();
  }, []);

  // Subscribe to new rows inserted into the Supabase messages table.
  // This powers realtime chat updates.
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

            if (alreadyExists) {
              return current;
            }

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

    if (data) {
      setMessagesByConversation((current) => ({
        ...current,
        [tutorId]: data.map(formatMessage),
      }));
    }
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

    if (data) {
      const groupedMessages: Record<string, ChatMessage[]> = {};

      data.forEach((message) => {
        const tutorId = message.tutor_id;

        if (!groupedMessages[tutorId]) {
          groupedMessages[tutorId] = [];
        }

        groupedMessages[tutorId].push(formatMessage(message));
      });

      setMessagesByConversation(groupedMessages);
    }
  }

  async function addMessage(
    tutorId: string,
    tutorName: string,
    text: string,
  ) {
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

        if (alreadyExists) {
          return current;
        }

        return {
          ...current,
          [tutorId]: [...currentMessages, newMessage],
        };
      });
    }
  }

  function getLastMessage(tutorId: string) {
    const messages = messagesByConversation[tutorId] ?? [];
    return messages[messages.length - 1];
  }

  return (
    <ChatContext.Provider
      value={{
        messagesByConversation,
        loadMessages,
        loadAllMessages,
        addMessage,
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