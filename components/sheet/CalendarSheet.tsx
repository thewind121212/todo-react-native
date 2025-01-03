import { View, Text } from "react-native";
import ActionSheet, { SheetManager } from "react-native-actions-sheet";
import { useCalendarStore } from "@/store/calender";
import { Calendar } from 'react-native-calendars';
import Button from "../Button";
import { useState } from "react";



function CreateDueDay() {

    const { currentDay, setDayPick, dayPick } = useCalendarStore();

    const [localComponentState, setLocalComponentState] = useState<string>(dayPick)

    return (
        <ActionSheet containerStyle={{ backgroundColor: "#222239", "height": "auto" }}>
            <View style={{ height: "auto", paddingTop: 20, paddingBottom: 40 }}>
                <Text style={{ color: "white", fontSize: 24, textAlign: "center" }}>Choose Due Day</Text>

                <Calendar
                    style={{
                        borderWidth: 1,
                        borderColor: '#222239',
                        height: 350,
                    }}
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
                    onDayPress={(dayData: any) => {
                        if (dayData.dateString === dayPick) {
                            return
                        }
                        setLocalComponentState(dayData.dateString);
                    }}
                    markedDates={{
                        [currentDay]: { selected: true, selectedColor: '#7068FF' },
                        [localComponentState]: { selected: true, selectedColor: '#FF748B' }
                    }}
                    enableSwipeMonths={true}
                >
                </Calendar>
                <View style={{ width: "100%", height: "auto", display: "flex", flexDirection: "row", justifyContent: "flex-end", alignItems: "center", paddingHorizontal: 20, gap: 24 }} >
                    <Button tittle="Cancel" onPressHandler={() => {
                        SheetManager.hide('calendarSheet')
                    }} isPrimary={false} />
                    <Button tittle="Set Day" onPressHandler={() => {
                        setDayPick(localComponentState)
                        SheetManager.hide('calendarSheet')
                    }} />
                </View>
            </View>

        </ActionSheet>
    );
}

export default CreateDueDay;