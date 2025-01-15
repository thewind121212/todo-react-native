import { registerSheet, SheetDefinition } from 'react-native-actions-sheet';
import CreateMainTask from '@/components/sheet/CreateMainTask';
import CreateDueDay from '@/components/sheet/CalendarSheet';
import CreateSubTaskSheet from '@/components/sheet/CreateSubTask';
import ColorPickerSheet from '@/components/sheet/ColorPickerSheet';
import { MainTaskType } from '@/types/appTypes';

registerSheet('create-main-task', CreateMainTask);
registerSheet('create-sub-task', CreateSubTaskSheet);
registerSheet('calendarSheet', CreateDueDay);
registerSheet('color-picker-sheet', ColorPickerSheet);


// We extend some of the types here to give us great intellisense
// across the app for all registered sheets.
declare module 'react-native-actions-sheet' {
  interface Sheets {
    'create-main-task': SheetDefinition<{
      payload: {
        type: "habit" | "task" | "editHabit" | "editTask",
        task?: MainTaskType,
        onTaskCreate: (action: "habit" | "task", task: MainTaskType) => void,
        onUpdateTask?: (id: number, editedTask: MainTaskType | undefined) => void,
      }
    }>;
    'calendarSheet': SheetDefinition;
    'color-picker-sheet': SheetDefinition;
    'create-sub-task': SheetDefinition<{
      payload: {
        mainTaskId: number,
        mainTaskTitle?: string,
      }
    }>;
  }
}

export { };