import { Image } from 'expo-image';
import { Platform, StyleSheet } from 'react-native';

import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';
import { FlatList, Text, View } from 'react-native';
import { TutorCard } from '../../src/components/TutorCard';
import { router } from 'expo-router';



const tutors = [
  { id: '1', name: 'John Doe', subject: 'Math', price: 50, rating: 4.5 },
  { id: '2', name: 'Jane Smith', subject: 'Science', price: 60, rating: 4.8 },
  { id: '3', name: 'Bob Johnson', subject: 'History', price: 45, rating: 4.2 },
];

export default function HomeScreen() {
  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 28, fontWeight: '700', marginBottom: 16 }}>
        Find a Tutor
      </Text>

      <FlatList
        data={tutors}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TutorCard
            name={item.name}
            subject={item.subject}
            price={item.price}
            rating={item.rating}
            onPress={() => router.push(`/tutor/${item.id}`)}
          />
        )}
      />
    </View>
  );
}