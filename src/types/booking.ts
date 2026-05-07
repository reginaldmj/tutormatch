// Shape used by the app after converting Supabase booking rows.
export type Booking = {
  id: string;
  tutorId: string;
  tutorName: string;
  subject: string;

  // Legacy display field kept for easy UI rendering.
  time: string;

  // Structured real date/time fields.
  sessionDate?: string | null;
  sessionTime?: string | null;

  status: 'confirmed' | 'cancelled' | 'completed';

  // Connected availability slot.
  availabilitySlotId?: string | null;
};