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
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, []);

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

    console.log('BOOKINGS DATA:', data);
    console.log('BOOKINGS ERROR:', error);

    if (!error && data) {
      setBookings(
        data.map((booking) => ({
          id: booking.id,
          tutorId: booking.tutor_id,
          tutorName: booking.tutor_name,
          subject: booking.subject,
          time: booking.time,
          status: booking.status,
        })),
      );
    }

    setLoading(false);
  }

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

    console.log('ADD BOOKING DATA:', data);
    console.log('ADD BOOKING ERROR:', error);

    if (!error && data) {
      setBookings((currentBookings) => [
        {
          id: data.id,
          tutorId: data.tutor_id,
          tutorName: data.tutor_name,
          subject: data.subject,
          time: data.time,
          status: data.status,
        },
        ...currentBookings,
      ]);
    }
  }

  async function cancelBooking(bookingId: string) {
    const { data, error } = await supabase
      .from('bookings')
      .update({ status: 'cancelled' })
      .eq('id', bookingId)
      .select()
      .single();

    console.log('CANCEL BOOKING DATA:', data);
    console.log('CANCEL BOOKING ERROR:', error);

    if (!error && data) {
      setBookings((currentBookings) =>
        currentBookings.map((booking) =>
          booking.id === bookingId
            ? {
                ...booking,
                status: 'cancelled',
              }
            : booking,
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