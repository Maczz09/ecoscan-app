import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { usePerfil } from '@/src/hooks/usePerfil';

export const EditarPerfilScreen = () => {
  const router = useRouter();
  const { user } = usePerfil();

  const [nombre, setNombre] = useState(user?.nombre || '');
  const [email, setEmail] = useState(user?.email || '');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSave = () => {
    // Aquí iría la lógica para enviar al backend (ej. PUT /api/usuarios/me)
    // Mostramos el modal de éxito
    setShowSuccess(true);
  };

  const handleSuccessAccept = () => {
    setShowSuccess(false);
    router.back();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Editar Perfil</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* FOTO DE PERFIL (MOCK) */}
          <View style={styles.avatarSection}>
            <View style={styles.avatarContainer}>
              <MaterialCommunityIcons name="account" size={50} color="#10B981" />
              <TouchableOpacity style={styles.editAvatarBtn}>
                <MaterialCommunityIcons name="camera-plus" size={16} color="#FFF" />
              </TouchableOpacity>
            </View>
            <Text style={styles.avatarHint}>Cambiar foto de perfil</Text>
          </View>

          {/* FORMULARIO */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Nombre completo</Text>
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons name="account-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={nombre}
                onChangeText={setNombre}
                placeholder="Ingresa tu nombre"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Correo electrónico</Text>
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons name="email-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Ingresa tu email"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* BOTÓN GUARDAR (Fijo abajo) */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.8}>
          <Text style={styles.saveBtnText}>Guardar Cambios</Text>
        </TouchableOpacity>
      </View>

      {/* MODAL DE ÉXITO */}
      <Modal visible={showSuccess} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.successIconBox}>
              <MaterialCommunityIcons name="check" size={40} color="#FFF" />
            </View>
            <Text style={styles.modalTitle}>¡Excelente!</Text>
            <Text style={styles.modalMessage}>Se ha actualizado tu perfil con éxito.</Text>
            <TouchableOpacity style={styles.modalBtn} onPress={handleSuccessAccept}>
              <Text style={styles.modalBtnText}>Aceptar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
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
  scrollContent: { padding: 20 },
  
  avatarSection: { alignItems: 'center', marginVertical: 20 },
  avatarContainer: {
    width: 90, height: 90, borderRadius: 45, backgroundColor: '#ECFDF5', 
    justifyContent: 'center', alignItems: 'center', position: 'relative',
    borderWidth: 3, borderColor: '#FFFFFF', shadowColor: '#10B981', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8,
  },
  editAvatarBtn: {
    position: 'absolute', bottom: 0, right: 0, backgroundColor: '#10B981',
    width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: '#FFFFFF'
  },
  avatarHint: { marginTop: 12, fontSize: 13, color: '#10B981', fontWeight: '500' },

  formGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 },
  inputContainer: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF',
    borderRadius: 16, paddingHorizontal: 15, height: 55,
    borderWidth: 1, borderColor: '#E5E7EB'
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 15, color: '#111827' },

  footer: { padding: 20, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#F3F4F6' },
  saveBtn: { backgroundColor: '#10B981', paddingVertical: 16, borderRadius: 16, alignItems: 'center', shadowColor: '#10B981', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 3 },
  saveBtnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 30, width: '100%', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 5 },
  successIconBox: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#10B981', justifyContent: 'center', alignItems: 'center', marginBottom: 20, shadowColor: '#10B981', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
  modalTitle: { fontSize: 22, fontWeight: 'bold', color: '#111827', marginBottom: 8 },
  modalMessage: { fontSize: 15, color: '#6B7280', textAlign: 'center', marginBottom: 25 },
  modalBtn: { backgroundColor: '#111827', width: '100%', paddingVertical: 16, borderRadius: 16, alignItems: 'center' },
  modalBtnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' }
});
