import { supabase } from '../lib/supabase';
import { TutorAvailability } from '../types/availability';

// Loads available time slots for one tutor.
// Used by the booking screen.
export async function getTutorAvailability(
  tutorId: string,
): Promise<TutorAvailability[]> {
  if (!tutorId) {
    throw new Error('Tutor id is required.');
  }

  const { data, error } = await supabase
    .from('tutor_availability')
    .select('*')
    .eq('tutor_id', tutorId)
    .eq('is_available', true)
    .order('date', { ascending: true })
    .order('time', { ascending: true });

  if (error) {
    console.log('GET TUTOR AVAILABILITY ERROR:', error);
    throw error;
  }

  return data ?? [];
}

// Marks a slot unavailable after it is booked.
export async function reserveAvailabilitySlot(slotId: string) {
  if (!slotId) {
    throw new Error('Availability slot id is required.');
  }

  const { error } = await supabase
    .from('tutor_availability')
    .update({ is_available: false })
    .eq('id', slotId);

  if (error) {
    console.log('RESERVE AVAILABILITY SLOT ERROR:', error);
    throw error;
  }
}

// Marks a slot available again after a booking is cancelled.
export async function releaseAvailabilitySlot(slotId: string) {
  if (!slotId) {
    throw new Error('Availability slot id is required.');
  }

  const { error } = await supabase
    .from('tutor_availability')
    .update({ is_available: true })
    .eq('id', slotId);

  if (error) {
    console.log('RELEASE AVAILABILITY SLOT ERROR:', error);
    throw error;
  }
}