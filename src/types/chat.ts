export type ChatMessage = {
  id: string;
  tutorId: string;
  tutorName?: string;
  sender: 'student' | 'tutor';
  text: string;
  time: string;
};