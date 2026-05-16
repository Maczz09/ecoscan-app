import { Stack } from 'expo-router';
import { VincularTachoScreen } from '@/src/screens/tachos/VincularTachoScreen';

export default function VincularTachoRoute() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false, presentation: 'fullScreenModal' }} />
      <VincularTachoScreen />
    </>
  );
}
