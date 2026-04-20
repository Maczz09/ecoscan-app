import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTacho } from '@/src/hooks/useTacho';
import { LevelIndicator } from '@/src/components/LevelIndicator';
import { NotificationBell } from '@/src/components/NotificationBell';
import { ProfileButton } from '@/src/components/ProfileButton';
import { SidebarMenu } from '@/src/components/SidebarMenu';

export const EstadoTachoScreen = () => {
  const { data, isLoading } = useTacho();
  const [menuVisible, setMenuVisible] = useState(false);

  // Fecha dinámica real
  const fechaActual = new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'long' }).format(new Date());

  if (isLoading) {
    return <View style={styles.center}><ActivityIndicator size="large" color="#10B981" /></View>;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* paddingBottom 100 es clave para que el contenido no quede oculto detrás de la barra inferior */}
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        
        {/* HEADER */}
        <View style={styles.header}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <TouchableOpacity onPress={() => setMenuVisible(true)} style={styles.menuBtn}>
              <MaterialCommunityIcons name="menu" size={28} color="#111827" />
            </TouchableOpacity>
            <View>
              <Text style={styles.greeting}>Hola, Max 👋</Text>
              <Text style={styles.date}>Hoy, {fechaActual}</Text>
            </View>
          </View>
          <View style={styles.actions}>
            <NotificationBell />
            <ProfileButton />
          </View>
        </View>

        {/* MÉTRICAS DE USUARIO (Tabla: usuarios y metricas_dashboard) */}
        <View style={styles.metricsRow}>
          <View style={styles.metricCard}>
            <MaterialCommunityIcons name="leaf" size={28} color="#10B981" />
            <Text style={styles.metricValue}>{data?.metricas.eco_puntos_personales}</Text>
            <Text style={styles.metricLabel}>Eco Puntos</Text>
          </View>
          <View style={styles.metricCard}>
            <MaterialCommunityIcons name="fire" size={28} color="#F59E0B" />
            <Text style={styles.metricValue}>{data?.metricas.racha_dias_activos} Días</Text>
            <Text style={styles.metricLabel}>Racha Activa</Text>
          </View>
        </View>

        {/* TARJETA DEL TACHO */}
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <View>
              <Text style={styles.tachoName}>Tacho Principal</Text>
              <Text style={styles.tachoId}>ID: {data?.tacho.codigo_qr}</Text>
            </View>
            <View style={[styles.badgeStatus, data?.tacho.estado_operativo === 'ACTIVO' ? styles.bgSuccess : styles.bgWarn]}>
              <Text style={styles.badgeText}>{data?.tacho.estado_operativo}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <LevelIndicator label="Plástico" percentage={data?.tacho.nivel_llenado_plastico || 0} color="#3B82F6" />
          <LevelIndicator label="Papel" percentage={data?.tacho.nivel_llenado_papel || 0} color="#F59E0B" />
          <LevelIndicator label="Orgánico" percentage={data?.tacho.nivel_llenado_organico || 0} color="#10B981" />
          <LevelIndicator label="Vidrio" percentage={data?.tacho.nivel_llenado_vidrio || 0} color="#8B5CF6" />

          <View style={styles.footerInfo}>
            <MaterialCommunityIcons name="clock-outline" size={14} color="#9CA3AF" />
            <Text style={styles.footerText}>Última actualización: {data?.tacho.ultima_conexion}</Text>
          </View>
        </View>

      </ScrollView>

      {/* CONTENEDOR DE BOTONES FLOTANTES */}
      <View style={styles.floatingBottom}>
        <TouchableOpacity style={styles.scanBtn} activeOpacity={0.8}>
          <MaterialCommunityIcons name="qrcode-scan" size={22} color="#FFF" />
          <Text style={styles.scanBtnText}>Escanear Nuevo Tacho</Text>
        </TouchableOpacity>
      </View>

      <SidebarMenu visible={menuVisible} onClose={() => setMenuVisible(false)} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
  menuBtn: { padding: 8, backgroundColor: '#F3F4F6', borderRadius: 12 },
  greeting: { fontSize: 22, fontWeight: 'bold', color: '#111827' },
  date: { fontSize: 13, color: '#6B7280', textTransform: 'capitalize' },
  actions: { flexDirection: 'row', gap: 12 },
  iconBtn: { padding: 8, backgroundColor: '#FFF', borderRadius: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5 },
  badge: { position: 'absolute', top: 8, right: 8, width: 8, height: 8, backgroundColor: '#EF4444', borderRadius: 4, borderWidth: 1, borderColor: '#fff' },
  
  metricsRow: { flexDirection: 'row', gap: 15, marginBottom: 20 },
  metricCard: { flex: 1, backgroundColor: '#FFF', padding: 15, borderRadius: 20, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  metricValue: { fontSize: 22, fontWeight: '900', color: '#111827', marginTop: 8 },
  metricLabel: { fontSize: 12, color: '#6B7280', marginTop: 2 },

  statusCard: { backgroundColor: '#FFF', borderRadius: 24, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3, marginBottom: 20 },
  statusHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 15 },
  tachoName: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  tachoId: { fontSize: 12, color: '#9CA3AF' },
  badgeStatus: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  bgSuccess: { backgroundColor: '#D1FAE5' },
  bgWarn: { backgroundColor: '#FEF3C7' },
  badgeText: { fontSize: 10, fontWeight: 'bold', color: '#065F46' },
  divider: { height: 1, backgroundColor: '#F3F4F6', marginVertical: 15 },
  footerInfo: { flexDirection: 'row', alignItems: 'center', marginTop: 10, gap: 5 },
  footerText: { fontSize: 12, color: '#9CA3AF' },

  floatingBottom: {
    position: 'absolute',
    bottom: 110, // Elevado para no tapar la barra de navegación (Tabs)
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  scanBtn: { 
    flex: 1,
    backgroundColor: '#111827', 
    flexDirection: 'row', 
    paddingHorizontal: 20, 
    paddingVertical: 18, 
    borderRadius: 20, 
    alignItems: 'center', 
    justifyContent: 'center', 
    gap: 10, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 6 }, 
    shadowOpacity: 0.25, 
    shadowRadius: 12,
    elevation: 8,
  },
  scanBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 }
});