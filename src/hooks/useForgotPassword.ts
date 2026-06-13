import { useState } from 'react';
import api from '../services/api';

export const useForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);

  const sendEmail = async (email: string) => {
    setIsLoading(true);
    try {
      const response = await api.post('/v1/forgot-password', { email });
      return { success: true, message: response.data.message };
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || 'Error al enviar correo' };
    } finally {
      setIsLoading(false);
    }
  };

  const validateCode = async (email: string, code: string) => {
    setIsLoading(true);
    try {
      const response = await api.post('/v1/verify-reset-code', { email, codigo: code });
      return { success: true, message: response.data.message };
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || 'El código es incorrecto o ha expirado.' };
    } finally {
      setIsLoading(false);
    }
  };

  const changePassword = async (email: string, code: string, newPassword: string) => {
    setIsLoading(true);
    try {
      const response = await api.post('/v1/reset-password', { email, codigo: code, password: newPassword });
      return { success: true, message: response.data.message };
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || 'Error al cambiar la contraseña' };
    } finally {
      setIsLoading(false);
    }
  };

  return { sendEmail, validateCode, changePassword, isLoading };
};