

import { create } from 'zustand';



interface ColorsModalState {
    colorPicked: string;

}


interface ColorsModalActions {
    setColoPick: (color: string) => void;
}




export const useColorsStore = create<ColorsModalActions & ColorsModalState>(
    (set) => {
        return {
            colorPicked: '',
            setColoPick: (color: string) => set({ colorPicked: color }),
        }
    }
)