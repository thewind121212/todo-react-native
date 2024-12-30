import { Stack } from "expo-router";
import SystemNavigationBar from 'react-native-system-navigation-bar';
import { SheetProvider } from 'react-native-actions-sheet';
import '@/lib/sheet';


SystemNavigationBar.setNavigationColor("#1A182C");

export default function RootLayout() {
  return (
    <SheetProvider>
      <Stack> <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </SheetProvider>
  )
}