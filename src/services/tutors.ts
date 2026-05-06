import { supabase } from '../lib/supabase';
import { Tutor } from '../types/tutor';

// Load all tutors from Supabase
export async function getTutors(): Promise<Tutor[]> {
  const { data, error } = await supabase
    .from('tutors')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    throw error;
  }

  return data ?? [];
}

// Load one tutor by id from Supabase
export async function getTutorById(id: string): Promise<Tutor> {
  const { data, error } = await supabase
    .from('tutors')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw error;
  }

  return data;
}