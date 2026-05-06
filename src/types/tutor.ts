// Shape of a tutor row from the Supabase tutors table
export type Tutor = {
  id: string;
  name: string;
  subject: string;
  price: number;
  rating: number;
  bio: string | null;
  created_at?: string;
};