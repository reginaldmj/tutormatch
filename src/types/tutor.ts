// Shape used by the app for tutor data loaded from Supabase.
// This should match the columns in your Supabase "tutors" table.
export type Tutor = {
  // Supabase tutor id
  id: string;

  // Tutor display name
  name: string;

  // Main subject or specialty
  subject: string;

  // Hourly tutoring price
  price: number;

  // Tutor rating shown on cards/profile
  rating: number;

  // Tutor profile description
  bio: string | null;

  // Optional timestamp from Supabase
  created_at?: string;
};