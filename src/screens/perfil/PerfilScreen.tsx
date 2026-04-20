import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { usePerfil } from '@/src/hooks/usePerfil';

export const PerfilScreen = () => {
  const router = useRouter();
  const { user, loading, logout } = usePerfil();

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#10B981" />
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <Text style={styles.errorText}>No se pudo cargar la información del usuario.</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Volver</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mi Perfil</Text>
        <TouchableOpacity style={styles.iconBtn} onPress={() => router.push('/editar-perfil')}>
          <MaterialCommunityIcons name="pencil-outline" size={24} color="#1F2937" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* INFO PRINCIPAL */}
        <View style={styles.profileHeaderCard}>
          <View style={styles.avatarContainer}>
            <MaterialCommunityIcons name="account" size={60} color="#10B981" />
            <View style={styles.verifiedBadge}>
              <MaterialCommunityIcons name="check-decagram" size={20} color="#3B82F6" />
            </View>
          </View>
          <Text style={styles.userName}>{user.nombre}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
          
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{user.estado_cuenta}</Text>
          </View>
        </View>

        {/* MÉTRICAS / ESTADÍSTICAS */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <View style={[styles.statIconBox, { backgroundColor: '#D1FAE5' }]}>
              <MaterialCommunityIcons name="leaf" size={24} color="#10B981" />
            </View>
            <Text style={styles.statValue}>{user.eco_puntos_personales}</Text>
            <Text style={styles.statLabel}>Eco Puntos</Text>
          </View>
          
          {user.familia && (
            <View style={styles.statCard}>
              <View style={[styles.statIconBox, { backgroundColor: '#FEF3C7' }]}>
                <MaterialCommunityIcons name="account-group" size={24} color="#F59E0B" />
              </View>
              <Text style={styles.statValue}>{user.familia.puntos_grupales}</Text>
              <Text style={styles.statLabel}>Puntos Familia</Text>
            </View>
          )}
        </View>

        {/* SECCIÓN DE FAMILIA */}
        {user.familia && (
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name="home-heart" size={24} color="#3B82F6" />
              <Text style={styles.sectionTitle}>Mi Familia</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Nombre</Text>
              <Text style={styles.infoValue}>{user.familia.nombre_familia}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Tacho Principal ID</Text>
              <Text style={styles.infoValue}>#{user.familia.id_tacho_asignado}</Text>
            </View>
          </View>
        )}

        {/* AJUSTES */}
        <View style={styles.sectionCard}>
          <TouchableOpacity style={styles.actionRow} activeOpacity={0.7} onPress={() => router.push('/seguridad')}>
            <MaterialCommunityIcons name="shield-lock-outline" size={22} color="#6B7280" />
            <Text style={styles.actionText}>Seguridad y Contraseña</Text>
            <MaterialCommunityIcons name="chevron-right" size={22} color="#D1D5DB" />
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.actionRow} activeOpacity={0.7}>
            <MaterialCommunityIcons name="history" size={22} color="#6B7280" />
            <Text style={styles.actionText}>Historial de Reciclaje</Text>
            <MaterialCommunityIcons name="chevron-right" size={22} color="#D1D5DB" />
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.actionRow} activeOpacity={0.7}>
            <MaterialCommunityIcons name="gift-outline" size={22} color="#6B7280" />
            <Text style={styles.actionText}>Mis Canjes</Text>
            <MaterialCommunityIcons name="chevron-right" size={22} color="#D1D5DB" />
          </TouchableOpacity>
        </View>

        {/* BOTÓN CERRAR SESIÓN */}
        <TouchableOpacity style={styles.logoutButton} onPress={logout} activeOpacity={0.8}>
          <MaterialCommunityIcons name="logout" size={20} color="#EF4444" />
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>
        
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  center: { justifyContent: 'center', alignItems: 'center' },
  scrollContent: { padding: 20 },
  
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  iconBtn: { padding: 8, backgroundColor: '#F3F4F6', borderRadius: 12 },
  
  profileHeaderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 20,
    marginTop: 10,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ECFDF5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    position: 'relative',
    borderWidth: 4,
    borderColor: '#FFFFFF',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  verifiedBadge: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#FFF', borderRadius: 12, padding: 2 },
  userName: { fontSize: 22, fontWeight: 'bold', color: '#111827', marginBottom: 4 },
  userEmail: { fontSize: 14, color: '#6B7280', marginBottom: 12 },
  statusBadge: { backgroundColor: '#DBEAFE', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  statusText: { color: '#2563EB', fontSize: 12, fontWeight: 'bold' },

  statsRow: { flexDirection: 'row', gap: 16, marginBottom: 20 },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  statIconBox: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  statValue: { fontSize: 20, fontWeight: 'bold', color: '#111827' },
  statLabel: { fontSize: 13, color: '#6B7280', marginTop: 4 },

  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 5 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#111827' },
  divider: { height: 1, backgroundColor: '#F3F4F6', marginVertical: 15 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  infoLabel: { color: '#6B7280', fontSize: 14 },
  infoValue: { color: '#111827', fontSize: 14, fontWeight: '600' },

  actionRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 4 },
  actionText: { flex: 1, fontSize: 15, color: '#374151', marginLeft: 12, fontWeight: '500' },

  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF2F2',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
    marginTop: 10,
  },
  logoutText: { color: '#EF4444', fontSize: 16, fontWeight: 'bold' },

  errorText: { color: '#EF4444', fontSize: 16, marginBottom: 16 },
  backButton: { backgroundColor: '#10B981', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12 },
  backButtonText: { color: '#FFF', fontWeight: 'bold' }
});
