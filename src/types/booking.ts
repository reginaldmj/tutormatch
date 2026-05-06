// Shape used by the app after converting
// Supabase booking rows into frontend-friendly data.
export type Booking = {
  // Supabase booking id
  id: string;

  // Tutor connected to this booking
  tutorId: string;

  // Tutor display name
  tutorName: string;

  // Subject booked for tutoring
  subject: string;

  // Human-readable session time
  // Example:
  // "Friday at 3:00 PM"
  time: string;

  // Current booking state
  // confirmed  -> active booking
  // cancelled  -> user cancelled
  // completed  -> finished session
  status: 'confirmed' | 'cancelled' | 'completed';
};