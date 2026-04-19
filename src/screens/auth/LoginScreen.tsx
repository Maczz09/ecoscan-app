import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Importamos nuestros componentes y hooks
import { CustomInput } from '../../components/CustomInput';
import { CustomButton } from '../../components/CustomButton';
import { useAuth } from '../../hooks/useAuth';

export const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const { login, isLoading } = useAuth();
  const router = useRouter();

const handleLogin = async () => {
    if (!email || !password) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    const result = await login(email, password);
    
    if (result.success) {
      // Quitamos el alert y activamos la redirección a las pestañas (Dashboard)
      router.replace('/(tabs)'); 
    } else {
      alert(result.message || 'Error al iniciar sesión');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        {/* Encabezado y Logo */}
        <View style={styles.headerContainer}>
          <View style={styles.logoCircle}>
            <MaterialCommunityIcons name="recycle" size={60} color="#10B981" />
          </View>
          <Text style={styles.title}>ECOSCAN</Text>
          <Text style={styles.subtitle}>Gestión inteligente para un futuro limpio</Text>
        </View>

        {/* Formulario */}
        <View style={styles.formContainer}>
          <CustomInput 
            label="Correo Electrónico"
            iconName="email-outline"
            placeholder="ejemplo@correo.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <CustomInput 
            label="Contraseña"
            iconName="lock-outline"
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

<TouchableOpacity style={styles.forgotPassword} onPress={() => router.push('/(auth)/forgot-password')}>
  <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
</TouchableOpacity>

          <CustomButton 
            title="Ingresar" 
            onPress={handleLogin} 
            isLoading={isLoading} 
          />
        </View>

        {/* Pie de página (Registro) */}
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>¿No tienes una cuenta de familia? </Text>
<TouchableOpacity onPress={() => router.push('/(auth)/register')}>
  <Text style={styles.registerText}>Regístrate</Text>
</TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  container: { flex: 1, justifyContent: 'center', paddingHorizontal: 24 },
  
  headerContainer: { alignItems: 'center', marginBottom: 40 },
  logoCircle: {
    width: 100, height: 100,
    borderRadius: 50,
    backgroundColor: '#ECFDF5', // Verde muy claro
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: { fontSize: 32, fontWeight: '900', color: '#111827', letterSpacing: 1 },
  subtitle: { fontSize: 15, color: '#6B7280', marginTop: 4 },
  
  formContainer: { width: '100%' },
  forgotPassword: { alignSelf: 'flex-end', marginBottom: 24, marginTop: -4 },
  forgotPasswordText: { color: '#10B981', fontSize: 14, fontWeight: '600' },
  
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 40,
  },
  footerText: { color: '#6B7280', fontSize: 14 },
  registerText: { color: '#10B981', fontSize: 14, fontWeight: 'bold' },
});