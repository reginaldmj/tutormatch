import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { AppTheme } from '@/constants/theme';

type TutorCardProps = {
  name: string;
  subject: string;
  price: number;
  rating: number;
  avatarUrl?: string | null;
  onPress: () => void;
};

export function TutorCard({
  name,
  subject,
  price,
  rating,
  avatarUrl,
  onPress,
}: TutorCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        pressed ? styles.cardPressed : null,
      ]}
    >
      <Image
        source={{
          uri:
            avatarUrl ??
            `https://api.dicebear.com/7.x/initials/png?seed=${encodeURIComponent(
              name,
            )}`,
        }}
        style={styles.avatar}
      />

      <View style={styles.content}>
        <Text numberOfLines={1} style={styles.name}>
          {name}
        </Text>

        <Text numberOfLines={1} style={styles.subject}>
          {subject}
        </Text>

        <View style={styles.metaRow}>
          <Text style={styles.price}>${price}/hour</Text>
          <Text style={styles.rating}>Rating {rating}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    gap: AppTheme.spacing.md,
    padding: AppTheme.spacing.lg,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    borderRadius: AppTheme.radius.lg,
    marginBottom: AppTheme.spacing.md,
    backgroundColor: AppTheme.colors.surface,
    ...AppTheme.shadows.soft,
  },
  cardPressed: {
    borderColor: AppTheme.colors.primary,
    backgroundColor: AppTheme.colors.primarySoft,
    transform: [{ scale: 0.99 }],
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: AppTheme.colors.surfaceMuted,
  },
  content: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    fontSize: AppTheme.typography.cardTitle,
    fontWeight: '700',
    color: AppTheme.colors.text,
  },
  subject: {
    marginTop: AppTheme.spacing.xs,
    color: AppTheme.colors.muted,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: AppTheme.spacing.sm,
    marginTop: AppTheme.spacing.md,
  },
  price: {
    color: AppTheme.colors.teal,
    fontWeight: '700',
  },
  rating: {
    color: AppTheme.colors.amber,
    fontWeight: '600',
  },
});
