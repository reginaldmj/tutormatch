import { supabase } from '../lib/supabase';

export async function getTutors() {
  const { data, error } = await supabase
    .from('tutors')
    .select('*')
    .order('name', { ascending: true });

  console.log('TUTORS DATA:', data);
  console.log('TUTORS ERROR:', error);

  if (error) {
    throw error;
  }

  return data;
}