import { useState } from 'react';
import { api } from '../services/api';

export const useVerifyEmail = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const verifyEmail = async (email: string, codigo: string) => {
    setIsLoading(true);

    try {
      const response = await api.post('/v1/verify-email', {
        email,
        codigo_verificacion: codigo
      });

      setIsLoading(false);
      return { success: true, message: response.data.message };

    } catch (error: any) {
      setIsLoading(false);
      let errorMessage = 'Ocurrió un error al verificar el correo.';

      if (error.response && error.response.data) {
        errorMessage = error.response.data.message || errorMessage;
      }

      return { success: false, message: errorMessage };
    }
  };

  const resendCode = async (email: string) => {
    setIsResending(true);

    try {
      const response = await api.post('/v1/resend-verification', { email });
      setIsResending(false);
      return { success: true, message: response.data.message };

    } catch (error: any) {
      setIsResending(false);
      let errorMessage = 'Ocurrió un error al reenviar el código.';

      if (error.response && error.response.data) {
        errorMessage = error.response.data.message || errorMessage;
      }

      return { success: false, message: errorMessage };
    }
  };

  return { verifyEmail, resendCode, isLoading, isResending };
};
