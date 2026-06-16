import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Redirect } from 'expo-router';
import { useAuthStore } from '@/src/store/useAuthStore';

export default function Index() {
  const [isReady, setIsReady] = useState(false);
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    // Zustand persist tarda unos milisegundos en cargar los datos de AsyncStorage.
    // Aquí esperamos a que termine de "hidratarse" (leer el disco) antes de decidir a dónde ir.
    const hasHydrated = useAuthStore.persist.hasHydrated();
    
    if (hasHydrated) {
      setIsReady(true);
    } else {
      const unsub = useAuthStore.persist.onFinishHydration(() => setIsReady(true));
      return () => {
        unsub();
      };
    }
  }, []);

  // Mientras carga la memoria del celular, mostramos un spinner
  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF' }}>
        <ActivityIndicator size="large" color="#10B981" />
      </View>
    );
  }

  // Si encontramos un token guardado en la memoria, el usuario ya estaba logueado
  if (token) {
    return <Redirect href="/(tabs)" />;
  }

  // Si no hay token, lo mandamos a la pantalla de Login
  return <Redirect href="/(auth)/login" />;
}