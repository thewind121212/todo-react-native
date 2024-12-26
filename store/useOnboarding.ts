import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage';



interface OnboardingState {
    isFinished: boolean;
}


interface OnboardingActions {
    setFinished: () => void;
}

export const useOnboardingPersisStore = create<OnboardingState & OnboardingActions>()(
    persist(
        (set) => {
            return {
                isFinished: false,
                setFinished: () => set({ isFinished: true })
            }
        },
        {
            name: 'onboarding-storage',
            storage: createJSONStorage(() => AsyncStorage)
        }
    )
)




// export const useOnboardingPersisStore = create<OnboardingState & OnboardingActions>(
//     (set) => {
//         return {
//             isFinished: false,
//             setFinished: () => set({ isFinished: true })
//         }
//     }
// )