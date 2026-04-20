import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NotificationBell } from '@/src/components/NotificationBell';
import { ProfileButton } from '@/src/components/ProfileButton';
import { useDashboard } from '@/src/hooks/useDashboard';
import { SidebarMenu } from '@/src/components/SidebarMenu';

export const DashboardScreen = () => {
  const { metricas, historial, loading } = useDashboard();
  const [menuVisible, setMenuVisible] = useState(false);

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#10B981" />
      </View>
    );
  }

  const getTotalKg = () => {
    if (!metricas) return 0;
    return (metricas.kg_plastico + metricas.kg_papel + metricas.kg_organico + metricas.kg_vidrio).toFixed(1);
  };

  const getIconForType = (type: string) => {
    switch(type) {
      case 'Plastico': return { name: 'bottle-soda-outline', color: '#3B82F6', bg: '#DBEAFE' };
      case 'Papel': return { name: 'newspaper-variant-outline', color: '#F59E0B', bg: '#FEF3C7' };
      case 'Vidrio': return { name: 'glass-fragile', color: '#8B5CF6', bg: '#EDE9FE' };
      case 'Organico': return { name: 'leaf', color: '#10B981', bg: '#D1FAE5' };
      default: return { name: 'recycle', color: '#6B7280', bg: '#F3F4F6' };
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* HEADER */}
        <View style={styles.header}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <TouchableOpacity onPress={() => setMenuVisible(true)} style={styles.menuBtn}>
              <MaterialCommunityIcons name="menu" size={28} color="#111827" />
            </TouchableOpacity>
            <View>
              <Text style={styles.headerSubtitle}>Tus Estadísticas</Text>
              <Text style={styles.headerTitle}>Mi Impacto</Text>
            </View>
          </View>
          <View style={styles.actions}>
            <NotificationBell />
            <ProfileButton />
          </View>
        </View>

        {/* HUELLA DE CARBONO Y PUNTOS MAIN CARD */}
            <View style={styles.impactCard}>
              <View style={styles.impactHeader}>
                <MaterialCommunityIcons name="earth" size={28} color="#10B981" />
                <Text style={styles.impactTitle}>Impacto Positivo</Text>
              </View>
              <View style={styles.impactContent}>
                <View style={styles.impactItem}>
                  <Text style={styles.impactValue}>{metricas?.huella_carbono_ahorrada} kg</Text>
                  <Text style={styles.impactLabel}>CO2 Ahorrado</Text>
                </View>
                <View style={styles.dividerVertical} />
                <View style={styles.impactItem}>
                  <Text style={styles.impactValue}>{getTotalKg()} kg</Text>
                  <Text style={styles.impactLabel}>Total Reciclado</Text>
                </View>
              </View>
            </View>

            {/* DESGLOSE DE RECICLAJE */}
            <Text style={styles.sectionTitle}>Desglose por Material</Text>
            <View style={styles.materialsGrid}>
              <View style={styles.materialBox}>
                <View style={[styles.materialIcon, { backgroundColor: '#DBEAFE' }]}>
                  <MaterialCommunityIcons name="bottle-soda-outline" size={24} color="#3B82F6" />
                </View>
                <Text style={styles.materialValue}>{metricas?.kg_plastico} kg</Text>
                <Text style={styles.materialLabel}>Plástico</Text>
              </View>
              
              <View style={styles.materialBox}>
                <View style={[styles.materialIcon, { backgroundColor: '#FEF3C7' }]}>
                  <MaterialCommunityIcons name="newspaper-variant-outline" size={24} color="#F59E0B" />
                </View>
                <Text style={styles.materialValue}>{metricas?.kg_papel} kg</Text>
                <Text style={styles.materialLabel}>Papel</Text>
              </View>
              
              <View style={styles.materialBox}>
                <View style={[styles.materialIcon, { backgroundColor: '#D1FAE5' }]}>
                  <MaterialCommunityIcons name="leaf" size={24} color="#10B981" />
                </View>
                <Text style={styles.materialValue}>{metricas?.kg_organico} kg</Text>
                <Text style={styles.materialLabel}>Orgánico</Text>
              </View>
              
              <View style={styles.materialBox}>
                <View style={[styles.materialIcon, { backgroundColor: '#EDE9FE' }]}>
                  <MaterialCommunityIcons name="glass-fragile" size={24} color="#8B5CF6" />
                </View>
                <Text style={styles.materialValue}>{metricas?.kg_vidrio} kg</Text>
                <Text style={styles.materialLabel}>Vidrio</Text>
              </View>
            </View>

            {/* HISTORIAL RECIENTE */}
            <View style={styles.historyHeader}>
              <Text style={styles.sectionTitle}>Reciclaje Reciente</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>Ver todo</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.historyContainer}>
              {historial.map((item) => {
                const iconData = getIconForType(item.tipo_residuo);
                return (
                  <View key={item.id_registro} style={styles.historyItem}>
                    <View style={[styles.historyIconBox, { backgroundColor: iconData.bg }]}>
                      <MaterialCommunityIcons name={iconData.name as any} size={24} color={iconData.color} />
                    </View>
                    <View style={styles.historyDetails}>
                      <Text style={styles.historyType}>{item.tipo_residuo}</Text>
                      <Text style={styles.historyDate}>{item.fecha_escaneo}</Text>
                    </View>
                    <View style={styles.historyStats}>
                      <Text style={styles.historyWeight}>{item.peso_kg} kg</Text>
                      <Text style={styles.historyPoints}>+{item.puntos_ganados} pts</Text>
                    </View>
                  </View>
                );
              })}
            </View>


      </ScrollView>

      <SidebarMenu visible={menuVisible} onClose={() => setMenuVisible(false)} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { padding: 20, paddingBottom: 100 },
  
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
  menuBtn: { padding: 8, backgroundColor: '#F3F4F6', borderRadius: 12 },
  headerSubtitle: { fontSize: 13, color: '#6B7280', textTransform: 'uppercase', letterSpacing: 1 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#111827', marginTop: 2 },
  actions: { flexDirection: 'row', gap: 12 },

  impactCard: {
    backgroundColor: '#111827',
    borderRadius: 24,
    padding: 24,
    marginBottom: 30,
    shadowColor: '#111827',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 8,
  },
  impactHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, gap: 10 },
  impactTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFFFFF' },
  impactContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  impactItem: { flex: 1, alignItems: 'center' },
  impactValue: { fontSize: 26, fontWeight: '900', color: '#10B981', marginBottom: 4 },
  impactLabel: { fontSize: 13, color: '#9CA3AF' },
  dividerVertical: { width: 1, height: 40, backgroundColor: '#374151', marginHorizontal: 15 },

  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827', marginBottom: 15 },
  
  materialsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 15, marginBottom: 30 },
  materialBox: {
    flex: 1, minWidth: '40%', backgroundColor: '#FFFFFF', borderRadius: 20,
    padding: 16, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05, shadowRadius: 10, elevation: 2,
  },
  materialIcon: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  materialValue: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  materialLabel: { fontSize: 13, color: '#6B7280', marginTop: 4 },

  historyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  seeAllText: { color: '#10B981', fontWeight: 'bold', fontSize: 14 },
  
  historyContainer: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 },
  historyItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  historyIconBox: { width: 50, height: 50, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  historyDetails: { flex: 1 },
  historyType: { fontSize: 16, fontWeight: 'bold', color: '#111827', marginBottom: 4 },
  historyDate: { fontSize: 12, color: '#6B7280' },
  historyStats: { alignItems: 'flex-end' },
  historyWeight: { fontSize: 14, fontWeight: 'bold', color: '#374151', marginBottom: 4 },
  historyPoints: { fontSize: 14, fontWeight: 'bold', color: '#10B981' }
});
