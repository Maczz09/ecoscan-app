import { LoginScreen } from '@/src/screens/auth/LoginScreen';

// Montamos la vista de Login directamente en la ruta raíz para evitar problemas de redirección en la Web.
export default function Index() {
  return <LoginScreen />;
}