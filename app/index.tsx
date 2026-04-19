import { Redirect } from 'expo-router';

// Por ahora, redirigimos directamente a la vista de Login que crearemos en la ruta de auth
export default function Index() {
  return <Redirect href="/(auth)/login" />;
}