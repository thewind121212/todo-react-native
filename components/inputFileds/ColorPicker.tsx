import { Pressable, StyleSheet, View } from 'react-native'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import React from 'react'
import { useCreateMainTaskStore } from '@/store/createMainTask';
import { SheetManager } from 'react-native-actions-sheet';

type Props = {
    colorValue: string
    isChoose?: boolean
}


const ColorPicker = ({ colorValue, isChoose = false }: Props) => {

    const { color, setColor } = useCreateMainTaskStore()

    const onPressInHandler = () => {
        if (isChoose) {
            SheetManager.show('color-picker-sheet')
            return
        }
        setColor(color === colorValue ? "" : colorValue)
    }

    return (
        <View style={{ width: 48, height: 48, borderRadius: "50%", borderWidth: 2, borderColor: colorValue === color ? colorValue : "transparent", display: "flex", justifyContent: "center", alignItems: "center", padding: 6 }}>
            <Pressable style={{ width: 36, height: 36, borderRadius: "50%", backgroundColor: colorValue, display: "flex", justifyContent: "center", alignItems: "center" }}
                onPressIn={onPressInHandler}
            >
                {colorValue === color && (<FontAwesome name="check" size={18} color="#1A182C" />)}
            </Pressable>
        </View>
    )
}

export default ColorPicker

const styles = StyleSheet.create({})