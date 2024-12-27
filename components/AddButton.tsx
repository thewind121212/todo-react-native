import { StyleSheet, Pressable } from 'react-native'
import React, { useEffect } from 'react'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6'
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'



const AddButton = () => {

    const shinkShareValue = useSharedValue(1)

    const buttonStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: shinkShareValue.value }],
        }
    })


    const onPressIn = () => {
        shinkShareValue.value = withSpring(0.8, { damping: 10, stiffness: 100 })
    }

    const onPressOut = () => {
        shinkShareValue.value = withSpring(1, { damping: 10, stiffness: 100 })
    }


    return (

        <Animated.View style={[{ width: 64, height: 64, backgroundColor: '#7068FF', borderRadius: 12, display: "flex", justifyContent: "center", alignItems: "center" }, buttonStyle]}>
            <Pressable
                onPressIn={onPressIn}
                onPressOut={onPressOut}
                style={{ width: 64, height: 64, display: "flex", justifyContent: "center", alignItems: "center" }}
            >
                <FontAwesome6 name="plus" size={24} color="white" />
            </Pressable>
        </Animated.View>
    )
}

export default AddButton

const styles = StyleSheet.create({})