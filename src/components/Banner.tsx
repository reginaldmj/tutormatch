import { StyleSheet, Text, View } from 'react-native';

import { AppTheme } from '@/constants/theme';

type BannerProps = {
  type: 'success' | 'error' | 'info';
  message: string;
};

const toneStyles = {
  success: {
    backgroundColor: AppTheme.colors.successSoft,
    borderColor: '#bde8cc',
    color: AppTheme.colors.success,
  },
  error: {
    backgroundColor: AppTheme.colors.dangerSoft,
    borderColor: '#f4b8b0',
    color: AppTheme.colors.danger,
  },
  info: {
    backgroundColor: AppTheme.colors.primarySoft,
    borderColor: '#bfd2ff',
    color: AppTheme.colors.primary,
  },
};

export function Banner({ type, message }: BannerProps) {
  const tone = toneStyles[type];

  return (
    <View
      style={[
        styles.banner,
        {
          backgroundColor: tone.backgroundColor,
          borderColor: tone.borderColor,
        },
      ]}
    >
      <Text style={[styles.message, { color: tone.color }]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    padding: AppTheme.spacing.md,
    borderRadius: AppTheme.radius.lg,
    borderWidth: 1,
    marginBottom: AppTheme.spacing.lg,
  },
  message: {
    fontWeight: '700',
    textAlign: 'center',
  },
});
