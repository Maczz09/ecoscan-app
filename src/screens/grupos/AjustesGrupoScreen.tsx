import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { CustomInput } from '@/src/components/CustomInput';
import { CustomButton } from '@/src/components/CustomButton';

// MOCK DATA basado en la BD: grupos y usuario_grupos
const initialMembers = [
  { id: 1, name: 'Max Garcia', role: 'ADMIN_GRUPO' },
  { id: 2, name: 'Ana Lopez', role: 'MIEMBRO' },
  { id: 3, name: 'Carlos Ruiz', role: 'MIEMBRO' },
];

export const AjustesGrupoScreen = () => {
  const router = useRouter();
  const [groupName, setGroupName] = useState('Familia García');
  const [members, setMembers] = useState(initialMembers);

  const handleSaveGroupName = () => {
    Alert.alert('Guardado', `El nombre del grupo ha sido actualizado a: ${groupName}`);
  };

  const handleChangeRole = (userId: number, currentRole: string) => {
    const newRole = currentRole === 'ADMIN_GRUPO' ? 'MIEMBRO' : 'ADMIN_GRUPO';
    
    Alert.alert(
      'Cambiar Rol',
      `¿Estás seguro de cambiar el rol a ${newRole}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Sí, cambiar', 
          onPress: () => {
            setMembers(members.map(m => m.id === userId ? { ...m, role: newRole } : m));
          }
        }
      ]
    );
  };

  const handleRemoveMember = (userId: number, userName: string) => {
    Alert.alert(
      'Eliminar Miembro',
      `¿Estás seguro de que deseas eliminar a ${userName} del grupo?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          style: 'destructive',
          onPress: () => {
            setMembers(members.filter(m => m.id !== userId));
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ajustes del Grupo</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información del Grupo</Text>
          <CustomInput 
            label="Nombre del Grupo" 
            iconName="account-group-outline" 
            placeholder="Ej. Mi Familia" 
            value={groupName} 
            onChangeText={setGroupName} 
          />
          <CustomButton title="Guardar Cambios" onPress={handleSaveGroupName} />
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gestión de Miembros</Text>
          <Text style={styles.sectionSubtitle}>Asigna roles o elimina miembros de tu grupo.</Text>

          <View style={styles.listContainer}>
            {members.map((member) => (
              <View key={member.id} style={styles.memberCard}>
                <View style={styles.memberInfo}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{member.name.charAt(0)}</Text>
                  </View>
                  <View>
                    <Text style={styles.memberName}>{member.name}</Text>
                    <Text style={styles.memberRole}>
                      {member.role === 'ADMIN_GRUPO' ? 'Admin. de Grupo' : 'Miembro'}
                    </Text>
                  </View>
                </View>

                {/* Acciones para el admin (no se puede auto-eliminar si es el id 1 en este mock) */}
                {member.id !== 1 && (
                  <View style={styles.actionsRow}>
                    <TouchableOpacity 
                      style={styles.actionIconBtn} 
                      onPress={() => handleChangeRole(member.id, member.role)}
                    >
                      <MaterialCommunityIcons 
                        name={member.role === 'ADMIN_GRUPO' ? "account-arrow-down" : "account-arrow-up"} 
                        size={22} 
                        color="#10B981" 
                      />
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.actionIconBtn}
                      onPress={() => handleRemoveMember(member.id, member.name)}
                    >
                      <MaterialCommunityIcons name="account-remove" size={22} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F3F4F6' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 15, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  backButton: { padding: 5 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  
  container: { padding: 20 },
  
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#374151', marginBottom: 6 },
  sectionSubtitle: { fontSize: 14, color: '#6B7280', marginBottom: 16 },
  
  divider: { height: 1, backgroundColor: '#E5E7EB', marginVertical: 10 },
  
  listContainer: { gap: 12 },
  memberCard: { flexDirection: 'row', backgroundColor: '#FFF', padding: 16, borderRadius: 12, alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: '#F3F4F6' },
  memberInfo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#D1FAE5', alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 16, fontWeight: 'bold', color: '#059669' },
  memberName: { fontSize: 16, fontWeight: '600', color: '#111827' },
  memberRole: { fontSize: 13, color: '#6B7280' },
  
  actionsRow: { flexDirection: 'row', gap: 8 },
  actionIconBtn: { padding: 8, backgroundColor: '#F9FAFB', borderRadius: 8 },
});
