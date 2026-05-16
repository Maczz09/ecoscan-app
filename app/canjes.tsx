import { Stack } from 'expo-router';
import { CanjesScreen } from '@/src/screens/recompensas/CanjesScreen';

export default function CanjesRoute() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <CanjesScreen />
    </>
  );
}
