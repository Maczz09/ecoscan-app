import { useState } from 'react';
import { api } from '../services/api';
import { Rol } from '../types/database';

export const useRegister = () => {
  const [isLoading, setIsLoading] = useState(false);

  const register = async (nombre: string, email: string, password: string, rol: Rol) => {
    setIsLoading(true);

    try {
      const id_rol = rol === 'USER' ? 1 : 2;

      const response = await api.post('/v1/register', {
        nombre,
        email,
        password,
        id_rol
      });

      setIsLoading(false);
      return { success: true, message: response.data.message };

    } catch (error: any) {
      setIsLoading(false);

      let errorMessage = 'Ocurrió un error al intentar registrarse.';

      if (error.response && error.response.data) {
        errorMessage = error.response.data.message || errorMessage;
      }

      return { success: false, message: errorMessage };
    }
  };

  return { register, isLoading };
};