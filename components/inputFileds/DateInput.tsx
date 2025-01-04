import { Pressable, StyleSheet, View, Text } from 'react-native'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import React from 'react'
import { SheetManager } from 'react-native-actions-sheet';
import { useCalendarStore } from '@/store/calender';



const FORMAT_OPTIONS = { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' } as const;


interface propsType {
    isSheetDirty: boolean
}

const DateInput = ({ isSheetDirty }: propsType) => {
    const { dayPick, setDayPick } = useCalendarStore();

    return (
        <Pressable style={{ ...styles.container }}
            onPressIn={() => SheetManager.show('calendarSheet')}
        >
            <View
                style={{
                    width: "100%", height: "100%", borderColor: (isSheetDirty && dayPick.length === 0) ? "#F67280" : dayPick.length > 0 ? "#7068FF" : "#BBBBD4", borderWidth: 1,
                    borderRadius: 14,
                    paddingLeft: 16, display: "flex", justifyContent: "center", alignItems: "flex-start"
                }}
            >
                <Text style={{ color: dayPick === "" ? "#BBBBD4" : "white", fontSize: 18, fontWeight: 500 }} >{(isSheetDirty && dayPick.length === 0) ? "Please choose date" : dayPick === "" ? "Select Due Day" : new Date(dayPick).toLocaleDateString('vi-VN', FORMAT_OPTIONS)} </Text>
            </View>
            <View style={{ height: "100%", aspectRatio: "1/1", position: "absolute", right: 0, top: 0, display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Pressable
                    style={{ width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}
                    onPressIn={() => dayPick === "" ? SheetManager.show('calendarSheet') : setDayPick("")}
                >
                    {
                        dayPick === "" ? (
                            <FontAwesome5 name="calendar-alt" size={24} color="white" />
                        ) : (
                            <FontAwesome5 name="times" size={24} color="white" />
                        )
                    }
                </Pressable>
            </View>
        </Pressable>
    )
}

export default DateInput

const styles = StyleSheet.create({
    container: {
        width: "100%", height: 60, backgroundColor: "#272741", display: "flex", justifyContent: "center", alignItems: "flex-start", position: "relative",
        overflow: "hidden"
    }
})