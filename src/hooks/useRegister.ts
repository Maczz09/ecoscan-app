import { useState } from 'react';

export const useRegister = () => {
  const [isLoading, setIsLoading] = useState(false);

  const register = async (nombre: string, email: string, password: string) => {
    setIsLoading(true);
    
    return new Promise<{ success: boolean; message?: string }>((resolve) => {
      setTimeout(() => {
        setIsLoading(false);
        
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