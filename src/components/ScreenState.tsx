import { Pressable, Text, View } from 'react-native';

type ScreenStateProps = {
  title?: string;
  message: string;
  buttonText?: string;
  onPress?: () => void;
};

// Reusable screen state component for loading, error, and empty states
export function ScreenState({
  title,
  message,
  buttonText,
  onPress,
}: ScreenStateProps) {
  return (
    <View style={{ flex: 1, padding: 20, justifyContent: 'center' }}>
      {title ? (
        <Text
          style={{
            fontSize: 28,
            fontWeight: '700',
            marginBottom: 12,
            textAlign: 'center',
          }}
        >
          {title}
        </Text>
      ) : null}

      <Text
        style={{
          textAlign: 'center',
          color: '#666',
          marginBottom: buttonText ? 20 : 0,
        }}
      >
        {message}
      </Text>

      {buttonText && onPress ? (
        <Pressable
          onPress={onPress}
          style={{
            backgroundColor: 'black',
            padding: 14,
            borderRadius: 12,
          }}
        >
          <Text
            style={{
              color: 'white',
              textAlign: 'center',
              fontWeight: '600',
            }}
          >
            {buttonText}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}