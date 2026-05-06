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
  // Stores tutor rows loaded from Supabase
  const [tutors, setTutors] = useState<any[]>([]);

  // Controls first-page loading state
  const [loading, setLoading] = useState(true);

  // Controls pull-to-refresh spinner
  const [refreshing, setRefreshing] = useState(false);

  // Search text
  const [searchQuery, setSearchQuery] = useState('');

  // Price filter
  const [maxPrice, setMaxPrice] = useState<number | null>(null);

  // Rating filter
  const [minRating, setMinRating] = useState<number | null>(null);

  // Initial load when screen mounts
  useEffect(() => {
    loadTutors();
  }, []);

  // Reusable tutor loader
  async function loadTutors() {
    try {
      const data = await getTutors();

      // Save tutor data into state
      setTutors(data ?? []);
    } catch (error) {
      console.log('LOAD TUTORS ERROR:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  // Pull-to-refresh handler
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);

    await loadTutors();
  }, []);

  // Filter tutors based on search + filters
  const filteredTutors = tutors.filter((tutor) => {
    const query = searchQuery.toLowerCase();

    // Match name or subject
    const matchesSearch =
      tutor.name.toLowerCase().includes(query) ||
      tutor.subject.toLowerCase().includes(query);

    // Match price filter
    const matchesPrice =
      maxPrice === null || tutor.price <= maxPrice;

    // Match rating filter
    const matchesRating =
      minRating === null ||
      Number(tutor.rating) >= minRating;

    return (
      matchesSearch &&
      matchesPrice &&
      matchesRating
    );
  });

  // Reset all filters
  function clearFilters() {
    setSearchQuery('');
    setMaxPrice(null);
    setMinRating(null);
  }

  // First loading state
  if (loading) {
    return (
      <View style={{ flex: 1, padding: 20 }}>
        <Text>Loading tutors...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>
      {/* Page title */}
      <Text
        style={{
          fontSize: 28,
          fontWeight: '700',
          marginBottom: 16,
        }}
      >
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
      <Text
        style={{
          fontWeight: '600',
          marginBottom: 8,
        }}
      >
        Price
      </Text>

      <View
        style={{
          flexDirection: 'row',
          gap: 8,
          marginBottom: 16,
        }}
      >
        {[null, 30, 40, 50].map((price) => (
          <Pressable
            key={price ?? 'all'}
            onPress={() => setMaxPrice(price)}
            style={{
              paddingVertical: 10,
              paddingHorizontal: 14,
              borderRadius: 999,
              borderWidth: 1,
              borderColor:
                maxPrice === price
                  ? 'black'
                  : '#ddd',
              backgroundColor:
                maxPrice === price
                  ? 'black'
                  : 'white',
            }}
          >
            <Text
              style={{
                color:
                  maxPrice === price
                    ? 'white'
                    : 'black',
              }}
            >
              {price === null
                ? 'All'
                : `Under $${price}`}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Rating filter */}
      <Text
        style={{
          fontWeight: '600',
          marginBottom: 8,
        }}
      >
        Rating
      </Text>

      <View
        style={{
          flexDirection: 'row',
          gap: 8,
          marginBottom: 16,
        }}
      >
        {[null, 4.5, 4.8].map((rating) => (
          <Pressable
            key={rating ?? 'all'}
            onPress={() => setMinRating(rating)}
            style={{
              paddingVertical: 10,
              paddingHorizontal: 14,
              borderRadius: 999,
              borderWidth: 1,
              borderColor:
                minRating === rating
                  ? 'black'
                  : '#ddd',
              backgroundColor:
                minRating === rating
                  ? 'black'
                  : 'white',
            }}
          >
            <Text
              style={{
                color:
                  minRating === rating
                    ? 'white'
                    : 'black',
              }}
            >
              {rating === null
                ? 'All'
                : `${rating}+ stars`}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Clear filters */}
      <Pressable
        onPress={clearFilters}
        style={{ marginBottom: 16 }}
      >
        <Text style={{ fontWeight: '600' }}>
          Clear filters
        </Text>
      </Pressable>

      {/* Empty state */}
      {filteredTutors.length === 0 ? (
        <Text>No tutors found.</Text>
      ) : (
        <FlatList
          data={filteredTutors}
          keyExtractor={(item) => item.id}

          // Pull-to-refresh setup
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
            />
          }

          renderItem={({ item }) => (
            <TutorCard
              name={item.name}
              subject={item.subject}
              price={item.price}
              rating={item.rating}

              // Navigate to tutor profile
              onPress={() =>
                router.push(
                  `/tutor/${item.id}` as any,
                )
              }
            />
          )}
        />
      )}
    </View>
  );
}