import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Booking } from '../types/booking';

type BookingContextType = {
  bookings: Booking[];
  addBooking: (booking: Booking) => void;
};

const STORAGE_KEY = 'bookings';

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>([]);

  // 🔹 Load bookings on app start
  useEffect(() => {
    async function loadBookings() {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);

        if (stored) {
          setBookings(JSON.parse(stored));
        }
      } catch (error) {
        console.log('Error loading bookings:', error);
      }
    }

    loadBookings();
  }, []);

  // 🔹 Save bookings whenever they change
  useEffect(() => {
    async function saveBookings() {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
      } catch (error) {
        console.log('Error saving bookings:', error);
      }
    }

    if (bookings.length > 0) {
      saveBookings();
    }
  }, [bookings]);

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