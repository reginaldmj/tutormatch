// Shape used by the app for tutor availability rows.
export type TutorAvailability = {
  id: string;
  tutor_id: string;

  // Real date stored as YYYY-MM-DD.
  date: string;

  // Display-friendly time.
  time: string;

  is_available: boolean;
  created_at?: string;
};