import { Stack } from 'expo-router';
import { CrearTachoScreen } from '@/src/screens/tachos/CrearTachoScreen';

export default function CrearTachoRoute() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <CrearTachoScreen />
    </>
  );
}
