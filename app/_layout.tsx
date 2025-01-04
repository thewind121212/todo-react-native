import { Stack } from "expo-router";
import SystemNavigationBar from 'react-native-system-navigation-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { migrateDbIfNeeded } from "@/utils/initDb";
import { HoldMenuProvider } from "react-native-hold-menu";
import { SheetProvider } from 'react-native-actions-sheet';
import { SQLiteProvider } from 'expo-sqlite';

import '@/lib/sheet';


SystemNavigationBar.setNavigationColor("#1A182C");


export default function RootLayout() {
  const insets = useSafeAreaInsets();




  return (
    <GestureHandlerRootView>
      <HoldMenuProvider theme="dark" safeAreaInsets={{ top: insets.top, bottom: insets.bottom, left: insets.left, right: insets.right }}>
        <SQLiteProvider databaseName="todo.db" onInit={migrateDbIfNeeded}>
          <SheetProvider>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            </Stack>
          </SheetProvider>
        </SQLiteProvider>
      </HoldMenuProvider>
    </GestureHandlerRootView>
  )
}




