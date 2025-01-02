import { Stack } from "expo-router";
import SystemNavigationBar from 'react-native-system-navigation-bar';
import { migrateDbIfNeeded } from "@/utils/initDb";
import { SheetProvider } from 'react-native-actions-sheet';
import { SQLiteProvider } from 'expo-sqlite';

import '@/lib/sheet';


SystemNavigationBar.setNavigationColor("#1A182C");

export default function RootLayout() {



  return (
      <SQLiteProvider databaseName="todo.db" onInit={migrateDbIfNeeded}>
        <SheetProvider>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
        </SheetProvider>
      </SQLiteProvider>
  )
}




