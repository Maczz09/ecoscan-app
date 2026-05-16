import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/src/store/useAuthStore';
import { SidebarMenu } from '@/src/components/SidebarMenu';
import { NotificationBell } from '@/src/components/NotificationBell';
import { ProfileButton } from '@/src/components/ProfileButton';

// Datos de prueba (MOCK)
const mockMembers = [
  { id: 1, name: 'Max Garcia', role: 'ADMIN_GROUP', points: 1200 },
  { id: 2, name: 'Ana Lopez', role: 'USER', points: 850 },
  { id: 3, name: 'Carlos Ruiz', role: 'USER', points: 430 },
];

export const MiGrupoScreen = () => {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const isAdminGroup = user?.rol === 'ADMIN_GROUP';
  const [menuVisible, setMenuVisible] = useState(false);

  // Si no tiene grupo asignado
  if (!user?.id_grupo && user?.rol === 'USER') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => setMenuVisible(true)} style={styles.menuBtn}>
            <MaterialCommunityIcons name="menu" size={28} color="#111827" />
          </TouchableOpacity>
        </View>
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="account-group-outline" size={80} color="#9CA3AF" />
          <Text style={styles.emptyTitle}>Aún no tienes un grupo</Text>
          <Text style={styles.emptySubtitle}>Pide a tu administrador que te agregue a uno o crea el tuyo propio.</Text>
        </View>
        <SidebarMenu visible={menuVisible} onClose={() => setMenuVisible(false)} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
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

          <Text style={styles.title}>Mi Grupo (Familia García)</Text>
          <View style={styles.statsBadge}>
            <MaterialCommunityIcons name="leaf" size={16} color="#10B981" />
            <Text style={styles.statsText}>2480 pts grupales</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.dashboardBtn} 
          activeOpacity={0.8}
          onPress={() => router.push('/dashboard-grupal')}
        >
          <View style={styles.dashboardBtnContent}>
            <MaterialCommunityIcons name="chart-box" size={28} color="#FFF" />
            <View>
              <Text style={styles.dashboardBtnTitle}>Estadísticas Grupales</Text>
              <Text style={styles.dashboardBtnSub}>Impacto y progreso del grupo</Text>
            </View>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={24} color="#FFF" />
        </TouchableOpacity>

        {isAdminGroup && (
          <View style={styles.adminActionsContainer}>
            <TouchableOpacity style={styles.actionButton}>
              <MaterialCommunityIcons name="account-plus" size={20} color="#FFF" />
              <Text style={styles.actionButtonText}>Añadir Miembro</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionButton, styles.secondaryButton]}
              onPress={() => router.push('/ajustes-grupo')}
            >
              <MaterialCommunityIcons name="cog-outline" size={20} color="#374151" />
              <Text style={styles.secondaryButtonText}>Ajustes</Text>
            </TouchableOpacity>
          </View>
        )}

        <Text style={styles.sectionTitle}>Miembros del Grupo</Text>

        <View style={styles.listContainer}>
          {mockMembers.map((member) => (
            <View key={member.id} style={styles.memberCard}>
              <View style={styles.memberInfo}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{member.name.charAt(0)}</Text>
                </View>
                <View>
                  <Text style={styles.memberName}>
                    {member.name} {member.id === user?.id_usuario && '(Tú)'}
                  </Text>
                  <Text style={styles.memberRole}>
                    {member.role === 'ADMIN_GROUP' ? 'Administrador' : 'Miembro'}
                  </Text>
                </View>
              </View>

              <View style={styles.rightSection}>
                <Text style={styles.pointsText}>{member.points} pts</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
      <SidebarMenu visible={menuVisible} onClose={() => setMenuVisible(false)} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F3F4F6' },
  container: { padding: 20 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  menuBtn: { padding: 8, backgroundColor: '#E5E7EB', borderRadius: 12, alignSelf: 'flex-start' },
  actions: { flexDirection: 'row', gap: 12 },
  topBar: { paddingHorizontal: 20, paddingTop: 20, flexDirection: 'row' },
  header: { marginBottom: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#111827', marginBottom: 8 },
  statsBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ECFDF5', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, alignSelf: 'flex-start', gap: 6 },
  statsText: { color: '#065F46', fontWeight: '600', fontSize: 14 },
  
  dashboardBtn: { backgroundColor: '#111827', borderRadius: 20, padding: 18, marginBottom: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8 },
  dashboardBtnContent: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  dashboardBtnTitle: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  dashboardBtnSub: { color: '#9CA3AF', fontSize: 12, marginTop: 2 },

  adminActionsContainer: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  actionButton: { flex: 1, flexDirection: 'row', backgroundColor: '#10B981', paddingVertical: 12, borderRadius: 12, alignItems: 'center', justifyContent: 'center', gap: 8 },
  actionButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },
  secondaryButton: { backgroundColor: '#E5E7EB' },
  secondaryButtonText: { color: '#374151', fontWeight: 'bold', fontSize: 14 },

  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#374151', marginBottom: 16 },
  listContainer: { gap: 12 },
  
  memberCard: { flexDirection: 'row', backgroundColor: '#FFF', padding: 16, borderRadius: 16, alignItems: 'center', justifyContent: 'space-between', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2 },
  memberInfo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#D1FAE5', alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 16, fontWeight: 'bold', color: '#059669' },
  memberName: { fontSize: 16, fontWeight: '600', color: '#111827' },
  memberRole: { fontSize: 13, color: '#6B7280' },
  
  rightSection: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  pointsText: { fontSize: 14, fontWeight: 'bold', color: '#10B981' },
  moreButton: { padding: 4 },

  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  emptyTitle: { fontSize: 20, fontWeight: 'bold', color: '#374151', marginTop: 16, marginBottom: 8 },
  emptySubtitle: { fontSize: 15, color: '#6B7280', textAlign: 'center' },
});
