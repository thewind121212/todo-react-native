import { registerSheet, SheetDefinition } from 'react-native-actions-sheet';
import CreateMainTask from '@/components/sheet/CreateMainTask';
import CreateDueDay from '@/components/sheet/CalendarSheet';
import ColorPickerSheet from '@/components/sheet/ColorPickerSheet';
import ShowSubTaskSheet from '@/components/sheet/ShowSubTask';
import CreateSubTaskSheet from '@/components/sheet/CreateSubTasks';
import { MainTaskType, TaskItemQueryType } from '@/types/appTypes';
import MainTaskPicker from '@/components/sheet/MainTaskPicker';

registerSheet('create-main-task', CreateMainTask);
registerSheet('show-sub-task', ShowSubTaskSheet);
registerSheet('create-sub-task', CreateSubTaskSheet);
registerSheet('calendarSheet', CreateDueDay);
registerSheet('color-picker-sheet', ColorPickerSheet);
registerSheet('main-task-picker', MainTaskPicker);


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
    'main-task-picker': SheetDefinition<{
      payload: {
        onTaskSelect: (task: MainTaskType) => void,
      }
    }>
    'create-sub-task': SheetDefinition<{
      payload: {
        subTaskId?: number,
        mainTaskId: number | null,
        title: string,
        type: 'create' | 'edit' | 'create-from-tab',
        color: string,
      }
    }>;
    'show-sub-task': SheetDefinition<{
      payload: {
        mainTaskId: number,
        primaryColor: string,
        mainTaskTitle?: string,
      }
    }>;
  }
}

export { };