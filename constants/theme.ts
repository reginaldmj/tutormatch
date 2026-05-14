import { Platform } from 'react-native';

const tintColorLight = '#2563eb';
const tintColorDark = '#dbeafe';

export const AppTheme = {
  colors: {
    background: '#f7f8fb',
    surface: '#ffffff',
    surfaceMuted: '#f1f5f9',
    surfaceWarm: '#fff7ed',
    border: '#d9e2ec',
    borderStrong: '#b8c4d4',
    text: '#172033',
    muted: '#667085',
    subtle: '#8a94a6',
    primary: '#2563eb',
    primaryPressed: '#1d4ed8',
    primarySoft: '#e8f0ff',
    teal: '#0f766e',
    tealSoft: '#e6f5f3',
    amber: '#b45309',
    amberSoft: '#fff7ed',
    success: '#137333',
    successSoft: '#e7f8ee',
    danger: '#b3261e',
    dangerSoft: '#fdecec',
    disabled: '#cbd5e1',
    white: '#ffffff',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  radius: {
    sm: 8,
    md: 10,
    lg: 12,
    xl: 16,
    pill: 999,
  },
  typography: {
    screenTitle: 28,
    authTitle: 32,
    cardTitle: 18,
    body: 16,
    small: 13,
    caption: 12,
  },
  shadows: {
    card: {
      shadowColor: '#172033',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.08,
      shadowRadius: 18,
      elevation: 2,
    },
    soft: {
      shadowColor: '#172033',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.05,
      shadowRadius: 12,
      elevation: 1,
    },
  },
};

export const layout = {
  screenPadding: AppTheme.spacing.xl,
  maxContentWidth: 720,
};

export const Colors = {
  light: {
    text: AppTheme.colors.text,
    background: AppTheme.colors.background,
    tint: tintColorLight,
    icon: AppTheme.colors.muted,
    tabIconDefault: AppTheme.colors.subtle,
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
