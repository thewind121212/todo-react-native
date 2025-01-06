import { Keyboard, Pressable, StyleSheet, Text, View } from 'react-native'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React from 'react'
import { useCreateMainTaskStore } from '@/store/createMainTask';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';


const CreateOptions = () => {
    const { createType, setCreateType } = useCreateMainTaskStore()

    const isHabit = createType === "habit"


    const shinkShareValue = useSharedValue(1)

    const buttonStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: shinkShareValue.value }],
        }
    })


    const onPressIn = (type: "habit" | "task") => {
        Keyboard.dismiss()
        if (type === createType) return
        setCreateType(type)
        shinkShareValue.value = withSpring(0.8, { damping: 10, stiffness: 100 })
    }

    const onPressOut = () => {
        shinkShareValue.value = withSpring(1, { damping: 10, stiffness: 100 })
    }

    return (
        <View style={{ width: "100%", height: "auto", display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', gap: 16, marginTop: 20 }}>
            <Text style={{ color: "#ACABB4", fontWeight: 500 }}>Type</Text>
            <View style={{ display: 'flex', width: 120, height: 38, flexDirection: 'row', justifyContent: 'flex-start', gap: 8 }}>
                <Pressable onPressIn={onPressIn.bind(null, "habit")} onPressOut={onPressOut}>
                    <Animated.View style={[{ width: 38, height: 38, display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: isHabit ? "#7068FF" : "transparent", borderRadius: 8, borderWidth: 2, borderColor: isHabit ? "transparent" : "#404062" }, buttonStyle]}>
                        <MaterialIcons name="autorenew" size={24} color={isHabit ? "white" : "#BBBBD4"} />
                    </Animated.View>
                </Pressable>

                <Pressable onPressIn={onPressIn.bind(null, "task")} onPressOut={onPressOut}>
                    <Animated.View style={[{ width: 38, height: 38, display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: !isHabit ? "#7068FF" : "transparent", borderRadius: 8, borderWidth: 2, borderColor: !isHabit ? "transparent" : "#404062" }, buttonStyle]}>
                        <MaterialIcons name="checklist" size={24} color={!isHabit ? "white" : "#BBBBD4"} />
                    </Animated.View>
                </Pressable>
            </View>
        </View>
    )
}

export default CreateOptions

const styles = StyleSheet.create({})

function onPressHandler() {
    throw new Error('Function not implemented.');
}
