export interface MainTaskType {
    color: string;
    create_date: string;
    due_day: string | null;
    id: number;
    title: string;
    type: 'habit' | 'task';
    update_date: string;
    remainTimePercent: number;
}

export interface TaskItemType {
    id: number;
    title: string;
    completed: 0 | 1;
    priority: 0 | 1 | 2;
    mainTaskId: number;
    createDate: Date;
    updateDate: Date;
}



export type TaskItemQueryType = TaskItemType & { main_task_type: "habit" | "task", primary_color: string, main_task_title: string, main_task_id: number, dueDate: string, createDate: string, }

export type TaskItemNotHabitType = {
    id: string,
    title: string,
    createDate: string,
    dueDate: string,
    primary_color: string,
    data: TaskItemQueryType[]
}