import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Aquí Expo cargará login.tsx, register.tsx, etc. sin cabecera */}
      <Stack.Screen name="login" />
    </Stack>
  );
}