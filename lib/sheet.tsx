import { registerSheet, SheetDefinition } from 'react-native-actions-sheet';
import CreateMainTask from '@/components/sheet/CreateMainTask';
import CreateDueDay from '@/components/sheet/CalendarSheet';
import ColorPickerSheet from '@/components/sheet/ColorPickerSheet';

registerSheet('create-main-task', CreateMainTask);
registerSheet('calendarSheet', CreateDueDay);
registerSheet('color-picker-sheet', ColorPickerSheet);


// We extend some of the types here to give us great intellisense
// across the app for all registered sheets.
declare module 'react-native-actions-sheet' {
  interface Sheets {
    'create-main-task': SheetDefinition<{
      payload: {
        type: "habit" | "task"
        refesher: () => void,
      }
    }>;
    'calendarSheet': SheetDefinition;
    'color-picker-sheet': SheetDefinition;
  }
}

export { };