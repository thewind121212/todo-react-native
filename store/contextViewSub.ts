
import { TaskItemQueryType } from '@/types/appTypes';
import { create } from 'zustand';



interface subItemState {
    tasks: TaskItemQueryType[];
    loading: boolean;
    mountOn: 'tab' | 'sheet';
}


interface subItemActions {
    setTasks: (tasks: TaskItemQueryType[], loading: boolean, mountOn?: 'tab' | 'sheet') => void;
    delTasks: (id: number) => void;
    editTasks: (id: number, title: string) => void;
    setLoading: (loading: boolean) => void;
    setMountOn: (mountOn: 'tab' | 'sheet') => void;
}




export const useSubTaskContext = create<subItemState & subItemActions>(
    (set) => {
        return {
            tasks: [],
            loading: true,
            mountOn: 'tab',
            setTasks: (tasks, loading, mountOn) => set(state => ({ tasks, loading, mountOn: mountOn ? mountOn : state.mountOn })),
            setLoading: (loading) => set({ loading }),
            delTasks(id) {
                set(state => {
                    return {
                        tasks: state.tasks.filter(task => task.id !== id),
                        loading: state.loading
                    }
                })
            },
            setMountOn: (mountOn) => set(() => ({ mountOn })),
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