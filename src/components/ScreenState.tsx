import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppTheme } from '@/constants/theme';

type ScreenStateProps = {
  title?: string;
  message: string;
  buttonText?: string;
  onPress?: () => void;
};

export function ScreenState({
  title,
  message,
  buttonText,
  onPress,
}: ScreenStateProps) {
  const showButton = Boolean(buttonText && onPress);

  return (
    <View style={styles.container}>
      {title ? <Text style={styles.title}>{title}</Text> : null}

      <Text style={[styles.message, showButton ? styles.messageWithButton : null]}>
        {message}
      </Text>

      {showButton ? (
        <Pressable
          onPress={onPress}
          style={({ pressed }) => [
            styles.button,
            pressed ? styles.buttonPressed : null,
          ]}
        >
          <Text style={styles.buttonText}>{buttonText}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: AppTheme.spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: AppTheme.colors.background,
  },
  title: {
    fontSize: AppTheme.typography.screenTitle,
    fontWeight: '800',
    marginBottom: AppTheme.spacing.md,
    textAlign: 'center',
    color: AppTheme.colors.text,
  },
  message: {
    textAlign: 'center',
    color: AppTheme.colors.muted,
    lineHeight: 22,
    maxWidth: 360,
  },
  messageWithButton: {
    marginBottom: AppTheme.spacing.xl,
  },
  button: {
    backgroundColor: AppTheme.colors.primary,
    paddingVertical: 14,
    paddingHorizontal: AppTheme.spacing.xxl,
    borderRadius: AppTheme.radius.md,
    minWidth: 132,
  },
  buttonPressed: {
    backgroundColor: AppTheme.colors.primaryPressed,
    transform: [{ scale: 0.99 }],
  },
  buttonText: {
    color: AppTheme.colors.white,
    textAlign: 'center',
    fontWeight: '700',
  },
});
