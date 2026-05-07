// Shape used by the app after converting Supabase message rows.
export type ChatMessage = {
  id: string;
  tutorId: string;
  tutorName?: string;
  sender: 'student' | 'tutor';
  text: string;
  time: string;

  // Used for unread message badges.
  isRead?: boolean;
};