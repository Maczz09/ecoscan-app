import { useAuthStore } from '@/src/store/useAuthStore';
import { Rol } from '@/src/types/database';
import { useState } from 'react';
import api from '../services/api';

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const setAuth = useAuthStore((state) => state.setAuth);

  const login = async (email: string, password: string) => {
    setIsLoading(true);

    try {
      const response = await api.post('/v1/login', { email, password });

      const userData = response.data.data;

      const user = {
        id_usuario: userData.user_id,
        nombre: userData.nombre,
        email: userData.email,
        rol: userData.rol as Rol,
        id_grupo: undefined
      };

      setAuth(user, userData.token);
      setIsLoading(false);
      return { success: true };

    } catch (error: any) {
      setIsLoading(false);
      let errorMessage = 'Credenciales incorrectas.';
      if (error.response && error.response.data) {
        errorMessage = error.response.data.message || errorMessage;
      }
      return { success: false, message: errorMessage };
    }
  };

  return { login, isLoading };
};