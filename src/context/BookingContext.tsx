import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

import { releaseAvailabilitySlot } from '../services/availability';
import { supabase } from '../lib/supabase';
import { Booking } from '../types/booking';

type BookingContextType = {
  // Bookings loaded from Supabase for the current user
  bookings: Booking[];

  // Loading state while bookings are being fetched
  loading: boolean;

  // Reload bookings from Supabase
  loadBookings: () => Promise<void>;

  // Create a booking in Supabase
  addBooking: (booking: Omit<Booking, 'id'>) => Promise<void>;

  // Cancel a booking in Supabase
  cancelBooking: (bookingId: string) => Promise<void>;
};

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: ReactNode }) {
  // Global booking state shared across screens
  const [bookings, setBookings] = useState<Booking[]>([]);

  // Used by the Bookings screen for loading UI
  const [loading, setLoading] = useState(true);

  // Load bookings once when the provider mounts
  useEffect(() => {
    loadBookings();
  }, []);

  // Converts Supabase snake_case columns into app camelCase fields
  function formatBooking(row: any): Booking {
    return {
      id: row.id,
      tutorId: row.tutor_id,
      tutorName: row.tutor_name,
      subject: row.subject,
      time: row.time,
      status: row.status,
      availabilitySlotId: row.availability_slot_id,
    };
  }

  async function loadBookings() {
    setLoading(true);

    // Get the logged-in Supabase user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // If logged out, clear bookings
    if (!user) {
      setBookings([]);
      setLoading(false);
      return;
    }

    // Load only this user's bookings
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('student_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.log('BOOKINGS ERROR:', error);
      setLoading(false);
      return;
    }

    // Store formatted bookings in global state
    setBookings((data ?? []).map(formatBooking));
    setLoading(false);
  }

  async function addBooking(booking: Omit<Booking, 'id'>) {
    // Get the logged-in Supabase user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    // Insert booking into Supabase
    const { data, error } = await supabase
      .from('bookings')
      .insert({
        student_id: user.id,
        tutor_id: booking.tutorId,
        tutor_name: booking.tutorName,
        subject: booking.subject,
        time: booking.time,
        status: booking.status,

        // Links booking back to the selected availability slot
        availability_slot_id: booking.availabilitySlotId,
      })
      .select()
      .single();

    if (error) {
      console.log('ADD BOOKING ERROR:', error);
      return;
    }

    // Update local state immediately after successful insert
    if (data) {
      setBookings((currentBookings) => [
        formatBooking(data),
        ...currentBookings,
      ]);
    }
  }

  async function cancelBooking(bookingId: string) {
    // Find the booking before updating it so we still know
    // which availability slot should be released.
    const bookingToCancel = bookings.find(
      (booking) => booking.id === bookingId,
    );

    // Mark booking as cancelled in Supabase
    const { data, error } = await supabase
      .from('bookings')
      .update({ status: 'cancelled' })
      .eq('id', bookingId)
      .select()
      .single();

    if (error) {
      console.log('CANCEL BOOKING ERROR:', error);
      return;
    }

    // If this booking was connected to an availability slot,
    // make that slot available again.
    if (bookingToCancel?.availabilitySlotId) {
      await releaseAvailabilitySlot(bookingToCancel.availabilitySlotId);
    }

    // Update local state after cancellation
    if (data) {
      setBookings((currentBookings) =>
        currentBookings.map((booking) =>
          booking.id === bookingId ? formatBooking(data) : booking,
        ),
      );
    }
  }

  return (
    <BookingContext.Provider
      value={{
        bookings,
        loading,
        loadBookings,
        addBooking,
        cancelBooking,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBookings() {
  const context = useContext(BookingContext);

  if (!context) {
    throw new Error('useBookings must be used inside BookingProvider');
  }

  return context;
}