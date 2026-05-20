import { useState } from 'react';
import { useAuthStore } from '@/src/store/useAuthStore'; 
import { Rol } from '@/src/types/database';
import { api } from '../services/api';

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const setAuth = useAuthStore((state) => state.setAuth); 

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      const response = await api.post('/login', { email, password });
      setIsLoading(false);

      if (response.data.status === 'success') {
        const { user_id, nombre, rol, token } = response.data.data;
        
        // Mapeamos el rol 'ADMIN' del backend de Laravel al rol 'ADMIN_GROUP'
        // que maneja nuestro frontend para mantener la compatibilidad con todas las pantallas de tachos
        const mappedRol: Rol = rol === 'ADMIN' ? 'ADMIN_GROUP' : (rol as Rol);

        // Guardamos los datos de autenticación reales en Zustand
        setAuth({
          id_usuario: user_id,
          nombre,
          email,
          rol: mappedRol,
          id_grupo: 100 // Simulación del grupo de tachos para el flujo actual
        }, token);

        return { success: true };
      } else {
        return { success: false, message: response.data.message || 'Error de autenticación.' };
      }
    } catch (err: any) {
      setIsLoading(false);
      
      let errorMessage = 'Credenciales incorrectas o error al intentar conectar con el servidor.';
      
      if (err.response) {
        const data = err.response.data;
        if (data.message) {
          errorMessage = data.message;
        }
      } else if (err.request) {
        errorMessage = 'No se pudo conectar con el servidor. Verifica que tu backend esté encendido y configurado en la misma red Wi-Fi.';
      }

      return { success: false, message: errorMessage };
    }
  };

  return { login, isLoading };
};