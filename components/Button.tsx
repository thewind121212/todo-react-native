import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'

type Props = {
    isPrimary?: boolean
    title: string
    onPressHandler: () => void
}

const Button = ({ isPrimary = true, title = "button label", onPressHandler = () => { } }: Props) => {
    const shinkShareValue = useSharedValue(1)

    const buttonStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: shinkShareValue.value }],
        }
    })


    const onPressIn = () => {
        onPressHandler()
        shinkShareValue.value = withSpring(0.8, { damping: 10, stiffness: 100 })
    }

    const onPressOut = () => {
        shinkShareValue.value = withSpring(1, { damping: 10, stiffness: 100 })
    }

    return (
        <Animated.View style={[styles.buttonContainer, buttonStyle, { backgroundColor: isPrimary ? "#7068FF" : "#222239", borderColor: isPrimary ? "transparent" : "#404062" }]}>
            <Pressable style={styles.button}
                onPressIn={onPressIn}
                onPressOut={onPressOut}
            >
                <Text style={[styles.title, { color: isPrimary ? "white" : "#BBBBD4" }]}>{title}</Text>
            </Pressable>
        </Animated.View>
    )
}


const styles = StyleSheet.create({
    buttonContainer: {
        width: 130,
        height: 54,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 14,
        borderWidth: 2,
    },
    button: {
        width: "100%", height: "100%", position: "absolute", right: 0, top: 0, display: "flex", justifyContent: "center", alignItems: "center"
    },
    title: {
        fontSize: 18
    }
})

export default Button
