import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useNotificaciones } from '@/src/hooks/useNotificaciones';

export const NotificationBell = ({ color = '#1F2937' }: { color?: string }) => {
  const router = useRouter();
  const { unreadCount } = useNotificaciones();

  return (
    <TouchableOpacity 
      style={styles.iconBtn} 
      onPress={() => router.push('/notificaciones')}
    >
      <MaterialCommunityIcons name="bell-outline" size={24} color={color} />
      {unreadCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  iconBtn: { 
    padding: 8, 
    backgroundColor: '#F3F4F6', 
    borderRadius: 12,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center'
  },
  badge: { 
    position: 'absolute', 
    top: 2, 
    right: 2, 
    backgroundColor: '#EF4444', 
    borderRadius: 10, 
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5, 
    borderColor: '#fff',
    paddingHorizontal: 2
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  }
});
