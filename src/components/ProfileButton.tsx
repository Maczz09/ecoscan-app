import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export const ProfileButton = ({ color = '#1F2937' }: { color?: string }) => {
  const router = useRouter();

  return (
    <TouchableOpacity 
      style={styles.iconBtn} 
      onPress={() => router.push('/perfil')}
      activeOpacity={0.7}
    >
      <MaterialCommunityIcons name="account-circle-outline" size={26} color={color} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  iconBtn: { 
    padding: 8, 
    backgroundColor: '#F3F4F6', 
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.05, 
    shadowRadius: 5
  }
});
