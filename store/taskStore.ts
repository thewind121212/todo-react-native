

import { TaskItemQueryType } from '@/types/appTypes';
import { create } from 'zustand';



interface subTaskTabState {
    tasks: TaskItemQueryType[];
    loading: boolean;
}


interface subTaskTabActions {
    setTasks: (tasks: TaskItemQueryType[], loading: boolean) => void;
    delTasks: (id: number) => void;
    editTasks: (id: number, title: string) => void;
    setLoading: (loading: boolean) => void;
}




export const useSubTaskTabStore = create<subTaskTabActions & subTaskTabState>(
    (set) => {
        return {
            tasks: [],
            loading: true,
            setTasks: (tasks, loading) => set(state => ({ tasks, loading })),
            setLoading: (loading) => set({ loading }),
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