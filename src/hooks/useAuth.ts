import { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore'; // <-- Importamos el store

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const setAuth = useAuthStore((state) => state.setAuth); // <-- Traemos la función de guardado

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    return new Promise<{ success: boolean; message?: string }>((resolve) => {
      setTimeout(() => {
        setIsLoading(false);
        
        // Validamos nuestras credenciales de prueba
        if (email === 'admin@ecoscan.com' && password === '123456') {
          
          // Simulamos los datos que vendrían de tu base de datos
          const mockUser = { id_usuario: 1, nombre: 'Max Garcia', email: 'admin@ecoscan.com' };
          const mockToken = 'tokentest123456';
          
          // ¡Aquí está la magia! Guardamos en el Store global
          setAuth(mockUser, mockToken);
          
          resolve({ success: true });
        } else {
          resolve({ success: false, message: 'Credenciales incorrectas' });
        }
      }, 1500);
    });
  };

  return { login, isLoading };
};