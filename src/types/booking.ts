// Shape used by the app after converting Supabase booking rows
export type Booking = {
  id: string;
  tutorId: string;
  tutorName: string;
  subject: string;
  time: string;
  status: 'confirmed' | 'cancelled' | 'completed';
};