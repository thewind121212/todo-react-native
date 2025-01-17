
import { TaskItemQueryType } from '@/types/appTypes';
import { create } from 'zustand';



interface subItemState {
    tasks: TaskItemQueryType[];
    loading: boolean;
}


interface subItemActions {
    setTasks: (tasks: TaskItemQueryType[], loading: boolean) => void;
    delTasks: (id: number) => void;
    editTasks: (id: number, title: string) => void;
}




export const useSubTaskContext = create<subItemState & subItemActions>(
    (set) => {
        return {
            tasks: [],
            loading: true,
            setTasks: (tasks, loading) => set({ tasks, loading }),
            delTasks(id) {
                set(state => {
                    return {
                        tasks: state.tasks.filter(task => task.id !== id),
                        loading: state.loading
                    }
                })
            },
            editTasks(id, title) {
                set(state => {
                    return {
                        tasks: state.tasks.map(task => {
                            if (task.id === id) {
                                return {
                                    ...task,
                                    title
                                }
                            }
                            return task
                        }),
                        loading: state.loading
                    }
                })
            }
        }
    }
)