import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';

import {
  FlatList,
  Pressable,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { AppTheme, layout } from '@/constants/theme';

import { ScreenState } from '../../src/components/ScreenState';
import { TutorCard } from '../../src/components/TutorCard';
import { getTutors } from '../../src/services/tutors';
import { Tutor } from '../../src/types/tutor';

export default function HomeScreen() {
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [minRating, setMinRating] = useState<number | null>(null);

  useEffect(() => {
    loadTutors();
  }, []);

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

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadTutors();
  }, []);

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

  function clearFilters() {
    setSearchQuery('');
    setMaxPrice(null);
    setMinRating(null);
  }

  if (loading) {
    return <ScreenState message="Loading tutors..." />;
  }

  if (errorMessage) {
    return (
      <ScreenState
        title="Find a Tutor"
        message={errorMessage}
        buttonText="Retry"
        onPress={loadTutors}
      />
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Find a Tutor</Text>

        <TextInput
          placeholder="Search by name or subject"
          placeholderTextColor={AppTheme.colors.subtle}
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
        />

        <View style={styles.filterBlock}>
          <Text style={styles.filterLabel}>Price</Text>

          <View style={styles.chipRow}>
            {[null, 30, 40, 50].map((price) => {
              const selected = maxPrice === price;

              return (
                <Pressable
                  key={price ?? 'all'}
                  onPress={() => setMaxPrice(price)}
                  style={({ pressed }) => [
                    styles.chip,
                    selected ? styles.chipSelected : null,
                    pressed ? styles.chipPressed : null,
                  ]}
                >
                  <Text
                    style={[
                      styles.chipText,
                      selected ? styles.chipTextSelected : null,
                    ]}
                  >
                    {price === null ? 'All' : `Under $${price}`}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.filterBlock}>
          <Text style={styles.filterLabel}>Rating</Text>

          <View style={styles.chipRow}>
            {[null, 4.5, 4.8].map((rating) => {
              const selected = minRating === rating;

              return (
                <Pressable
                  key={rating ?? 'all'}
                  onPress={() => setMinRating(rating)}
                  style={({ pressed }) => [
                    styles.chip,
                    selected ? styles.chipSelected : null,
                    pressed ? styles.chipPressed : null,
                  ]}
                >
                  <Text
                    style={[
                      styles.chipText,
                      selected ? styles.chipTextSelected : null,
                    ]}
                  >
                    {rating === null ? 'All' : `${rating}+ stars`}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <Pressable onPress={clearFilters} style={styles.clearButton}>
          <Text style={styles.clearButtonText}>Clear filters</Text>
        </Pressable>

        {filteredTutors.length === 0 ? (
          <ScreenState message="No tutors found." />
        ) : (
          <FlatList
            data={filteredTutors}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
            }
            renderItem={({ item }) => (
              <TutorCard
                name={item.name}
                subject={item.subject}
                price={item.price}
                rating={item.rating}
                avatarUrl={item.avatar_url}
                onPress={() => router.push(`/tutor/${item.id}` as any)}
              />
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: AppTheme.colors.background,
  },
  container: {
    flex: 1,
    width: '100%',
    maxWidth: layout.maxContentWidth,
    alignSelf: 'center',
    padding: layout.screenPadding,
  },
  title: {
    fontSize: AppTheme.typography.screenTitle,
    fontWeight: '800',
    color: AppTheme.colors.text,
    marginBottom: AppTheme.spacing.lg,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    backgroundColor: AppTheme.colors.surface,
    minHeight: 48,
    borderRadius: AppTheme.radius.md,
    paddingHorizontal: AppTheme.spacing.md,
    marginBottom: AppTheme.spacing.lg,
    color: AppTheme.colors.text,
  },
  filterBlock: {
    marginBottom: AppTheme.spacing.lg,
  },
  filterLabel: {
    color: AppTheme.colors.text,
    fontWeight: '800',
    marginBottom: AppTheme.spacing.sm,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: AppTheme.spacing.sm,
  },
  chip: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: AppTheme.radius.pill,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    backgroundColor: AppTheme.colors.surface,
  },
  chipSelected: {
    borderColor: AppTheme.colors.primary,
    backgroundColor: AppTheme.colors.primary,
  },
  chipPressed: {
    transform: [{ scale: 0.98 }],
  },
  chipText: {
    color: AppTheme.colors.text,
    fontWeight: '700',
  },
  chipTextSelected: {
    color: AppTheme.colors.white,
  },
  clearButton: {
    alignSelf: 'flex-start',
    marginBottom: AppTheme.spacing.lg,
  },
  clearButtonText: {
    color: AppTheme.colors.primary,
    fontWeight: '800',
  },
  listContent: {
    paddingBottom: AppTheme.spacing.xxl,
  },
});
