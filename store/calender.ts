
import { create } from 'zustand';



interface CalendarModalState {
    dayPick: string;
    currentDay: string;

}


interface CalendarModalActions {
    setDayPick: (day: string) => void;
    setCurentDay: (day: string) => void;
}




export const useCalendarStore = create<CalendarModalState & CalendarModalActions>(
    (set) => {
        return {
            dayPick: '',
            currentDay: '' ,
            setDayPick: (day: string) => set({ dayPick: day }),
            setCurentDay: (day: string) => set({ currentDay: day })
        }
    }
)