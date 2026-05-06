import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  TextInput,
  View,
} from 'react-native';

import { TutorCard } from '../../src/components/TutorCard';
import { getTutors } from '../../src/services/tutors';

export default function HomeScreen() {
  // Tutor rows loaded from Supabase
  const [tutors, setTutors] = useState<any[]>([]);

  // First-load spinner state
  const [loading, setLoading] = useState(true);

  // Pull-to-refresh spinner state
  const [refreshing, setRefreshing] = useState(false);

  // User-facing error message
  const [errorMessage, setErrorMessage] = useState('');

  // Search/filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [minRating, setMinRating] = useState<number | null>(null);

  // Load tutors when the Home screen first mounts
  useEffect(() => {
    loadTutors();
  }, []);

  // Fetch tutors from Supabase
  async function loadTutors() {
    try {
      setErrorMessage('');

      const data = await getTutors();
      setTutors(data ?? []);
    } catch (error) {
      console.log('LOAD TUTORS ERROR:', error);
      setErrorMessage('Could not load tutors. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  // Pull-to-refresh action
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadTutors();
  }, []);

  // Apply search, price, and rating filters
  const filteredTutors = tutors.filter((tutor) => {
    const query = searchQuery.toLowerCase();

    const matchesSearch =
      tutor.name.toLowerCase().includes(query) ||
      tutor.subject.toLowerCase().includes(query);

    const matchesPrice = maxPrice === null || tutor.price <= maxPrice;

    const matchesRating =
      minRating === null || Number(tutor.rating) >= minRating;

    return matchesSearch && matchesPrice && matchesRating;
  });

  // Reset all filters to default
  function clearFilters() {
    setSearchQuery('');
    setMaxPrice(null);
    setMinRating(null);
  }

  // Initial loading state
  if (loading) {
    return (
      <View style={{ flex: 1, padding: 20 }}>
        <Text>Loading tutors...</Text>
      </View>
    );
  }

  // Error state with retry action
  if (errorMessage) {
    return (
      <View style={{ flex: 1, padding: 20 }}>
        <Text style={{ fontSize: 28, fontWeight: '700', marginBottom: 16 }}>
          Find a Tutor
        </Text>

        <Text style={{ marginBottom: 16 }}>{errorMessage}</Text>

        <Pressable
          onPress={loadTutors}
          style={{
            backgroundColor: 'black',
            padding: 14,
            borderRadius: 10,
          }}
        >
          <Text style={{ color: 'white', textAlign: 'center', fontWeight: '600' }}>
            Retry
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>
      {/* Page title */}
      <Text style={{ fontSize: 28, fontWeight: '700', marginBottom: 16 }}>
        Find a Tutor
      </Text>

      {/* Search input */}
      <TextInput
        placeholder="Search by name or subject..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={{
          borderWidth: 1,
          borderColor: '#ddd',
          borderRadius: 10,
          padding: 12,
          marginBottom: 12,
        }}
      />

      {/* Price filter */}
      <Text style={{ fontWeight: '600', marginBottom: 8 }}>Price</Text>

      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
        {[null, 30, 40, 50].map((price) => (
          <Pressable
            key={price ?? 'all'}
            onPress={() => setMaxPrice(price)}
            style={{
              paddingVertical: 10,
              paddingHorizontal: 14,
              borderRadius: 999,
              borderWidth: 1,
              borderColor: maxPrice === price ? 'black' : '#ddd',
              backgroundColor: maxPrice === price ? 'black' : 'white',
            }}
          >
            <Text style={{ color: maxPrice === price ? 'white' : 'black' }}>
              {price === null ? 'All' : `Under $${price}`}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Rating filter */}
      <Text style={{ fontWeight: '600', marginBottom: 8 }}>Rating</Text>

      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
        {[null, 4.5, 4.8].map((rating) => (
          <Pressable
            key={rating ?? 'all'}
            onPress={() => setMinRating(rating)}
            style={{
              paddingVertical: 10,
              paddingHorizontal: 14,
              borderRadius: 999,
              borderWidth: 1,
              borderColor: minRating === rating ? 'black' : '#ddd',
              backgroundColor: minRating === rating ? 'black' : 'white',
            }}
          >
            <Text style={{ color: minRating === rating ? 'white' : 'black' }}>
              {rating === null ? 'All' : `${rating}+ stars`}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Reset filters */}
      <Pressable onPress={clearFilters} style={{ marginBottom: 16 }}>
        <Text style={{ fontWeight: '600' }}>Clear filters</Text>
      </Pressable>

      {/* Tutor results */}
      {filteredTutors.length === 0 ? (
        <Text>No tutors found.</Text>
      ) : (
        <FlatList
          data={filteredTutors}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          renderItem={({ item }) => (
            <TutorCard
              name={item.name}
              subject={item.subject}
              price={item.price}
              rating={item.rating}
              onPress={() => router.push(`/tutor/${item.id}` as any)}
            />
          )}
        />
      )}
    </View>
  );
}