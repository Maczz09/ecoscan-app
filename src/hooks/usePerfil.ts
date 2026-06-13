import { useState, useEffect, useCallback } from 'react';
import { Usuario } from '@/src/types/database';
import api from '@/src/services/api';
import { useAuthStore } from '@/src/store/useAuthStore';
import { usePointsStore } from '@/src/store/usePointsStore';
import { useRouter } from 'expo-router';

export const usePerfil = () => {
  const [user, setUser] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  
  const authLogout = useAuthStore(state => state.logout);
  const setGlobalPoints = usePointsStore(state => state.setPuntos);
  const router = useRouter();

  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/v1/user-profile');
      
      if (response.data.status === 'success') {
        const userData = response.data.data;
        setUser(userData);
        
        // Sincronizar puntos globales
        if (userData.eco_puntos_personales !== undefined) {
          setGlobalPoints(userData.eco_puntos_personales);
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  }, [setGlobalPoints]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const logout = async () => {
    try {
      await api.post('/v1/logout');
      
      // Limpiar estados globales
      authLogout();
      setGlobalPoints(0);
      
      console.log('Sesión cerrada');
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      // Forzamos cierre local de todos modos
      authLogout();
      router.replace('/(auth)/login');
    }
  };

  return {
    user,
    loading,
    logout,
    refreshProfile: fetchUser
  };
};
