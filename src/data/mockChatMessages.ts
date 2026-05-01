import { ChatMessage } from '../types/chat';

export const mockChatMessages: ChatMessage[] = [
  {
    id: '1',
    sender: 'tutor',
    text: 'Hi! Looking forward to our session.',
    time: '10:15 AM',
  },
  {
    id: '2',
    sender: 'student',
    text: 'Thanks! I want help with homework problems.',
    time: '10:17 AM',
  },
  {
    id: '3',
    sender: 'tutor',
    text: 'Sounds good. Send them before the session.',
    time: '10:18 AM',
  },
];