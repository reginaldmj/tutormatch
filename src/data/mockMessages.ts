import { Conversation } from '../types/message';

export const mockConversations: Conversation[] = [
  {
    id: '1',
    tutorName: 'John Doe',
    lastMessage: 'Hello, how are you doing?',
    updatedAt: '2023-01-01T12:00:00Z',
  },
  {
    id: '2',
    tutorName: 'Jane Smith',
    lastMessage: 'I have a question about the lesson.',
    updatedAt: '2023-01-02T14:30:00Z',
  },
];