// Shape used by the app for profile data loaded from Supabase.
// This should match the columns in your Supabase "profiles" table.
export type Profile = {
  // Supabase auth user id
  id: string;

  // User's display name
  full_name: string;

  // Determines whether the user is using the app as a student or tutor
  role: 'student' | 'tutor';

  // Optional timestamp from Supabase
  created_at?: string;
};