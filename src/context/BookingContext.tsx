import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

import { supabase } from '../lib/supabase';
import { Booking } from '../types/booking';

type BookingContextType = {
  bookings: Booking[];
  loading: boolean;
  loadBookings: () => Promise<void>;
  addBooking: (booking: Omit<Booking, 'id'>) => Promise<void>;
  cancelBooking: (bookingId: string) => Promise<void>;
};

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: ReactNode }) {
  // Stores bookings loaded from Supabase
  const [bookings, setBookings] = useState<Booking[]>([]);

  // Tracks loading state while fetching bookings
  const [loading, setLoading] = useState(true);

  // Load bookings once when app/context mounts
  useEffect(() => {
    loadBookings();
  }, []);

  // Converts a raw Supabase row into the app's Booking shape
  function formatBooking(row: any): Booking {
    return {
      id: row.id,
      tutorId: row.tutor_id,
      tutorName: row.tutor_name,
      subject: row.subject,
      time: row.time,
      status: row.status,
    };
  }

  // Fetch bookings for the currently logged-in user
  async function loadBookings() {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setBookings([]);
      setLoading(false);
      return;
    }

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

    setBookings((data ?? []).map(formatBooking));
    setLoading(false);
  }

  // Insert a new booking into Supabase
  async function addBooking(booking: Omit<Booking, 'id'>) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } = await supabase
      .from('bookings')
      .insert({
        student_id: user.id,
        tutor_id: booking.tutorId,
        tutor_name: booking.tutorName,
        subject: booking.subject,
        time: booking.time,
        status: booking.status,
      })
      .select()
      .single();

    if (error) {
      console.log('ADD BOOKING ERROR:', error);
      return;
    }

    if (data) {
      setBookings((currentBookings) => [
        formatBooking(data),
        ...currentBookings,
      ]);
    }
  }

  // Mark a booking as cancelled in Supabase
  async function cancelBooking(bookingId: string) {
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