import { ChatMessage } from '../types/chat';

export const mockChatMessagesByConversation: Record<string, ChatMessage[]> = {
  '1': [
    {
      id: '1',
      sender: 'tutor',
      text: 'Hi! Looking forward to our session.',
      time: '10:15 AM',
    },
    {
      id: '2',
      sender: 'student',
      text: 'Thanks! I want help with algebra homework.',
      time: '10:17 AM',
    },
  ],
  '2': [
    {
      id: '1',
      sender: 'tutor',
      text: 'Please send me the coding problem before class.',
      time: 'Yesterday',
    },
    {
      id: '2',
      sender: 'student',
      text: 'Will do. It is about loops and arrays.',
      time: 'Yesterday',
    },
  ],
};