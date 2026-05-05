import { createContext, ReactNode, useContext, useState } from 'react';
import { supabase } from '../lib/supabase';
import { ChatMessage } from '../types/chat';

type ChatContextType = {
  messagesByConversation: Record<string, ChatMessage[]>;
  loadMessages: (tutorId: string) => Promise<void>;
  addMessage: (tutorId: string, tutorName: string, text: string) => Promise<void>;
  getLastMessage: (tutorId: string) => ChatMessage | undefined;
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [messagesByConversation, setMessagesByConversation] = useState<
    Record<string, ChatMessage[]>
  >({});

  async function loadMessages(tutorId: string) {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('tutor_id', tutorId)
      .order('created_at', { ascending: true });

    console.log('MESSAGES DATA:', data);
    console.log('MESSAGES ERROR:', error);

    if (!error && data) {
      setMessagesByConversation((current) => ({
        ...current,
        [tutorId]: data.map((message) => ({
          id: message.id,
          tutorId: message.tutor_id,
          tutorName: message.tutor_name,
          sender: 'student',
          text: message.text,
          time: new Date(message.created_at).toLocaleTimeString([], {
            hour: 'numeric',
            minute: '2-digit',
          }),
        })),
      }));
    }
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
      })
      .select()
      .single();

    console.log('ADD MESSAGE DATA:', data);
    console.log('ADD MESSAGE ERROR:', error);

    if (!error && data) {
      const newMessage: ChatMessage = {
        id: data.id,
        tutorId: data.tutor_id,
        tutorName: data.tutor_name,
        sender: 'student',
        text: data.text,
        time: 'Now',
      };

      setMessagesByConversation((current) => ({
        ...current,
        [tutorId]: [...(current[tutorId] ?? []), newMessage],
      }));
    }
  }

  function getLastMessage(tutorId: string) {
    const messages = messagesByConversation[tutorId] ?? [];
    return messages[messages.length - 1];
  }

  return (
    <ChatContext.Provider
      value={{ messagesByConversation, loadMessages, addMessage, getLastMessage }}
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