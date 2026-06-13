import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Modal, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/src/store/useAuthStore';
import { SidebarMenu } from '@/src/components/SidebarMenu';
import { NotificationBell } from '@/src/components/NotificationBell';
import { ProfileButton } from '@/src/components/ProfileButton';
import { CustomButton } from '@/src/components/CustomButton';
import api from '@/src/services/api';

export const MiGrupoScreen = () => {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  
  const [menuVisible, setMenuVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [grupoData, setGrupoData] = useState<any>(null);
  
  // Modals state
  const [modalType, setModalType] = useState<'NONE' | 'JOIN' | 'CREATE'>('NONE');
  const [inputValue, setInputValue] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchGrupo = async () => {
    setLoading(true);
    try {
      const res = await api.get('/v1/grupos');
      const grupos = res.data.data;
      if (grupos && grupos.length > 0) {
        // Fetch details of the first group
        const detailRes = await api.get(`/v1/grupos/${grupos[0].id_grupo}`);
        setGrupoData(detailRes.data.data);
      } else {
        setGrupoData(null);
      }
    } catch (error) {
      console.error('Error fetching group:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrupo();
  }, []);

  const handleAction = async () => {
    if (!inputValue) return Alert.alert('Error', 'El campo no puede estar vacío');
    setActionLoading(true);
    
    try {
      if (modalType === 'CREATE') {
        await api.post('/v1/grupos', { nombre_grupo: inputValue });
        Alert.alert('Éxito', 'Familia creada correctamente');
      } else if (modalType === 'JOIN') {
        await api.post('/v1/grupos/join', { codigo_invitacion: inputValue.toUpperCase() });
        Alert.alert('Éxito', 'Te has unido a la familia');
      }
      setModalType('NONE');
      setInputValue('');
      fetchGrupo();
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Ocurrió un error';
      Alert.alert('Error', msg);
    } finally {
      setActionLoading(false);
    }
  };

  // Si está cargando
  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#10B981" />
      </SafeAreaView>
    );
  }

  // Si no tiene grupo asignado
  if (!grupoData) {
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
          <Text style={styles.emptySubtitle}>Crea una nueva familia o únete a una existente mediante un código de invitación.</Text>
          
          <View style={styles.emptyActions}>
            <CustomButton title="Crear Familia" onPress={() => setModalType('CREATE')} />
            <View style={{ height: 10 }} />
            <TouchableOpacity style={styles.secondaryButtonBig} onPress={() => setModalType('JOIN')}>
              <Text style={styles.secondaryButtonBigText}>Unirse con Código</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Modal Creacion/Union */}
        <Modal visible={modalType !== 'NONE'} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                {modalType === 'CREATE' ? 'Crear Familia' : 'Unirse a Familia'}
              </Text>
              <Text style={styles.modalSubtitle}>
                {modalType === 'CREATE' ? 'Ingresa el nombre para tu nueva familia:' : 'Ingresa el código de 6 caracteres:'}
              </Text>
              
              <TextInput 
                style={styles.modalInput}
                placeholder={modalType === 'CREATE' ? 'Nombre de la familia' : 'Código (Ej. X2A45B)'}
                value={inputValue}
                onChangeText={setInputValue}
                autoCapitalize={modalType === 'JOIN' ? 'characters' : 'words'}
              />

              <CustomButton title="Confirmar" onPress={handleAction} isLoading={actionLoading} />
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalType('NONE')}>
                <Text style={styles.cancelBtnText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <SidebarMenu visible={menuVisible} onClose={() => setMenuVisible(false)} />
      </SafeAreaView>
    );
  }

  const isAdminGroup = grupoData.ranking?.find((m: any) => m.id_usuario === user?.id_usuario)?.rol_en_grupo === 'ADMIN_GRUPO';

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

          <Text style={styles.title}>{grupoData.nombre_grupo}</Text>
          {isAdminGroup && (
            <Text style={styles.codigoTexto}>Código de Invitación: <Text style={styles.codigoHighlight}>{grupoData.codigo_invitacion}</Text></Text>
          )}

          <View style={styles.statsBadge}>
            <MaterialCommunityIcons name="leaf" size={16} color="#10B981" />
            <Text style={styles.statsText}>{grupoData.puntos_totales} pts grupales</Text>
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
            <TouchableOpacity 
              style={[styles.actionButton, styles.secondaryButton]}
              onPress={() => router.push('/ajustes-grupo')}
            >
              <MaterialCommunityIcons name="cog-outline" size={20} color="#374151" />
              <Text style={styles.secondaryButtonText}>Ajustes</Text>
            </TouchableOpacity>
          </View>
        )}

        <Text style={styles.sectionTitle}>Ranking Familiar</Text>

        <View style={styles.listContainer}>
          {grupoData.ranking?.map((member: any) => (
            <View key={member.id_usuario} style={styles.memberCard}>
              <View style={styles.memberInfo}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{member.nombre.charAt(0)}</Text>
                </View>
                <View>
                  <Text style={styles.memberName}>
                    {member.nombre} {member.id_usuario === user?.id_usuario && '(Tú)'}
                  </Text>
                  <Text style={styles.memberRole}>
                    {member.rol_en_grupo === 'ADMIN_GRUPO' ? 'Administrador' : 'Miembro'}
                  </Text>
                </View>
              </View>

              <View style={styles.rightSection}>
                <Text style={styles.pointsText}>{member.puntos_aportados} pts</Text>
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
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { padding: 20 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  menuBtn: { padding: 8, backgroundColor: '#E5E7EB', borderRadius: 12, alignSelf: 'flex-start' },
  actions: { flexDirection: 'row', gap: 12 },
  topBar: { paddingHorizontal: 20, paddingTop: 20, flexDirection: 'row' },
  header: { marginBottom: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#111827', marginBottom: 4 },
  codigoTexto: { fontSize: 14, color: '#6B7280', marginBottom: 12 },
  codigoHighlight: { fontWeight: 'bold', color: '#111827', letterSpacing: 2 },
  statsBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ECFDF5', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, alignSelf: 'flex-start', gap: 6 },
  statsText: { color: '#065F46', fontWeight: '600', fontSize: 14 },
  
  dashboardBtn: { backgroundColor: '#111827', borderRadius: 20, padding: 18, marginBottom: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8 },
  dashboardBtnContent: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  dashboardBtnTitle: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  dashboardBtnSub: { color: '#9CA3AF', fontSize: 12, marginTop: 2 },

  adminActionsContainer: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  actionButton: { flex: 1, flexDirection: 'row', backgroundColor: '#10B981', paddingVertical: 12, borderRadius: 12, alignItems: 'center', justifyContent: 'center', gap: 8 },
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

  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  emptyTitle: { fontSize: 20, fontWeight: 'bold', color: '#374151', marginTop: 16, marginBottom: 8 },
  emptySubtitle: { fontSize: 15, color: '#6B7280', textAlign: 'center', marginBottom: 30 },
  emptyActions: { width: '100%' },
  secondaryButtonBig: { padding: 16, backgroundColor: '#E5E7EB', borderRadius: 16, alignItems: 'center' },
  secondaryButtonBigText: { fontWeight: 'bold', color: '#374151', fontSize: 16 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { width: '100%', backgroundColor: '#FFF', borderRadius: 20, padding: 24, elevation: 5 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#111827', marginBottom: 8 },
  modalSubtitle: { fontSize: 14, color: '#6B7280', marginBottom: 20 },
  modalInput: { backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, padding: 16, fontSize: 16, color: '#111827', marginBottom: 24 },
  cancelBtn: { padding: 16, alignItems: 'center', marginTop: 8 },
  cancelBtnText: { color: '#6B7280', fontWeight: 'bold', fontSize: 16 }
});
