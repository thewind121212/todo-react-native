import { View, Text, StyleSheet } from "react-native";
import ActionSheet, { SheetManager } from "react-native-actions-sheet";
import { Calendar } from 'react-native-calendars';
import Button from "../Button";
import { useCallback, useState } from "react";
import { getCurrentDay } from "@/utils/helper";
import { useCreateMainTaskStore } from "@/store/createMainTask";



function CreateDueDay() {
    const { dayPick, setDayPick } = useCreateMainTaskStore()
    const [localComponentState, setLocalComponentState] = useState<string>(dayPick)

    const currentDay = getCurrentDay()


    const handleCancel = useCallback(() => {
        SheetManager.hide('calendarSheet');
    }, []);

    const handleSetDay = useCallback(() => {
        setDayPick(localComponentState);
        SheetManager.hide('calendarSheet');
    }, [localComponentState, setDayPick]);

    const handleDayPress = useCallback((dayData: any) => {
        const dayDataTime = new Date(dayData.dateString).getTime();
        const today = new Date().getTime();
        if (dayData.dateString === dayPick) {
            return
        }
        if (dayDataTime < today) {
            return
        }
        setLocalComponentState(dayData.dateString);
    }, [dayPick, setDayPick]);


    return (
        <ActionSheet containerStyle={styles.actionSheetContainer}
            closeAnimationConfig={{ stiffness: 200, damping: 100, mass: 1 }}
            keyboardHandlerEnabled={false}
        >
            <View style={styles.contentContainer}>
                <Text style={styles.title}>Choose Due Day</Text>

                <Calendar
                    style={styles.calendar}
                    theme={{
                        backgroundColor: '#222239',
                        calendarBackground: '#222239',
                        textSectionTitleColor: '#747482',
                        selectedDayBackgroundColor: '#00adf5',
                        textDayHeaderFontWeight: '300',
                        selectedDayTextColor: '#ffffff',
                        todayTextColor: '#00adf5',
                        dayTextColor: '#fff',
                        monthTextColor: '#fff',
                        montTextWeight: 'bold',
                        arrowColor: '#7068FF',
                        textDisabledColor: '#94a3b8'
                    }}
                    onDayPress={handleDayPress}
                    markedDates={{
                        [currentDay]: { selected: true, selectedColor: '#7068FF' },
                        [localComponentState]: { selected: true, selectedColor: '#FF748B' }
                    }}
                    enableSwipeMonths={true}
                >
                </Calendar>
                <View style={styles.buttonContainer} >
                    <Button title="Cancel" onPressHandler={handleCancel} isPrimary={false} />
                    <Button title="Set Day" onPressHandler={handleSetDay} />
                </View>
            </View>

        </ActionSheet>
    );
}

const styles = StyleSheet.create({
    actionSheetContainer: {
        backgroundColor: "#222239",
        height: "auto",
    },
    contentContainer: {
        height: "auto",
        paddingTop: 20,
        paddingBottom: 40,
    },
    title: {
        color: "white",
        fontSize: 24,
        textAlign: "center",
    },
    calendar: {
        borderWidth: 1,
        borderColor: '#222239',
        height: 350,
    },
    buttonContainer: {
        width: "100%",
        height: "auto",
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
        paddingHorizontal: 20,
        gap: 24,
        marginTop: 20, // Added margin for better spacing
    },
});
export default CreateDueDay;