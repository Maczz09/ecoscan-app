import { Stack } from 'expo-router';
import { HistorialPersonalScreen } from '@/src/screens/dashboard/HistorialPersonalScreen';

export default function HistorialRoute() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <HistorialPersonalScreen />
    </>
  );
}
