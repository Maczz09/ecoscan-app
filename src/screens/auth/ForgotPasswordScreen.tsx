import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { CustomInput } from '@/src/components/CustomInput';
import { CustomButton } from '@/src/components/CustomButton';
import { useForgotPassword } from '@/src/hooks/useForgotPassword'; 

export const ForgotPasswordScreen = () => {
  const router = useRouter();
  
  
  const { sendEmail, validateCode, changePassword, isLoading } = useForgotPassword();
  
  const [step, setStep] = useState(1); 
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleSendEmail = async () => {
    if (!email) return Alert.alert('Error', 'Ingresa tu correo electrónico.');
    const result = await sendEmail(email);
    if (result.success) setStep(2);
  };

  const handleValidateCode = async () => {
    if (!code) return Alert.alert('Error', 'Ingresa el código.');
    const result = await validateCode(email, code);
    if (result.success) {
      setStep(3);
    } else {
      Alert.alert('Código Incorrecto', result.message || 'Error de validación');
    }
  };

  const handleChangePassword = async () => {
    if (newPassword.length < 6) return Alert.alert('Error', 'La contraseña debe ser mayor a 6 caracteres.');
    const result = await changePassword(email, code, newPassword);
    if (result.success) setStep(4);
    else Alert.alert('Error', result.message || 'Hubo un error al actualizar');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        <View style={styles.headerContainer}>
          <MaterialCommunityIcons name="shield-lock-outline" size={60} color="#10B981" />
          <Text style={styles.title}>Recuperar Acceso</Text>
        </View>

        {step === 1 && (
          <View style={styles.formContainer}>
            <Text style={styles.subtitle}>Ingresa tu correo para enviarte un código de verificación.</Text>
            <CustomInput label="Correo Electrónico" iconName="email-outline" placeholder="ejemplo@correo.com" value={email} onChangeText={setEmail} autoCapitalize="none" />
            <CustomButton title="Enviar Código" onPress={handleSendEmail} isLoading={isLoading} />
            <CustomButton title="Cancelar" onPress={() => router.replace('/(auth)/login')} />
          </View>
        )}

        {step === 2 && (
          <View style={styles.formContainer}>
            <Text style={styles.subtitle}>Hemos enviado un código a {email}.</Text>
            <CustomInput label="Código de 6 dígitos" iconName="message-processing-outline" placeholder="123456" value={code} onChangeText={setCode} keyboardType="numeric" />
            <CustomButton title="Validar Código" onPress={handleValidateCode} isLoading={isLoading} />
            <CustomButton title="Volver" onPress={() => setStep(1)} />
          </View>
        )}

        {step === 3 && (
          <View style={styles.formContainer}>
            <Text style={styles.subtitle}>Código verificado. Ingresa tu nueva contraseña segura.</Text>
            <CustomInput label="Nueva Contraseña" iconName="lock-reset" placeholder="••••••••" value={newPassword} onChangeText={setNewPassword} secureTextEntry />
            <CustomButton title="Actualizar Contraseña" onPress={handleChangePassword} isLoading={isLoading} />
          </View>
        )}

        {step === 4 && (
          <View style={styles.successContainer}>
            <MaterialCommunityIcons name="check-decagram" size={80} color="#10B981" />
            <Text style={styles.title}>¡Todo listo!</Text>
            <Text style={styles.subtitle}>Tu contraseña ha sido actualizada en la base de datos de ECOSCAN.</Text>
            <CustomButton title="Ir a Iniciar Sesión" onPress={() => router.replace('/(auth)/login')} />
          </View>
        )}

      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  container: { flex: 1, justifyContent: 'center', paddingHorizontal: 24, marginTop: -50 },
  headerContainer: { alignItems: 'center', marginBottom: 20 },
  formContainer: { width: '100%' },
  title: { fontSize: 26, fontWeight: '900', color: '#111827', marginTop: 10, textAlign: 'center' },
  subtitle: { fontSize: 15, color: '#6B7280', textAlign: 'center', marginBottom: 25 },
  successContainer: { alignItems: 'center', justifyContent: 'center' },
});