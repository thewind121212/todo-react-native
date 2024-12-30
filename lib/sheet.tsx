import { registerSheet, SheetDefinition } from 'react-native-actions-sheet';
import CreateMainTask from '@/components/sheet/CreateMainTask';
import CreateDueDay from '@/components/sheet/CalendarSheet';

registerSheet('create-main-task', CreateMainTask);
registerSheet('calendarSheet', CreateDueDay);

// We extend some of the types here to give us great intellisense
// across the app for all registered sheets.
declare module 'react-native-actions-sheet' {
  interface Sheets {
    'create-main-task': SheetDefinition;
    'calendarSheet': SheetDefinition;
  }
}

export { };