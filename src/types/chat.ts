// Shape used by the app after converting Supabase message rows
export type ChatMessage = {
  // Supabase message id
  id: string;

  // Tutor/conversation id
  tutorId: string;

  // Tutor display name
  tutorName?: string;

  // Who sent the message
  sender: 'student' | 'tutor';

  // Message body
  text: string;

  // Display-friendly timestamp
  time: string;
};