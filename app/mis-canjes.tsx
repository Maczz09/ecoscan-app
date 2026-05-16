import { Stack } from 'expo-router';
import { MisCanjesScreen } from '@/src/screens/recompensas/MisCanjesScreen';

export default function MisCanjesRoute() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <MisCanjesScreen />
    </>
  );
}
