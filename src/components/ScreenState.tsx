import { Pressable, Text, View } from 'react-native';

type ScreenStateProps = {
  // Optional large heading shown above the message.
  // Example:
  // "Tutor Profile"
  title?: string;

  // Main message shown to the user.
  // Examples:
  // "Loading tutors..."
  // "No bookings yet."
  // "Could not load profile."
  message: string;

  // Optional button label.
  // Example:
  // "Retry"
  buttonText?: string;

  // Optional button action.
  // Usually used for retrying failed requests.
  onPress?: () => void;
};

export function ScreenState({
  title,
  message,
  buttonText,
  onPress,
}: ScreenStateProps) {
  // Only show button if BOTH text and action exist.
  const showButton = Boolean(
    buttonText && onPress,
  );

  return (
    <View
      style={{
        flex: 1,

        // Consistent spacing around screen states
        padding: 20,

        // Center vertically
        justifyContent: 'center',

        // Center horizontally
        alignItems: 'center',
      }}
    >
      {/* Optional title */}
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

      {/* Main message */}
      <Text
        style={{
          textAlign: 'center',
          color: '#666',

          // Add spacing below message if button exists
          marginBottom: showButton
            ? 20
            : 0,
        }}
      >
        {message}
      </Text>

      {/* Optional action button */}
      {showButton ? (
        <Pressable
          onPress={onPress}
          style={{
            backgroundColor: 'black',
            paddingVertical: 14,
            paddingHorizontal: 24,
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