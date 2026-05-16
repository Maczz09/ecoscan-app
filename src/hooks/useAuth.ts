import { useState } from 'react';
import { useAuthStore } from '@/src/store/useAuthStore'; 
import { Rol } from '@/src/types/database';

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const setAuth = useAuthStore((state) => state.setAuth); 

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    return new Promise<{ success: boolean; message?: string }>((resolve) => {
      setTimeout(() => {
        setIsLoading(false);
        
        if (email === 'admin@ecoscan.com' && password === '123456') {
          // MOCK: Usuario con rol ADMIN_GROUP y asignado al grupo 100
          const mockUser = { 
            id_usuario: 1, 
            nombre: 'Max Garcia', 
            email: 'admin@ecoscan.com',
            rol: 'ADMIN_GROUP' as Rol,
            id_grupo: 100
          };
          setAuth(mockUser, 'tokentest_admin');
          resolve({ success: true });
          
        } else if (email === 'user@ecoscan.com' && password === '123456') {
          // MOCK: Usuario con rol USER y asignado al grupo 100
          const mockUser = { 
            id_usuario: 2, 
            nombre: 'Ana Lopez', 
            email: 'user@ecoscan.com',
            rol: 'USER' as Rol,
            id_grupo: 100
          };
          setAuth(mockUser, 'tokentest_user');
          resolve({ success: true });

        } else if (email === 'nuevo@ecoscan.com' && password === '123456') {
          // MOCK: Usuario con rol USER pero SIN GRUPO asignado
          const mockUser = { 
            id_usuario: 3, 
            nombre: 'Carlos Ruiz', 
            email: 'nuevo@ecoscan.com',
            rol: 'USER' as Rol,
            id_grupo: undefined
          };
          setAuth(mockUser, 'tokentest_nuevo');
          resolve({ success: true });

        } else {
          resolve({ success: false, message: 'Credenciales incorrectas. Prueba con admin@ecoscan.com, user@ecoscan.com o nuevo@ecoscan.com (clave: 123456)' });
        }
      }, 1500);
    });
  };

  return { login, isLoading };
};