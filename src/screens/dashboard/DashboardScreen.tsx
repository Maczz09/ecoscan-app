import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { NotificationBell } from '@/src/components/NotificationBell';
import { ProfileButton } from '@/src/components/ProfileButton';
import { useDashboard } from '@/src/hooks/useDashboard';
import { SidebarMenu } from '@/src/components/SidebarMenu';

export const DashboardScreen = () => {
  const { metricas, historial, loading } = useDashboard();
  const [menuVisible, setMenuVisible] = useState(false);
  const router = useRouter();

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#10B981" />
      </View>
    );
  }

  const getTotalUnidades = () => {
    if (!metricas) return 0;
    return metricas.cantidad_plastico + metricas.cantidad_papel + metricas.cantidad_vidrio;
  };

  const getIconForType = (type: string) => {
    switch(type) {
      case 'Plastico': return { name: 'bottle-soda-outline', color: '#3B82F6', bg: '#DBEAFE' };
      case 'Papel': return { name: 'newspaper-variant-outline', color: '#F59E0B', bg: '#FEF3C7' };
      case 'Vidrio': return { name: 'glass-fragile', color: '#8B5CF6', bg: '#EDE9FE' };
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
                  <Text style={styles.impactValue}>{getTotalUnidades()}</Text>
                  <Text style={styles.impactLabel}>Objetos Reciclados</Text>
                </View>
              </View>
            </View>

            {/* DESGLOSE DE RECICLAJE */}
            <Text style={styles.sectionTitle}>Desglose por Material</Text>
            <View style={styles.materialsGrid}>
              <View style={styles.materialBox}>
                <View style={[styles.materialIcon, { backgroundColor: '#DBEAFE' }]}>
                  <MaterialCommunityIcons name="bottle-soda-outline" size={28} color="#3B82F6" />
                </View>
                <Text style={styles.materialValue}>{metricas?.cantidad_plastico} uds</Text>
                <Text style={styles.materialLabel}>Plástico</Text>
              </View>
              
              <View style={styles.materialBox}>
                <View style={[styles.materialIcon, { backgroundColor: '#FEF3C7' }]}>
                  <MaterialCommunityIcons name="newspaper-variant-outline" size={28} color="#F59E0B" />
                </View>
                <Text style={styles.materialValue}>{metricas?.cantidad_papel} uds</Text>
                <Text style={styles.materialLabel}>Papel</Text>
              </View>
              
              <View style={styles.materialBox}>
                <View style={[styles.materialIcon, { backgroundColor: '#EDE9FE' }]}>
                  <MaterialCommunityIcons name="glass-fragile" size={28} color="#8B5CF6" />
                </View>
                <Text style={styles.materialValue}>{metricas?.cantidad_vidrio} uds</Text>
                <Text style={styles.materialLabel}>Vidrio</Text>
              </View>
            </View>

            {/* HISTORIAL RECIENTE */}
            <View style={styles.historyHeader}>
              <Text style={styles.sectionTitle}>Reciclaje Reciente</Text>
              <TouchableOpacity onPress={() => router.push('/historial')}>
                <Text style={styles.seeAllText}>Ver todo</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.historyContainer}>
              {historial.slice(0, 3).map((item) => {
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
              })}
            </View>


      </ScrollView>

      <SidebarMenu visible={menuVisible} onClose={() => setMenuVisible(false)} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { padding: 20, paddingBottom: 100 },
  
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
  menuBtn: { padding: 10, backgroundColor: '#FFF', borderRadius: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  headerSubtitle: { fontSize: 13, color: '#6B7280', textTransform: 'uppercase', letterSpacing: 1, fontWeight: '700' },
  headerTitle: { fontSize: 26, fontWeight: '900', color: '#111827', marginTop: 2, letterSpacing: -0.5 },
  actions: { flexDirection: 'row', gap: 12 },

  impactCard: {
    backgroundColor: '#111827',
    borderRadius: 28,
    padding: 24,
    marginBottom: 35,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  impactHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, gap: 10 },
  impactTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFFFFF' },
  impactContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  impactItem: { flex: 1, alignItems: 'center' },
  impactValue: { fontSize: 28, fontWeight: '900', color: '#10B981', marginBottom: 4 },
  impactLabel: { fontSize: 13, color: '#9CA3AF', fontWeight: '500' },
  dividerVertical: { width: 1, height: 40, backgroundColor: '#374151', marginHorizontal: 15 },

  sectionTitle: { fontSize: 20, fontWeight: '900', color: '#111827', marginBottom: 15, letterSpacing: -0.3 },
  
  materialsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 35 },
  materialBox: {
    flex: 1, minWidth: '30%', backgroundColor: '#FFFFFF', borderRadius: 24,
    padding: 18, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.04, shadowRadius: 10, elevation: 3, borderWidth: 1, borderColor: '#F9FAFB'
  },
  materialIcon: { width: 52, height: 52, borderRadius: 26, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  materialValue: { fontSize: 22, fontWeight: '900', color: '#111827' },
  materialLabel: { fontSize: 13, color: '#6B7280', marginTop: 4, fontWeight: '600' },

  historyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  seeAllText: { color: '#10B981', fontWeight: 'bold', fontSize: 14 },
  
  historyContainer: { backgroundColor: '#FFFFFF', borderRadius: 28, padding: 25, shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.04, shadowRadius: 15, elevation: 4 },
  historyItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  historyIconBox: { width: 54, height: 54, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  historyDetails: { flex: 1 },
  historyType: { fontSize: 17, fontWeight: '900', color: '#111827', marginBottom: 4 },
  historyDate: { fontSize: 13, color: '#6B7280', fontWeight: '500' },
  historyStats: { alignItems: 'flex-end' },
  historyWeight: { fontSize: 16, fontWeight: '900', color: '#374151', marginBottom: 4 },
  historyPoints: { fontSize: 14, fontWeight: 'bold', color: '#10B981' }
});
