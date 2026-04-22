import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { CustomInput } from '@/src/components/CustomInput';
import { CustomButton } from '@/src/components/CustomButton';
import { useRegister } from '@/src/hooks/useRegister'; 

export const RegisterScreen = () => {
  const router = useRouter();
  const { register, isLoading } = useRegister(); 
  
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSuccess, setIsSuccess] = useState(false); 

  const handleRegister = async () => {
    if (!nombre || !email || !password) {
      return Alert.alert('Error', 'Completa todos los campos obligatorios.');
    }

    const result = await register(nombre, email, password);
    
    if (result.success) {
      setIsSuccess(true);
    } else {
      Alert.alert('Error', result.message || 'Ocurrió un error inesperado.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
        
        {isSuccess ? (
          <View style={styles.successContainer}>
            <MaterialCommunityIcons name="check-circle" size={80} color="#10B981" />
            <Text style={styles.title}>¡Cuenta Creada!</Text>
            <Text style={styles.subtitle}>Tu usuario ha sido registrado con éxito en ECOSCAN.</Text>
            <CustomButton title="Ir al Login" onPress={() => router.replace('/(auth)/login')} />
          </View>
        ) : (
          <View style={styles.formContainer}>
            <View style={styles.headerContainer}>
              <Text style={styles.title}>Únete a ECOSCAN</Text>
              <Text style={styles.subtitle}>Crea tu cuenta y empieza a reciclar</Text>
            </View>

            <CustomInput label="Nombre Completo" iconName="account-outline" placeholder="Ej. Max Garcia" value={nombre} onChangeText={setNombre} />
            <CustomInput label="Correo Electrónico" iconName="email-outline" placeholder="ejemplo@correo.com" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
            <CustomInput label="Contraseña" iconName="lock-outline" placeholder="••••••••" value={password} onChangeText={setPassword} secureTextEntry />

            <CustomButton title="Registrarse" onPress={handleRegister} isLoading={isLoading} />
            <CustomButton title="Volver al Login" onPress={() => router.replace('/(auth)/login')} isLoading={false} />
          </View>
        )}
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
  successContainer: { alignItems: 'center', justifyContent: 'center' },
});