export interface MainTaskType {
    color: string;
    create_date: string;
    due_day: string | null;
    id: number;
    title: string;
    type: 'habit' | 'task';
    update_date: string;
}
