import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTacho } from '@/src/hooks/useTacho';
import { LevelIndicator } from '@/src/components/LevelIndicator';
import { NotificationBell } from '@/src/components/NotificationBell';
import { ProfileButton } from '@/src/components/ProfileButton';
import { SidebarMenu } from '@/src/components/SidebarMenu';
import { useAuthStore } from '@/src/store/useAuthStore';
import { useRouter } from 'expo-router';

export const EstadoTachoScreen = () => {
  const router = useRouter();
  const { data, isLoading } = useTacho();
  const [menuVisible, setMenuVisible] = useState(false);
  const user = useAuthStore((state) => state.user);
  const firstName = user?.nombre?.split(' ')[0] || 'Usuario';

  const fechaActual = new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'long' }).format(new Date());

  if (isLoading) {
    return <View style={styles.center}><ActivityIndicator size="large" color="#10B981" /></View>;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        
        <View style={styles.header}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <TouchableOpacity onPress={() => setMenuVisible(true)} style={styles.menuBtn}>
              <MaterialCommunityIcons name="menu" size={28} color="#111827" />
            </TouchableOpacity>
            <View>
              <Text style={styles.greeting}>Hola, {firstName} 👋</Text>
              <Text style={styles.date}>Hoy, {fechaActual}</Text>
            </View>
          </View>
          <View style={styles.actions}>
            <NotificationBell />
            <ProfileButton />
          </View>
        </View>

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

        {data?.tacho ? (
          <View style={styles.statusCard}>
            <View style={styles.statusHeader}>
              <View>
                <Text style={styles.tachoName}>Tacho Principal</Text>
                <Text style={styles.tachoId}>ID: {data.tacho.codigo_qr}</Text>
              </View>
              <View style={[styles.badgeStatus, data.tacho.estado_operativo === 'ACTIVO' ? styles.bgSuccess : styles.bgWarn]}>
                <Text style={styles.badgeText}>{data.tacho.estado_operativo}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.levelsContainer}>
              <LevelIndicator label="Plástico" percentage={data.tacho.nivel_llenado_plastico || 0} color="#3B82F6" />
              <LevelIndicator label="Papel/Cartón" percentage={data.tacho.nivel_llenado_papel || 0} color="#F59E0B" />
              <LevelIndicator label="Vidrio" percentage={data.tacho.nivel_llenado_vidrio || 0} color="#8B5CF6" />
              {data.tacho.nivel_llenado_organico > 0 && (
                <LevelIndicator label="Orgánico" percentage={data.tacho.nivel_llenado_organico} color="#10B981" />
              )}
            </View>
          </View>
        ) : (
          <View style={[styles.statusCard, { alignItems: 'center', paddingVertical: 40 }]}>
            <MaterialCommunityIcons name="trash-can-outline" size={64} color="#D1D5DB" />
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#374151', marginTop: 16 }}>Sin tacho vinculado</Text>
            <Text style={{ fontSize: 14, color: '#6B7280', textAlign: 'center', marginTop: 8, paddingHorizontal: 20 }}>
              Aún no tienes un tacho asociado a tu cuenta. ¡Vincula uno para empezar a medir tu impacto real!
            </Text>
          </View>
        )}

      </ScrollView>

      <View style={styles.floatingBottom}>
        {user?.rol === 'ADMIN_GROUP' && (
          <TouchableOpacity style={[styles.scanBtn, styles.adminBtn]} activeOpacity={0.8} onPress={() => router.push('/crear-tacho')}>
            <MaterialCommunityIcons name="plus-circle-outline" size={24} color="#10B981" />
            <Text style={[styles.scanBtnText, styles.adminBtnText]}>Crear Nuevo Tacho</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.scanBtn} activeOpacity={0.8} onPress={() => router.push('/vincular-tacho')}>
          <MaterialCommunityIcons name="qrcode-scan" size={24} color="#FFF" />
          <Text style={styles.scanBtnText}>Vincular Tacho</Text>
        </TouchableOpacity>
      </View>

      <SidebarMenu visible={menuVisible} onClose={() => setMenuVisible(false)} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' }, // Fondo un poco más gris para resaltar tarjetas blancas
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
  menuBtn: { padding: 10, backgroundColor: '#FFF', borderRadius: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  greeting: { fontSize: 24, fontWeight: '900', color: '#111827', letterSpacing: -0.5 },
  date: { fontSize: 14, color: '#6B7280', textTransform: 'capitalize', fontWeight: '500', marginTop: 2 },
  actions: { flexDirection: 'row', gap: 12 },
  
  metricsRow: { flexDirection: 'row', gap: 15, marginBottom: 25 },
  metricCard: { flex: 1, backgroundColor: '#FFF', padding: 22, borderRadius: 24, alignItems: 'center', shadowColor: '#10B981', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.12, shadowRadius: 15, elevation: 5, borderWidth: 1, borderColor: '#F0FDF4' },
  metricValue: { fontSize: 26, fontWeight: '900', color: '#111827', marginTop: 10 },
  metricLabel: { fontSize: 13, color: '#6B7280', marginTop: 4, fontWeight: '600' },

  statusCard: { backgroundColor: '#FFF', borderRadius: 28, padding: 25, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.08, shadowRadius: 20, elevation: 6, marginBottom: 20 },
  statusHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 15 },
  tachoName: { fontSize: 20, fontWeight: '900', color: '#111827', letterSpacing: -0.5 },
  tachoId: { fontSize: 13, color: '#9CA3AF', marginTop: 4, fontWeight: '500' },
  badgeStatus: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  bgSuccess: { backgroundColor: '#D1FAE5' },
  bgWarn: { backgroundColor: '#FEF3C7' },
  badgeText: { fontSize: 11, fontWeight: '800', color: '#065F46', letterSpacing: 0.5 },
  divider: { height: 1, backgroundColor: '#F3F4F6', marginVertical: 20 },
  
  levelsContainer: { gap: 8 }, // Espaciado entre niveles

  floatingBottom: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    alignItems: 'center',
    gap: 12, // Espacio entre los botones
  },
  scanBtn: { 
    width: '100%',
    backgroundColor: '#111827', 
    flexDirection: 'row', 
    paddingHorizontal: 20, 
    paddingVertical: 18, 
    borderRadius: 20, 
    alignItems: 'center', 
    justifyContent: 'center', 
    gap: 12, 
    shadowColor: '#111827', 
    shadowOffset: { width: 0, height: 8 }, 
    shadowOpacity: 0.25, 
    shadowRadius: 12,
    elevation: 8,
  },
  scanBtnText: { color: '#FFF', fontWeight: '800', fontSize: 16, letterSpacing: 0.5 },
  
  adminBtn: {
    backgroundColor: '#ECFDF5',
    borderWidth: 2,
    borderColor: '#10B981',
    shadowOpacity: 0,
    elevation: 0,
  },
  adminBtnText: { color: '#065F46' }
});