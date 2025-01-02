
import { create } from 'zustand';



interface CalendarModalState {
    dayPick: string;
    currentDay: string;

}


interface CalendarModalActions {
    setDayPick: (day: string) => void;
    setCurentDay: (day: string) => void;
}

const getCurrentDay = () => {
    const today = new Date();
    return today.toISOString().split('T')[0]; // Format: YYYY-MM-DD
};



export const useCalendarStore = create<CalendarModalState & CalendarModalActions>(
    (set) => {
        return {
            dayPick: '',
            currentDay: getCurrentDay(),
            setDayPick: (day: string) => set({ dayPick: day }),
            setCurentDay: (day: string) => set({ currentDay: day })
        }
    }
)