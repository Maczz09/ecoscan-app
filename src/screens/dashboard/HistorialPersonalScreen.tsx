import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Platform, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useDashboard } from '@/src/hooks/useDashboard';

export const HistorialPersonalScreen = () => {
  const router = useRouter();
  const { historial, loading } = useDashboard();

  // Fechas reales
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    return d;
  });
  const [endDate, setEndDate] = useState(new Date());

  // Fechas temporales para iOS
  const [tempStart, setTempStart] = useState(startDate);
  const [tempEnd, setTempEnd] = useState(endDate);

  const [showStart, setShowStart] = useState(false);
  const [showEnd, setShowEnd] = useState(false);

  const filteredHistorial = useMemo(() => {
    if (!historial) return [];
    
    const startOfDay = new Date(startDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(endDate);
    endOfDay.setHours(23, 59, 59, 999);

    return historial.filter(item => {
      const itemDate = new Date(item.iso_date);
      return itemDate >= startOfDay && itemDate <= endOfDay;
    });
  }, [historial, startDate, endDate]);

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#10B981" />
      </SafeAreaView>
    );
  }

  const getIconForType = (type: string) => {
    switch(type) {
      case 'Plastico': return { name: 'bottle-soda-outline', color: '#3B82F6', bg: '#DBEAFE' };
      case 'Papel': return { name: 'newspaper-variant-outline', color: '#F59E0B', bg: '#FEF3C7' };
      case 'Vidrio': return { name: 'glass-fragile', color: '#8B5CF6', bg: '#EDE9FE' };
      default: return { name: 'recycle', color: '#6B7280', bg: '#F3F4F6' };
    }
  };

  const renderDatePicker = (type: 'start' | 'end') => {
    const isStart = type === 'start';
    const show = isStart ? showStart : showEnd;
    
    // Android handle auto close
    const onChange = (event: any, selectedDate?: Date) => {
      if (Platform.OS === 'android') {
        isStart ? setShowStart(false) : setShowEnd(false);
        if (selectedDate) isStart ? setStartDate(selectedDate) : setEndDate(selectedDate);
      } else {
        // iOS solo guarda temporalmente
        if (selectedDate) isStart ? setTempStart(selectedDate) : setTempEnd(selectedDate);
      }
    };

    if (!show) return null;

    if (Platform.OS === 'android') {
      return (
        <DateTimePicker
          value={isStart ? startDate : endDate}
          mode="date"
          display="default"
          minimumDate={!isStart ? startDate : undefined}
          onChange={onChange}
        />
      );
    }

    // Modal Premium para iOS
    return (
      <Modal visible={show} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => {
                isStart ? setTempStart(startDate) : setTempEnd(endDate);
                isStart ? setShowStart(false) : setShowEnd(false);
              }}>
                <Text style={styles.modalCancelBtn}>Cancelar</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>{isStart ? 'Fecha Inicio' : 'Fecha Fin'}</Text>
              <TouchableOpacity onPress={() => {
                isStart ? setStartDate(tempStart) : setEndDate(tempEnd);
                isStart ? setShowStart(false) : setShowEnd(false);
              }}>
                <Text style={styles.modalConfirmBtn}>Listo</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.pickerContainer}>
              <DateTimePicker
                value={isStart ? tempStart : tempEnd}
                mode="date"
                display="inline"
                minimumDate={!isStart ? startDate : undefined}
                onChange={onChange}
                themeVariant="light"
              />
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Historial Completo</Text>
        <View style={{ width: 44 }} />
      </View>

      {/* FILTER CONTROLS (CALENDAR) */}
      <View style={styles.filterSection}>
        <Text style={styles.filterLabel}>Rango de Fechas:</Text>
        
        <View style={styles.dateRow}>
          <TouchableOpacity style={styles.dateBtn} onPress={() => setShowStart(true)}>
            <View style={[styles.iconBox, { backgroundColor: '#ECFDF5' }]}>
              <MaterialCommunityIcons name="calendar-start" size={20} color="#10B981" />
            </View>
            <View>
              <Text style={styles.dateLabel}>Desde</Text>
              <Text style={styles.dateValue}>{startDate.toLocaleDateString('es-ES')}</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.separator}>
            <MaterialCommunityIcons name="chevron-right" size={20} color="#9CA3AF" />
          </View>

          <TouchableOpacity style={styles.dateBtn} onPress={() => setShowEnd(true)}>
            <View style={[styles.iconBox, { backgroundColor: '#FEF2F2' }]}>
              <MaterialCommunityIcons name="calendar-end" size={20} color="#EF4444" />
            </View>
            <View>
              <Text style={styles.dateLabel}>Hasta</Text>
              <Text style={styles.dateValue}>{endDate.toLocaleDateString('es-ES')}</Text>
            </View>
          </TouchableOpacity>
        </View>

        {renderDatePicker('start')}
        {renderDatePicker('end')}
      </View>

      {/* LIST */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.historyList}>
          {filteredHistorial.length === 0 ? (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons name="calendar-blank-outline" size={48} color="#D1D5DB" />
              <Text style={styles.emptyText}>No hay registros en estas fechas.</Text>
            </View>
          ) : (
            filteredHistorial.map((item) => {
              const iconData = getIconForType(item.tipo_residuo);
              return (
                <View key={item.id_registro} style={styles.historyItem}>
                  <View style={[styles.historyIconBox, { backgroundColor: iconData.bg }]}>
                    <MaterialCommunityIcons name={iconData.name as any} size={26} color={iconData.color} />
                  </View>
                  <View style={styles.historyDetails}>
                    <Text style={styles.historyType}>{item.tipo_residuo}</Text>
                    <Text style={styles.historyDate}>{item.fecha_escaneo}</Text>
                  </View>
                  <View style={styles.historyStats}>
                    <Text style={styles.historyWeight}>{item.cantidad} {item.cantidad === 1 ? 'unidad' : 'uds'}</Text>
                    <Text style={styles.historyPoints}>+{item.puntos_ganados} pts</Text>
                  </View>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  center: { justifyContent: 'center', alignItems: 'center' },
  
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 20, 
    paddingVertical: Platform.OS === 'android' ? 15 : 10,
    backgroundColor: '#F3F4F6',
  },
  backBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  headerTitle: { fontSize: 20, fontWeight: '900', color: '#111827', letterSpacing: -0.5 },
  
  filterSection: { paddingHorizontal: 20, paddingBottom: 15 },
  filterLabel: { fontSize: 14, fontWeight: '700', color: '#6B7280', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 },
  dateRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFF', borderRadius: 24, padding: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.04, shadowRadius: 10, elevation: 3 },
  dateBtn: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  iconBox: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  dateLabel: { fontSize: 11, color: '#9CA3AF', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 0.5 },
  dateValue: { fontSize: 15, fontWeight: '900', color: '#111827', marginTop: 2 },
  separator: { marginHorizontal: 10 },

  /* MODAL IOS STYLES */
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingBottom: Platform.OS === 'ios' ? 40 : 20, shadowColor: '#000', shadowOffset: { width: 0, height: -5 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  modalCancelBtn: { fontSize: 16, color: '#6B7280', fontWeight: '600' },
  modalConfirmBtn: { fontSize: 16, color: '#10B981', fontWeight: '900' },
  modalTitle: { fontSize: 16, fontWeight: 'bold', color: '#111827' },
  pickerContainer: { alignItems: 'center', paddingTop: 10 },

  scrollContent: { padding: 20, paddingBottom: 40 },
  
  historyList: { backgroundColor: '#FFFFFF', borderRadius: 28, padding: 25, shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.04, shadowRadius: 15, elevation: 4 },
  historyItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  historyIconBox: { width: 54, height: 54, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  historyDetails: { flex: 1 },
  historyType: { fontSize: 17, fontWeight: '900', color: '#111827', marginBottom: 4 },
  historyDate: { fontSize: 13, color: '#6B7280', fontWeight: '500' },
  historyStats: { alignItems: 'flex-end' },
  historyWeight: { fontSize: 16, fontWeight: '900', color: '#374151', marginBottom: 4 },
  historyPoints: { fontSize: 14, fontWeight: 'bold', color: '#10B981' },

  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 40 },
  emptyText: { marginTop: 15, fontSize: 15, color: '#9CA3AF', fontWeight: '600' }
});
