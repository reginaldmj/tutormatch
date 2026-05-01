export type ChatMessage = {
  id: string;
  sender: 'student' | 'tutor';
  text: string;
  time: string;
};