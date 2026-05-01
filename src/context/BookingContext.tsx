import { createContext, ReactNode, useContext, useState } from 'react';

export type Booking = {
  id: string;
  tutorId: string;
  tutorName: string;
  subject: string;
  time: string;
  status: 'confirmed' | 'completed' | 'cancelled';
};

type BookingContextType = {
  bookings: Booking[];
  addBooking: (booking: Booking) => void;
};

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>([]);

  function addBooking(booking: Booking) {
    setBookings((currentBookings) => [...currentBookings, booking]);
  }

  return (
    <BookingContext.Provider value={{ bookings, addBooking }}>
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