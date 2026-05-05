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

export async function getTutorById(id: string) {
  const { data, error } = await supabase
    .from('tutors')
    .select('*')
    .eq('id', id)
    .single();

  console.log('TUTOR DATA:', data);
  console.log('TUTOR ERROR:', error);

  if (error) {
    throw error;
  }

  return data;
}