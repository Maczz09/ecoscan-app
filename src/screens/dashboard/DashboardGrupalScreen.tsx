import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { BarChart, PieChart } from 'react-native-gifted-charts';

import { useDashboardGrupal, FiltroTiempo } from '@/src/hooks/useDashboardGrupal';
import { NotificationBell } from '@/src/components/NotificationBell';
import { ProfileButton } from '@/src/components/ProfileButton';
import { SidebarMenu } from '@/src/components/SidebarMenu';

export const DashboardGrupalScreen = () => {
  const router = useRouter();
  const { filtro, setFiltro, data, loading } = useDashboardGrupal();
  const [menuVisible, setMenuVisible] = useState(false);

  const renderFiltro = (valor: FiltroTiempo, label: string) => (
    <TouchableOpacity
      style={[styles.filtroBtn, filtro === valor && styles.filtroBtnActive]}
      onPress={() => setFiltro(valor)}
    >
      <Text style={[styles.filtroText, filtro === valor && styles.filtroTextActive]}>{label}</Text>
    </TouchableOpacity>
  );

  // Formato para el PieChart (react-native-gifted-charts)
  const pieData = [
    { value: data.materiales.plastico, color: '#3B82F6', text: `${data.materiales.plastico}` },
    { value: data.materiales.papel, color: '#F59E0B', text: `${data.materiales.papel}` },
    { value: data.materiales.vidrio, color: '#8B5CF6', text: `${data.materiales.vidrio}` },
  ];

  const getRecomendacionIcon = (tipo: string) => {
    switch (tipo) {
      case 'POSITIVO': return { name: 'star-circle', color: '#10B981', bg: '#D1FAE5' };
      case 'ALERTA': return { name: 'alert-circle', color: '#EF4444', bg: '#FEE2E2' };
      case 'MEJORA': return { name: 'trending-up', color: '#F59E0B', bg: '#FEF3C7' };
      default: return { name: 'information', color: '#6B7280', bg: '#F3F4F6' };
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => setMenuVisible(true)} style={styles.menuBtn}>
            <MaterialCommunityIcons name="menu" size={28} color="#111827" />
          </TouchableOpacity>
          <View style={styles.actions}>
            <NotificationBell />
            <ProfileButton />
          </View>
        </View>

        <Text style={styles.headerTitle}>Estadísticas del Grupo</Text>
      </View>

      {/* FILTROS */}
      <View style={styles.filtrosContainer}>
        {renderFiltro('SEMANA', 'Esta Semana')}
        {renderFiltro('MES', 'Este Mes')}
        {renderFiltro('AÑO', 'Este Año')}
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#10B981" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* TARJETAS PRINCIPALES */}
          <View style={styles.resumenRow}>
            <View style={styles.resumenCard}>
              <MaterialCommunityIcons name="leaf" size={32} color="#10B981" />
              <Text style={styles.resumenValue}>{data.puntos_totales}</Text>
              <Text style={styles.resumenLabel}>Eco Puntos Totales</Text>
            </View>
            <View style={styles.resumenCard}>
              <MaterialCommunityIcons name="cloud-check" size={32} color="#3B82F6" />
              <Text style={styles.resumenValue}>{data.co2_ahorrado} kg</Text>
              <Text style={styles.resumenLabel}>CO2 Ahorrado</Text>
            </View>
          </View>

          {/* GRÁFICO DE BARRAS: APORTE POR MIEMBRO */}
          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Aporte por Miembro (Puntos)</Text>
            <View style={styles.barChartContainer}>
              <BarChart
                data={data.aporte_miembros}
                barWidth={35}
                spacing={25}
                roundedTop
                xAxisThickness={0}
                yAxisThickness={0}
                yAxisTextStyle={{ color: '#6B7280' }}
                noOfSections={4}
                maxValue={Math.max(...data.aporte_miembros.map(d => d.value)) * 1.2 || 100}
                isAnimated
              />
            </View>
          </View>

          {/* GRÁFICO CIRCULAR: CANTIDAD POR MATERIAL */}
          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Cantidad por Material (Unidades)</Text>
            <View style={styles.pieChartContainer}>
              <PieChart
                data={pieData}
                donut
                showText
                textColor="#FFFFFF"
                radius={80}
                innerRadius={50}
                textSize={14}
              />
              <View style={styles.pieLegend}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: '#3B82F6' }]} />
                  <Text style={styles.legendText}>Plástico ({data.materiales.plastico})</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: '#F59E0B' }]} />
                  <Text style={styles.legendText}>Papel ({data.materiales.papel})</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: '#8B5CF6' }]} />
                  <Text style={styles.legendText}>Vidrio ({data.materiales.vidrio})</Text>
                </View>
              </View>
            </View>
          </View>

          {/* RECOMENDACIONES */}
          <Text style={styles.sectionTitle}>Recomendaciones y Logros</Text>
          <View style={styles.recomendacionesContainer}>
            {data.recomendaciones.map((rec) => {
              const iconData = getRecomendacionIcon(rec.tipo);
              return (
                <View key={rec.id} style={styles.recomendacionCard}>
                  <View style={[styles.recIconBox, { backgroundColor: iconData.bg }]}>
                    <MaterialCommunityIcons name={iconData.name as any} size={28} color={iconData.color} />
                  </View>
                  <View style={styles.recTextContainer}>
                    <Text style={styles.recTitle}>{rec.titulo}</Text>
                    <Text style={styles.recMessage}>{rec.mensaje}</Text>
                  </View>
                </View>
              );
            })}
          </View>

        </ScrollView>
      )}
      
      <SidebarMenu visible={menuVisible} onClose={() => setMenuVisible(false)} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F9FAFB' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  menuBtn: { padding: 8, backgroundColor: '#E5E7EB', borderRadius: 12, alignSelf: 'flex-start' },
  actions: { flexDirection: 'row', gap: 12 },
  header: { paddingHorizontal: 20, paddingVertical: 15, backgroundColor: '#FFF' },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#111827' },

  filtrosContainer: { flexDirection: 'row', justifyContent: 'center', gap: 10, paddingVertical: 15, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  filtroBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#F3F4F6' },
  filtroBtnActive: { backgroundColor: '#111827' },
  filtroText: { fontSize: 13, fontWeight: '600', color: '#6B7280' },
  filtroTextActive: { color: '#FFF' },

  scrollContent: { padding: 20, paddingBottom: 40 },

  resumenRow: { flexDirection: 'row', gap: 15, marginBottom: 20 },
  resumenCard: { flex: 1, backgroundColor: '#FFF', padding: 20, borderRadius: 20, alignItems: 'center', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8 },
  resumenValue: { fontSize: 24, fontWeight: '900', color: '#111827', marginTop: 10, marginBottom: 4 },
  resumenLabel: { fontSize: 12, color: '#6B7280', textAlign: 'center' },

  chartCard: { backgroundColor: '#FFF', borderRadius: 20, padding: 20, marginBottom: 20, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8 },
  chartTitle: { fontSize: 16, fontWeight: 'bold', color: '#374151', marginBottom: 20 },
  barChartContainer: { alignItems: 'center', marginLeft: -15 },
  
  pieChartContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  pieLegend: { flex: 1, marginLeft: 20, gap: 12 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  legendDot: { width: 12, height: 12, borderRadius: 6 },
  legendText: { fontSize: 13, color: '#4B5563', fontWeight: '500' },

  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827', marginBottom: 15, marginTop: 10 },
  recomendacionesContainer: { gap: 12 },
  recomendacionCard: { flexDirection: 'row', backgroundColor: '#FFF', padding: 16, borderRadius: 16, alignItems: 'center', elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4 },
  recIconBox: { width: 50, height: 50, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  recTextContainer: { flex: 1 },
  recTitle: { fontSize: 16, fontWeight: 'bold', color: '#111827', marginBottom: 4 },
  recMessage: { fontSize: 13, color: '#6B7280', lineHeight: 18 },
});
