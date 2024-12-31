import { Pressable, StyleSheet, View } from 'react-native'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import React from 'react'

type Props = {
    colorValue: string
    selectedColor: string
    setColorValue: (value: string) => void
}


const ColorPicker = ({ colorValue, selectedColor, setColorValue }: Props) => {
    return (
        <View style={{ width: 48, height: 48, borderRadius: "50%", borderWidth: 2, borderColor: colorValue === selectedColor ? colorValue : "transparent", display: "flex", justifyContent: "center", alignItems: "center", padding: 6 }}>
            <Pressable style={{ width: 36, height: 36, borderRadius: "50%", backgroundColor: colorValue, display: "flex", justifyContent: "center", alignItems: "center" }}
                onPressIn={() => setColorValue(selectedColor === colorValue ? "" : colorValue)}
            >
                {colorValue === selectedColor && (<FontAwesome name="check" size={18} color="#1A182C" />)}
            </Pressable>
        </View>
    )
}

export default ColorPicker

const styles = StyleSheet.create({})