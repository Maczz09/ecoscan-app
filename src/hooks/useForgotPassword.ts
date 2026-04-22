import { useState } from 'react';

export const useForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);

  const sendEmail = async (email: string) => {
    setIsLoading(true);
    return new Promise<{ success: boolean }>((resolve) => {
      setTimeout(() => {
        setIsLoading(false);
        resolve({ success: true }); 
      }, 1500);
    });
  };

  const validateCode = async (code: string) => {
    setIsLoading(true);
    return new Promise<{ success: boolean; message?: string }>((resolve) => {
      setTimeout(() => {
        setIsLoading(false);
        if (code === '123456') { 
          resolve({ success: true });
        } else {
          resolve({ success: false, message: 'El código no coincide con nuestros registros.' });
        }
      }, 1000);
    });
  };

  const changePassword = async (newPassword: string) => {
    setIsLoading(true);
    return new Promise<{ success: boolean }>((resolve) => {
      setTimeout(() => {
        setIsLoading(false);
        resolve({ success: true });
      }, 1500);
    });
  };

  return { sendEmail, validateCode, changePassword, isLoading };
};