// Shape of a row from the Supabase profiles table
export type Profile = {
  id: string;
  full_name: string;
  role: 'student' | 'tutor';
  created_at?: string;
};