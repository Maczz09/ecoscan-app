import { useState } from 'react';
import { api } from '../services/api';
import { Rol } from '../types/database';

export const useRegister = () => {
  const [isLoading, setIsLoading] = useState(false);

  const register = async (nombre: string, email: string, password: string, rol: Rol) => {
    setIsLoading(true);
    
    try {
      // Enviamos el registro al backend de Laravel
      const response = await api.post('/register', {
        nombre,
        email,
        password,
      });

      setIsLoading(false);

      if (response.data.status === 'success') {
        return { success: true };
      } else {
        return { success: true }; // Si la respuesta de Laravel es exitosa (201) pero tiene otra estructura, lo tomamos como exitoso
      }
    } catch (err: any) {
      setIsLoading(false);
      
      let errorMessage = 'Ocurrió un error inesperado al registrarse.';
      
      if (err.response) {
        // Errores retornados por Laravel
        const data = err.response.data;
        
        if (data.errors) {
          // Capturar errores de validación específicos (ej: email repetido, password corta)
          errorMessage = Object.values(data.errors).flat().join('\n');
        } else if (data.message) {
          errorMessage = data.message;
        }
      } else if (err.request) {
        // Error de red (ej: IP incorrecta, Docker apagado)
        errorMessage = 'No se pudo conectar con el servidor. Verifica que tu backend esté encendido y que estés conectado a la misma red Wi-Fi.';
      }

      return { success: false, message: errorMessage };
    }
  };

  return { register, isLoading };
};