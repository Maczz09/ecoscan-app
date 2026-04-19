import { useState } from 'react';

export const useRegister = () => {
  const [isLoading, setIsLoading] = useState(false);

  const register = async (nombre: string, email: string, password: string) => {
    setIsLoading(true);
    
    // Simulación de conexión a la API de Laravel
    return new Promise<{ success: boolean; message?: string }>((resolve) => {
      setTimeout(() => {
        setIsLoading(false);
        
        // Simulamos una validación simple (ej. que el correo no exista ya)
        if (email === 'admin@ecoscan.com') {
          resolve({ success: false, message: 'Este correo ya está registrado en la base de datos.' });
        } else {
          resolve({ success: true });
        }
      }, 1500);
    });
  };

  return { register, isLoading };
};