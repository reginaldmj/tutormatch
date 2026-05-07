import { Text, View } from 'react-native';

type BannerProps = {
  type: 'success' | 'error' | 'info';
  message: string;
};

export function Banner({ type, message }: BannerProps) {
  const backgroundColor =
    type === 'success' ? '#e7f8ee' : type === 'error' ? '#fdecec' : '#eef3ff';

  const textColor =
    type === 'success' ? '#137333' : type === 'error' ? '#b3261e' : '#1a4fb7';

  return (
    <View
      style={{
        padding: 12,
        borderRadius: 12,
        backgroundColor,
        marginBottom: 16,
      }}
    >
      <Text
        style={{
          color: textColor,
          fontWeight: '600',
          textAlign: 'center',
        }}
      >
        {message}
      </Text>
    </View>
  );
}