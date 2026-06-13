import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';

import { CustomInput } from '@/src/components/CustomInput';
import { CustomButton } from '@/src/components/CustomButton';
import { useVerifyEmail } from '@/src/hooks/useVerifyEmail';

export const VerificationScreen = () => {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email: string }>();
  const { verifyEmail, resendCode, isLoading, isResending } = useVerifyEmail();
  
  const [codigo, setCodigo] = useState('');

  const handleVerify = async () => {
    if (!codigo || codigo.length !== 6) {
      return Alert.alert('Error', 'Por favor ingresa el código de 6 dígitos.');
    }

    if (!email) {
      return Alert.alert('Error', 'No se encontró el correo a verificar.');
    }

    const result = await verifyEmail(email, codigo);
    
    if (result.success) {
      Alert.alert('¡Éxito!', 'Tu cuenta ha sido verificada correctamente.', [
        { text: 'Ir al Login', onPress: () => router.replace('/(auth)/login') }
      ]);
    } else {
      Alert.alert('Error', result.message || 'Código inválido o expirado.');
    }
  };

  const handleResend = async () => {
    if (!email) return;
    const result = await resendCode(email);
    if (result.success) {
      Alert.alert('Código enviado', 'Se ha enviado un nuevo código a tu correo.');
    } else {
      Alert.alert('Error', result.message || 'No se pudo reenviar el código.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
        <View style={styles.formContainer}>
          <View style={styles.headerContainer}>
            <MaterialCommunityIcons name="email-check-outline" size={60} color="#10B981" style={{ marginBottom: 16 }} />
            <Text style={styles.title}>Verifica tu cuenta</Text>
            <Text style={styles.subtitle}>
              Hemos enviado un código de 6 dígitos a <Text style={{ fontWeight: 'bold' }}>{email || 'tu correo'}</Text>.
            </Text>
          </View>

          <CustomInput 
            label="Código de Verificación" 
            iconName="lock-outline" 
            placeholder="Ej. 123456" 
            value={codigo} 
            onChangeText={setCodigo} 
            keyboardType="number-pad"
            maxLength={6}
          />

          <CustomButton 
            title="Verificar Cuenta" 
            onPress={handleVerify} 
            isLoading={isLoading} 
          />

          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>¿No recibiste el código? </Text>
            <TouchableOpacity onPress={handleResend} disabled={isResending}>
              <Text style={styles.resendLink}>{isResending ? 'Enviando...' : 'Reenviar código'}</Text>
            </TouchableOpacity>
          </View>

          <CustomButton 
            title="Volver al Login" 
            onPress={() => router.replace('/(auth)/login' as any)} 
            isLoading={false} 
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  container: { flex: 1, justifyContent: 'center', paddingHorizontal: 24 },
  headerContainer: { alignItems: 'center', marginBottom: 30 },
  formContainer: { width: '100%' },
  title: { fontSize: 28, fontWeight: '900', color: '#111827', marginBottom: 8, textAlign: 'center' },
  subtitle: { fontSize: 15, color: '#6B7280', textAlign: 'center', marginBottom: 20 },
  resendContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 16, marginBottom: 24 },
  resendText: { color: '#6B7280', fontSize: 14 },
  resendLink: { color: '#10B981', fontSize: 14, fontWeight: 'bold' },
});
