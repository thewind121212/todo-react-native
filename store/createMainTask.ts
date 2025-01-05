

import { create } from 'zustand';



interface CreateMainTaskState {
    name: string,
    color: string,
    dayPick: string,
}


interface CreateMainTaskActions {
    setName: (name: string) => void;
    setColor: (color: string) => void;
    setDayPick: (day: string) => void;
    resetState: () => void;
}




export const useCreateMainTaskStore = create<CreateMainTaskActions & CreateMainTaskState>(
    (set) => {
        return {
            name: '',
            color: '',
            dayPick: '',
            setName: (name: string) => set(() => ({ name })),
            setColor: (color: string) => set(() => ({ color })),
            setDayPick: (day: string) => set(() => ({ dayPick: day })),
            resetState: () => set(() => ({ name: '', color: '', dayPick: '' }))
        }
    }
)