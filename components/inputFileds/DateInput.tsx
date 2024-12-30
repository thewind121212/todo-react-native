import { Pressable, StyleSheet, TextInput, View } from 'react-native'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import React from 'react'
import { SheetManager } from 'react-native-actions-sheet';
import { useCalendarStore } from '@/store/calender';



const FORMAT_OPTIONS = { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' } as const;


const DateInput = () => {
    const { dayPick } = useCalendarStore();


    return (
        <Pressable style={{ ...styles.container }}
            onPressIn={() => SheetManager.show('calendarSheet')}
        >
            <TextInput
                style={{ width: "100%", height: "100%", color: "#FFFFFF", fontSize: 18, fontWeight: "500", borderColor: dayPick.length > 0 ? "#7068FF" : "white", borderWidth: 1, borderRadius: 12, paddingLeft: 16 }}
                value={new Date(dayPick).toLocaleDateString('vi-VN', FORMAT_OPTIONS)}
                placeholder='Select Date'
                placeholderTextColor={'#4D4C71'}
                editable={false}
                selectTextOnFocus={false}
            />
            <View style={{ width: 24, position: "absolute", right: 16, top: 15 }}>
                <FontAwesome5 name="calendar-alt" size={24} color="white" />
            </View>
        </Pressable>
    )
}

export default DateInput

const styles = StyleSheet.create({
    container: {
        width: "100%", height: 54, backgroundColor: "#222239", display: "flex", justifyContent: "center", alignItems: "flex-start", position: "relative"
    }
})