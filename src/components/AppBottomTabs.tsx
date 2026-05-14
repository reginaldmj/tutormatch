import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router, usePathname } from 'expo-router';
import { ComponentProps } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppTheme } from '@/constants/theme';

import { useChat } from '../context/ChatContext';

type TabKey = 'home' | 'bookings' | 'messages' | 'profile';

const tabs: {
  key: TabKey;
  label: string;
  icon: ComponentProps<typeof MaterialIcons>['name'];
  route: string;
}[] = [
  {
    key: 'home',
    label: 'Home',
    icon: 'home',
    route: '/(tabs)',
  },
  {
    key: 'bookings',
    label: 'Bookings',
    icon: 'event-note',
    route: '/(tabs)/bookings',
  },
  {
    key: 'messages',
    label: 'Messages',
    icon: 'chat-bubble-outline',
    route: '/(tabs)/messages',
  },
  {
    key: 'profile',
    label: 'Profile',
    icon: 'person-outline',
    route: '/(tabs)/profile',
  },
];

function getActiveTab(pathname: string): TabKey {
  if (pathname.startsWith('/booking') || pathname.startsWith('/bookings')) {
    return 'bookings';
  }

  if (pathname.startsWith('/chat') || pathname.startsWith('/messages')) {
    return 'messages';
  }

  if (pathname.startsWith('/profile')) {
    return 'profile';
  }

  return 'home';
}

export function AppBottomTabs() {
  const pathname = usePathname();
  const activeTab = getActiveTab(pathname);
  const { unreadCount } = useChat();

  return (
    <View style={styles.tabBar}>
      {tabs.map((tab) => {
        const active = activeTab === tab.key;
        const color = active ? AppTheme.colors.primary : AppTheme.colors.subtle;
        const showBadge = tab.key === 'messages' && unreadCount > 0;

        return (
          <Pressable
            key={tab.key}
            onPress={() => router.replace(tab.route as any)}
            style={({ pressed }) => [
              styles.tabItem,
              pressed ? styles.tabItemPressed : null,
            ]}
          >
            <View>
              <MaterialIcons color={color} name={tab.icon} size={24} />
              {showBadge ? (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{unreadCount}</Text>
                </View>
              ) : null}
            </View>

            <Text style={[styles.tabLabel, { color }]}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: AppTheme.colors.border,
    backgroundColor: AppTheme.colors.surface,
    paddingTop: AppTheme.spacing.sm,
    paddingBottom: AppTheme.spacing.sm,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  tabItemPressed: {
    opacity: 0.72,
  },
  tabLabel: {
    fontSize: AppTheme.typography.caption,
    fontWeight: '700',
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -10,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppTheme.colors.danger,
    paddingHorizontal: 4,
  },
  badgeText: {
    color: AppTheme.colors.white,
    fontSize: 10,
    fontWeight: '800',
  },
});
