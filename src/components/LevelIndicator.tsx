import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props { label: string; percentage: number; color: string }

export const LevelIndicator = ({ label, percentage, color }: Props) => (
  <View style={styles.container}>
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.percent, { color }]}>{percentage}%</Text>
    </View>
    <View style={styles.track}>
      <View style={[styles.bar, { width: `${percentage}%`, backgroundColor: color }]} />
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { marginBottom: 18 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  label: { fontSize: 14, fontWeight: '600', color: '#374151' },
  percent: { fontSize: 14, fontWeight: 'bold' },
  track: { height: 8, backgroundColor: '#E5E7EB', borderRadius: 4, overflow: 'hidden' },
  bar: { height: '100%', borderRadius: 4 }
});