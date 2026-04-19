import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export const HeaderHome = () => (
  <View style={styles.header}>
    <View>
      <Text style={styles.greeting}>Hola, Max 👋</Text>
      <Text style={styles.date}>Hoy, 20 de Mayo</Text>
    </View>
    <View style={styles.actions}>
      <TouchableOpacity style={styles.iconBtn}>
        <MaterialCommunityIcons name="bell-outline" size={24} color="#1F2937" />
        <View style={styles.badge} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.iconBtn}>
        <MaterialCommunityIcons name="account-circle-outline" size={26} color="#1F2937" />
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
  greeting: { fontSize: 24, fontWeight: 'bold', color: '#111827' },
  date: { fontSize: 14, color: '#6B7280' },
  actions: { flexDirection: 'row', gap: 12 },
  iconBtn: { padding: 8, backgroundColor: '#F3F4F6', borderRadius: 12 },
  badge: { position: 'absolute', top: 8, right: 8, width: 8, height: 8, backgroundColor: '#EF4444', borderRadius: 4, borderWidth: 1, borderColor: '#fff' }
});