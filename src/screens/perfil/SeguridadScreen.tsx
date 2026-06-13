import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView, Modal, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import api from '@/src/services/api';

export const SeguridadScreen = () => {
  const router = useRouter();
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!currentPassword) {
      return Alert.alert('Error', 'Ingresa tu contraseña actual');
    }
    if (newPassword.length < 6) {
      return Alert.alert('Error', 'La nueva contraseña debe tener al menos 6 caracteres');
    }
    if (newPassword !== confirmPassword) {
      return Alert.alert('Error', 'Las nuevas contraseñas no coinciden');
    }

    setIsLoading(true);
    try {
      await api.put('/v1/user-profile', { 
        current_password: currentPassword, 
        new_password: newPassword 
      });
      setShowSuccess(true);
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Error al actualizar contraseña');
    } finally {
      setIsLoading(false);
    }
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
        <Text style={styles.headerTitle}>Seguridad</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Text style={styles.description}>
            Actualiza tu contraseña para mantener tu cuenta segura.
          </Text>

          {/* CONTRASEÑA ACTUAL */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Contraseña actual</Text>
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons name="lock-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                placeholder="Ingresa tu contraseña actual"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showCurrent}
              />
              <TouchableOpacity onPress={() => setShowCurrent(!showCurrent)} style={styles.eyeBtn}>
                <MaterialCommunityIcons name={showCurrent ? "eye-off-outline" : "eye-outline"} size={22} color="#6B7280" />
              </TouchableOpacity>
            </View>
          </View>

          {/* NUEVA CONTRASEÑA */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Nueva contraseña</Text>
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons name="lock-plus-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="Mínimo 8 caracteres"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showNew}
              />
              <TouchableOpacity onPress={() => setShowNew(!showNew)} style={styles.eyeBtn}>
                <MaterialCommunityIcons name={showNew ? "eye-off-outline" : "eye-outline"} size={22} color="#6B7280" />
              </TouchableOpacity>
            </View>
          </View>

          {/* CONFIRMAR NUEVA CONTRASEÑA */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Confirmar nueva contraseña</Text>
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons name="lock-check-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Vuelve a escribir la nueva contraseña"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showConfirm}
              />
              <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)} style={styles.eyeBtn}>
                <MaterialCommunityIcons name={showConfirm ? "eye-off-outline" : "eye-outline"} size={22} color="#6B7280" />
              </TouchableOpacity>
            </View>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>

      {/* BOTÓN GUARDAR */}
      <View style={styles.footer}>
        <TouchableOpacity style={[styles.saveBtn, isLoading && { opacity: 0.7 }]} onPress={handleSave} activeOpacity={0.8} disabled={isLoading}>
          <Text style={styles.saveBtnText}>{isLoading ? 'Actualizando...' : 'Actualizar Contraseña'}</Text>
        </TouchableOpacity>
      </View>

      {/* MODAL DE ÉXITO */}
      <Modal visible={showSuccess} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.successIconBox}>
              <MaterialCommunityIcons name="shield-check" size={40} color="#FFF" />
            </View>
            <Text style={styles.modalTitle}>¡Actualizada!</Text>
            <Text style={styles.modalMessage}>Tu contraseña se ha cambiado de manera exitosa.</Text>
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
  
  description: { fontSize: 14, color: '#6B7280', marginBottom: 25, lineHeight: 20 },

  formGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 },
  inputContainer: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF',
    borderRadius: 16, paddingLeft: 15, height: 55,
    borderWidth: 1, borderColor: '#E5E7EB'
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 15, color: '#111827' },
  eyeBtn: { padding: 15 },

  footer: { padding: 20, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#F3F4F6' },
  saveBtn: { backgroundColor: '#111827', paddingVertical: 16, borderRadius: 16, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 3 },
  saveBtnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 30, width: '100%', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 5 },
  successIconBox: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#3B82F6', justifyContent: 'center', alignItems: 'center', marginBottom: 20, shadowColor: '#3B82F6', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
  modalTitle: { fontSize: 22, fontWeight: 'bold', color: '#111827', marginBottom: 8 },
  modalMessage: { fontSize: 15, color: '#6B7280', textAlign: 'center', marginBottom: 25 },
  modalBtn: { backgroundColor: '#10B981', width: '100%', paddingVertical: 16, borderRadius: 16, alignItems: 'center' },
  modalBtnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' }
});
