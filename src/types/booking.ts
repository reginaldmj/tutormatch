export type Booking = {
  id: string;
  tutorId: string;
  tutorName: string;
  subject: string;
  time: string;
  status: 'confirmed' | 'completed' | 'cancelled';
};