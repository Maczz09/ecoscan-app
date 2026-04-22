import { useState } from 'react';
import { useAuthStore } from '@/src/store/useAuthStore'; 

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const setAuth = useAuthStore((state) => state.setAuth); 

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    return new Promise<{ success: boolean; message?: string }>((resolve) => {
      setTimeout(() => {
        setIsLoading(false);
        
        if (email === 'admin@ecoscan.com' && password === '123456') {
          
          const mockUser = { id_usuario: 1, nombre: 'Max Garcia', email: 'admin@ecoscan.com' };
          const mockToken = 'tokentest123456';
          
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