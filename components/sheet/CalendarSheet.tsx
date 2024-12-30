import { View, Text } from "react-native";
import ActionSheet from "react-native-actions-sheet";
import { useCalendarStore } from "@/store/calender";
import { Calendar } from 'react-native-calendars';



function CreateDueDay() {

    const { currentDay, setDayPick, dayPick } = useCalendarStore();


    return (
        <ActionSheet containerStyle={{ backgroundColor: "#222239" }}>
            <View style={{ height: "auto", paddingTop: 20 }}>
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
                            setDayPick('');
                            return
                        }
                        setDayPick(dayData.dateString);
                    }}
                    markedDates={{
                        [currentDay]: { selected: true, selectedColor: '#7068FF' },
                        [dayPick]: { selected: true, selectedColor: '#FF748B' }
                    }}
                    enableSwipeMonths={true}
                >
                </Calendar>
            </View>

        </ActionSheet>
    );
}

export default CreateDueDay;