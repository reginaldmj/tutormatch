import { router, useLocalSearchParams } from 'expo-router';

import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import {
  Pressable,
  Text,
  View,
} from 'react-native';

import { Banner } from '../../src/components/Banner';
import { ScreenState } from '../../src/components/ScreenState';

import { useBookings } from '../../src/context/BookingContext';

import {
  getTutorAvailability,
  reserveAvailabilitySlot,
} from '../../src/services/availability';

import { getTutorById } from '../../src/services/tutors';

import { TutorAvailability } from '../../src/types/availability';
import { Tutor } from '../../src/types/tutor';

export default function BookingScreen() {
  // Read tutorId from route:
  // /booking/[tutorId]
  const { tutorId } =
    useLocalSearchParams();

  // Expo Router params can be:
  // string | string[]
  // so normalize into a single string.
  const id = Array.isArray(
    tutorId,
  )
    ? tutorId[0]
    : tutorId;

  // BookingContext handles:
  // - creating bookings
  // - loading bookings
  // - cancellation
  const { addBooking } =
    useBookings();

  // Tutor profile loaded from Supabase.
  const [tutor, setTutor] =
    useState<Tutor | null>(null);

  // Available booking slots loaded
  // from tutor_availability table.
  const [
    availability,
    setAvailability,
  ] = useState<
    TutorAvailability[]
  >([]);

  // Slot selected by the user.
  const [
    selectedSlot,
    setSelectedSlot,
  ] = useState<TutorAvailability | null>(
    null,
  );

  // Shared UI states.
  const [loading, setLoading] =
    useState(true);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState('');

  const [
    confirmed,
    setConfirmed,
  ] = useState(false);

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  // Load tutor + availability
  // from Supabase.
  //
  // useCallback keeps the function
  // reference stable so React Hooks
  // dependency warnings disappear.
  const loadBookingData =
    useCallback(async () => {
      if (!id) return;

      try {
        setErrorMessage('');
        setLoading(true);

        // Load tutor profile.
        const tutorData =
          await getTutorById(id);

        // Load only available slots.
        const availabilityData =
          await getTutorAvailability(
            id,
          );

        setTutor(tutorData);

        setAvailability(
          availabilityData,
        );
      } catch (error) {
        console.log(
          'LOAD BOOKING DATA ERROR:',
          error,
        );

        setErrorMessage(
          'Could not load booking details. Please try again.',
        );
      } finally {
        setLoading(false);
      }
    }, [id]);

  // Load booking data
  // when the screen opens
  // or tutor id changes.
  useEffect(() => {
    loadBookingData();
  }, [loadBookingData]);

  async function handleConfirmBooking() {
    // Prevent invalid submits.
    if (
      !tutor ||
      !selectedSlot ||
      submitting
    ) {
      return;
    }

    setSubmitting(true);

    setErrorMessage('');

    try {
      // Create booking row.
      await addBooking({
        tutorId: tutor.id,

        tutorName: tutor.name,

        subject: tutor.subject,

        // Legacy display field.
        time: `${selectedSlot.date} at ${selectedSlot.time}`,

        // Structured real date/time.
        sessionDate:
          selectedSlot.date,

        sessionTime:
          selectedSlot.time,

        status: 'confirmed',

        // Connect booking
        // to availability slot.
        availabilitySlotId:
          selectedSlot.id,
      });

      // Reserve slot so it
      // no longer appears available.
      await reserveAvailabilitySlot(
        selectedSlot.id,
      );

      setConfirmed(true);
    } catch (error) {
      console.log(
        'CONFIRM BOOKING ERROR:',
        error,
      );

      // Friendly duplicate/race-condition error.
      setErrorMessage(
        'This time may already be booked. Please choose another slot.',
      );
    } finally {
      setSubmitting(false);
    }
  }

  // Shared loading state.
  if (loading) {
    return (
      <ScreenState message="Loading booking..." />
    );
  }

  // Shared error state.
  if (errorMessage && !tutor) {
    return (
      <ScreenState
        title="Book Session"
        message={errorMessage}
        buttonText="Retry"
        onPress={loadBookingData}
      />
    );
  }

  // Empty state.
  if (!tutor) {
    return (
      <ScreenState message="Tutor not found." />
    );
  }

  // Success screen after booking.
  if (confirmed) {
    return (
      <View
        style={{
          flex: 1,
          padding: 20,
        }}
      >
        {/* Success banner */}
        <Banner
          type="success"
          message="Booking confirmed!"
        />

        <Text
          style={{
            fontSize: 28,
            fontWeight: '700',
          }}
        >
          Booking Confirmed
        </Text>

        <Text
          style={{
            marginTop: 16,
          }}
        >
          You booked{' '}
          {tutor.name} for{' '}
          {selectedSlot?.date} at{' '}
          {selectedSlot?.time}.
        </Text>

        {/* Navigate to bookings tab */}
        <Pressable
          onPress={() =>
            router.push(
              '/(tabs)/bookings' as any,
            )
          }
          style={{
            marginTop: 24,
            backgroundColor: 'black',
            padding: 14,
            borderRadius: 10,
          }}
        >
          <Text
            style={{
              color: 'white',
              textAlign: 'center',
              fontWeight: '600',
            }}
          >
            View My Bookings
          </Text>
        </Pressable>
      </View>
    );
  }

  // Disable button if:
  // - no slot selected
  // - currently submitting
  const confirmDisabled =
    !selectedSlot || submitting;

  return (
    <View
      style={{
        flex: 1,
        padding: 20,
      }}
    >
      {/* Inline error banner */}
      {errorMessage ? (
        <Banner
          type="error"
          message={errorMessage}
        />
      ) : null}

      {/* Page title */}
      <Text
        style={{
          fontSize: 28,
          fontWeight: '700',
        }}
      >
        Book Session
      </Text>

      {/* Tutor summary */}
      <Text
        style={{
          marginTop: 12,
          fontSize: 18,
        }}
      >
        {tutor.name}
      </Text>

      <Text
        style={{
          marginTop: 4,
        }}
      >
        {tutor.subject}
      </Text>

      {/* Availability section */}
      <Text
        style={{
          marginTop: 20,
          fontWeight: '600',
        }}
      >
        Choose an available time
      </Text>

      {/* Empty availability state */}
      {availability.length === 0 ? (
        <Text
          style={{
            marginTop: 12,
            color: '#666',
          }}
        >
          No available times for this tutor.
        </Text>
      ) : (
        availability.map((slot) => (
          <Pressable
            key={slot.id}
            onPress={() =>
              setSelectedSlot(slot)
            }
            style={{
              padding: 14,

              borderWidth: 1,

              borderColor:
                selectedSlot?.id ===
                slot.id
                  ? 'black'
                  : '#ddd',

              borderRadius: 10,

              marginTop: 10,
            }}
          >
            {/* Real session date */}
            <Text>
              {slot.date}
            </Text>

            {/* Session time */}
            <Text
              style={{
                marginTop: 4,
                color: '#666',
              }}
            >
              {slot.time}
            </Text>
          </Pressable>
        ))
      )}

      {/* Confirm booking button */}
      <Pressable
        disabled={confirmDisabled}
        onPress={
          handleConfirmBooking
        }
        style={{
          marginTop: 24,

          backgroundColor:
            confirmDisabled
              ? '#ccc'
              : 'black',

          padding: 14,

          borderRadius: 10,
        }}
      >
        <Text
          style={{
            color: 'white',
            textAlign: 'center',
            fontWeight: '600',
          }}
        >
          {submitting
            ? 'Booking...'
            : 'Confirm Booking'}
        </Text>
      </Pressable>
    </View>
  );
}