import { useState } from 'react';

export const useForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);

  // Simula el envío del código al correo
  const sendEmail = async (email: string) => {
    setIsLoading(true);
    return new Promise<{ success: boolean }>((resolve) => {
      setTimeout(() => {
        setIsLoading(false);
        resolve({ success: true }); // Asumimos que el correo siempre se envía en esta simulación
      }, 1500);
    });
  };

  // Simula la consulta a la BD para cruzar el código ingresado con el `codigo_verificacion`
  const validateCode = async (code: string) => {
    setIsLoading(true);
    return new Promise<{ success: boolean; message?: string }>((resolve) => {
      setTimeout(() => {
        setIsLoading(false);
        if (code === '123456') { // Nuestro código maestro de prueba
          resolve({ success: true });
        } else {
          resolve({ success: false, message: 'El código no coincide con nuestros registros.' });
        }
      }, 1000);
    });
  };

  // Simula la actualización del `password_hash` en la BD
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