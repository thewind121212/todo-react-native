import { Keyboard, Pressable, StyleSheet, View } from 'react-native'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import React from 'react'
import { useCreateMainTaskStore } from '@/store/createMainTask';
import { SheetManager } from 'react-native-actions-sheet';

type Props = {
    colorValue: string
    isChoose?: boolean
}


const ColorPicker = React.memo(({ colorValue, isChoose = false }: Props) => {

    const { color, setColor } = useCreateMainTaskStore()


    const onPressInHandler = () => {
        Keyboard.dismiss()
        if (isChoose) {
            SheetManager.show('color-picker-sheet')
            return
        }
        setColor(color === colorValue ? "" : colorValue)
    }

    return (
        <View style={[styles.container, { borderColor: colorValue === color ? colorValue : "transparent" }]}>
            <Pressable style={[styles.button, { backgroundColor: colorValue }]}
                onPressIn={onPressInHandler}
            >
                {colorValue === color && (<FontAwesome name="check" size={18} color="#1A182C" />)}
            </Pressable>
        </View>
    )
})

export default ColorPicker

const styles = StyleSheet.create({
    container: {
        width: 48, height: 48, borderRadius: "50%", borderWidth: 2, display: "flex", justifyContent: "center", alignItems: "center", padding: 6
    },
    button: {
        width: 36, height: 36, borderRadius: "50%", display: "flex", justifyContent: "center", alignItems: "center"
    }
})