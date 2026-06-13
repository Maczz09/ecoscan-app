import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/src/store/useAuthStore';
import api from '@/src/services/api';

export const AjustesGrupoScreen = () => {
  const router = useRouter();
  const user = useAuthStore(state => state.user);
  
  const [loading, setLoading] = useState(true);
  const [grupoData, setGrupoData] = useState<any>(null);

  const fetchGrupo = async () => {
    setLoading(true);
    try {
      const res = await api.get('/v1/grupos');
      const grupos = res.data.data;
      if (grupos && grupos.length > 0) {
        const detailRes = await api.get(`/v1/grupos/${grupos[0].id_grupo}`);
        setGrupoData(detailRes.data.data);
      } else {
        router.replace('/perfil');
      }
    } catch (error) {
      console.error('Error fetching group in ajustes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrupo();
  }, []);

  const handleLeaveGroup = () => {
    Alert.alert(
      'Abandonar Familia',
      '¿Estás seguro de que deseas salir de este grupo? Perderás el acceso a las estadísticas.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Sí, Salir', 
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/v1/grupos/${grupoData.id_grupo}/leave`);
              Alert.alert('Éxito', 'Has abandonado la familia');
              router.replace('/perfil');
            } catch (error: any) {
              Alert.alert('Error', error.response?.data?.message || 'No se pudo abandonar el grupo');
            }
          }
        }
      ]
    );
  };

  const handleRemoveMember = (userId: number, userName: string) => {
    Alert.alert(
      'Expulsar Miembro',
      `¿Estás seguro de que deseas eliminar a ${userName} de la familia?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Expulsar', 
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/v1/grupos/${grupoData.id_grupo}/members/${userId}`);
              Alert.alert('Éxito', 'Miembro expulsado correctamente');
              fetchGrupo(); // Recargar lista
            } catch (error: any) {
              Alert.alert('Error', error.response?.data?.message || 'No se pudo expulsar al miembro');
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#10B981" />
      </SafeAreaView>
    );
  }

  const isAdmin = grupoData?.ranking?.find((m: any) => m.id_usuario === user?.id_usuario)?.rol_en_grupo === 'ADMIN_GRUPO';

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ajustes de la Familia</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información</Text>
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Nombre de la Familia</Text>
            <Text style={styles.infoValue}>{grupoData.nombre_grupo}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Miembros</Text>
          <Text style={styles.sectionSubtitle}>Gestiona quién pertenece a tu familia.</Text>

          <View style={styles.listContainer}>
            {grupoData.ranking?.map((member: any) => (
              <View key={member.id_usuario} style={styles.memberCard}>
                <View style={styles.memberInfo}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{member.nombre.charAt(0)}</Text>
                  </View>
                  <View>
                    <Text style={styles.memberName}>{member.nombre} {member.id_usuario === user?.id_usuario ? '(Tú)' : ''}</Text>
                    <Text style={styles.memberRole}>
                      {member.rol_en_grupo === 'ADMIN_GRUPO' ? 'Admin. de Grupo' : 'Miembro'}
                    </Text>
                  </View>
                </View>

                {isAdmin && member.id_usuario !== user?.id_usuario && (
                  <View style={styles.actionsRow}>
                    <TouchableOpacity 
                      style={styles.actionIconBtn}
                      onPress={() => handleRemoveMember(member.id_usuario, member.nombre)}
                    >
                      <MaterialCommunityIcons name="account-remove" size={22} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>

        <View style={styles.dangerZone}>
          <TouchableOpacity style={styles.leaveBtn} onPress={handleLeaveGroup}>
            <MaterialCommunityIcons name="exit-run" size={24} color="#EF4444" />
            <Text style={styles.leaveBtnText}>Abandonar Familia</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F3F4F6' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 15, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  backButton: { padding: 5 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  
  container: { padding: 20 },
  
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#374151', marginBottom: 6 },
  sectionSubtitle: { fontSize: 14, color: '#6B7280', marginBottom: 16 },
  
  infoBox: { backgroundColor: '#FFF', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB' },
  infoLabel: { fontSize: 12, color: '#6B7280', marginBottom: 4 },
  infoValue: { fontSize: 16, fontWeight: 'bold', color: '#111827' },

  divider: { height: 1, backgroundColor: '#E5E7EB', marginVertical: 10 },
  
  listContainer: { gap: 12 },
  memberCard: { flexDirection: 'row', backgroundColor: '#FFF', padding: 16, borderRadius: 12, alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: '#F3F4F6' },
  memberInfo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#D1FAE5', alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 16, fontWeight: 'bold', color: '#059669' },
  memberName: { fontSize: 16, fontWeight: '600', color: '#111827' },
  memberRole: { fontSize: 13, color: '#6B7280' },
  
  actionsRow: { flexDirection: 'row', gap: 8 },
  actionIconBtn: { padding: 8, backgroundColor: '#FEE2E2', borderRadius: 8 },

  dangerZone: { marginTop: 40, alignItems: 'center' },
  leaveBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 16, borderRadius: 12, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#FECACA', width: '100%', justifyContent: 'center' },
  leaveBtnText: { color: '#EF4444', fontWeight: 'bold', fontSize: 16 }
});
