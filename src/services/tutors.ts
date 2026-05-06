import { supabase } from '../lib/supabase';
import { Tutor } from '../types/tutor';

// Loads all tutors from the Supabase "tutors" table.
// Used by the Home screen tutor list.
export async function getTutors(): Promise<Tutor[]> {
  // Query all tutor rows ordered alphabetically by name.
  const { data, error } = await supabase
    .from('tutors')
    .select('*')
    .order('name', {
      ascending: true,
    });

  // Surface Supabase errors for debugging and UI handling.
  if (error) {
    console.log(
      'GET TUTORS ERROR:',
      error,
    );

    throw error;
  }

  // Always return an array.
  return data ?? [];
}

// Loads a single tutor by id.
// Used by:
// - Tutor profile screen
// - Booking screen
export async function getTutorById(
  id: string,
): Promise<Tutor> {
  // Prevent invalid database requests.
  if (!id) {
    throw new Error(
      'Tutor id is required.',
    );
  }

  // Query one tutor matching the provided id.
  const { data, error } = await supabase
    .from('tutors')
    .select('*')
    .eq('id', id)
    .single();

  // Handle Supabase/database errors.
  if (error) {
    console.log(
      'GET TUTOR BY ID ERROR:',
      error,
    );

    throw error;
  }

  // Extra safety check if no tutor exists.
  if (!data) {
    throw new Error(
      'Tutor not found.',
    );
  }

  return data;
}