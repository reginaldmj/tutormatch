import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

import { supabase } from '../lib/supabase';
import { Booking } from '../types/booking';

// Defines everything the BookingContext exposes to the app.
type BookingContextType = {
  // Global list of bookings loaded from Supabase
  bookings: Booking[];

  // Loading state while fetching bookings
  loading: boolean;

  // Reload bookings from Supabase
  loadBookings: () => Promise<void>;

  // Create a new booking
  addBooking: (
    booking: Omit<Booking, 'id'>,
  ) => Promise<void>;

  // Cancel an existing booking
  cancelBooking: (
    bookingId: string,
  ) => Promise<void>;
};

// Create the React context.
// Starts undefined until wrapped in BookingProvider.
const BookingContext = createContext<
  BookingContextType | undefined
>(undefined);

export function BookingProvider({
  children,
}: {
  children: ReactNode;
}) {
  // Global booking state shared across the app.
  const [bookings, setBookings] = useState<
    Booking[]
  >([]);

  // Tracks loading state while fetching bookings.
  const [loading, setLoading] = useState(true);

  // Load bookings automatically when provider mounts.
  useEffect(() => {
    loadBookings();
  }, []);

  // Converts raw Supabase rows into frontend-friendly Booking objects.
  // This creates a consistent structure used throughout the app.
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

  // Loads all bookings for the currently logged-in user.
  async function loadBookings() {
    setLoading(true);

    // Get current authenticated user from Supabase Auth.
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // If no user exists, clear local state.
    if (!user) {
      setBookings([]);
      setLoading(false);
      return;
    }

    // Fetch bookings belonging only to this student.
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('student_id', user.id)
      .order('created_at', {
        ascending: false,
      });

    if (error) {
      console.log(
        'BOOKINGS ERROR:',
        error,
      );

      setLoading(false);
      return;
    }

    // Save bookings into global state.
    setBookings(
      (data ?? []).map(formatBooking),
    );

    setLoading(false);
  }

  // Creates a new booking in Supabase.
  async function addBooking(
    booking: Omit<Booking, 'id'>,
  ) {
    // Get currently logged-in user.
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    // Insert booking row into Supabase.
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
      console.log(
        'ADD BOOKING ERROR:',
        error,
      );

      return;
    }

    // Immediately update local app state after successful insert.
    // This avoids needing a full refresh.
    if (data) {
      setBookings(
        (currentBookings) => [
          formatBooking(data),
          ...currentBookings,
        ],
      );
    }
  }

  // Cancels an existing booking.
  async function cancelBooking(
    bookingId: string,
  ) {
    // Update booking status in Supabase.
    const { data, error } = await supabase
      .from('bookings')
      .update({
        status: 'cancelled',
      })
      .eq('id', bookingId)
      .select()
      .single();

    if (error) {
      console.log(
        'CANCEL BOOKING ERROR:',
        error,
      );

      return;
    }

    // Update local booking state immediately after cancellation.
    if (data) {
      setBookings(
        (currentBookings) =>
          currentBookings.map(
            (booking) =>
              booking.id === bookingId
                ? formatBooking(data)
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

// Custom hook used throughout the app.
// Makes booking state/actions easier to access.
export function useBookings() {
  const context =
    useContext(BookingContext);

  // Prevents usage outside BookingProvider.
  if (!context) {
    throw new Error(
      'useBookings must be used inside BookingProvider',
    );
  }

  return context;
}