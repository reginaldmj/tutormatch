// Shape used by the app for tutor data loaded from Supabase.
export type Tutor = {
  id: string;
  name: string;
  subject: string;
  price: number;
  rating: number;
  bio: string | null;

  // Optional avatar image URL shown on cards/profile.
  avatar_url?: string | null;

  created_at?: string;
};