

import { create } from 'zustand';



interface CreateMainTaskState {
    createType: "habit" | "task";
    name: string,
    color: string,
    dayPick: string,
}


interface CreateMainTaskActions {
    setName: (name: string) => void;
    setColor: (color: string) => void;
    setCreateType: (type: "habit" | "task") => void;
    setDayPick: (day: string) => void;
    resetState: () => void;
}




export const useCreateMainTaskStore = create<CreateMainTaskActions & CreateMainTaskState>(
    (set) => {
        return {
            name: '',
            createType: 'habit',
            color: '',
            dayPick: '',
            setName: (name: string) => set(() => ({ name })),
            setColor: (color: string) => set(() => ({ color })),
            setDayPick: (day: string) => set(() => ({ dayPick: day })),
            setCreateType: (type: "habit" | "task") => set(() => ({ createType: type })),
            resetState: () => set(() => ({ name: '', color: '', dayPick: '' }))
        }
    }
)