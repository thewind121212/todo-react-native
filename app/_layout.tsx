import { Stack } from "expo-router";
import SystemNavigationBar from 'react-native-system-navigation-bar';


SystemNavigationBar.setNavigationColor("#1A182C");

export default function RootLayout() {
  return <Stack>
    <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
  </Stack>;
}