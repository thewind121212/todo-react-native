import { Stack } from "expo-router";
import SystemNavigationBar from 'react-native-system-navigation-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { migrateDbIfNeeded } from "@/utils/initDb";
import { SheetProvider } from 'react-native-actions-sheet';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SQLiteProvider } from 'expo-sqlite';

import '@/lib/sheet';


SystemNavigationBar.setNavigationColor("#1A182C");


export default function RootLayout() {


  return (
    <GestureHandlerRootView>
      <SafeAreaProvider>
        <SQLiteProvider databaseName="todo.db" onInit={migrateDbIfNeeded}>
          <SheetProvider>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            </Stack>
          </SheetProvider>
        </SQLiteProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}




