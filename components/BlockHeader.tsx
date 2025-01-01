import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6'

type Props = {
    isShowSubTitle: boolean
    style?: any
    mainTitle: string
    subTitle: string
    isShowBoxCount?: boolean
    boxCount?: number
    onPressHandler?: () => void
    isShowButton?: boolean
    buttonEvent?: () => void
}

const BlockHeader = ({ isShowSubTitle, mainTitle, subTitle, onPressHandler, isShowBoxCount = false, boxCount = 0, style, isShowButton = false, buttonEvent = () => { } }: Props) => {

    const shinkShareValue = useSharedValue(1)

    const buttonStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: shinkShareValue.value }],
        }
    })


    const onPressIn = () => {
        buttonEvent()
        shinkShareValue.value = withSpring(0.8, { damping: 10, stiffness: 100 })
    }

    const onPressOut = () => {
        shinkShareValue.value = withSpring(1, { damping: 10, stiffness: 100 })
    }


    return (
        <View style={styles.blockHeader}>
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', ...style }}>
                <Text style={{ fontSize: 26, color: '#fff', fontWeight: "600" }}>{mainTitle}</Text>
                {
                    isShowBoxCount && (
                        <View style={{ width: 32, height: 32, display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#222239', borderRadius: 6, marginLeft: 12 }}>
                            {boxCount !== 0 && <Text style={{ fontSize: 18, color: '#fff' }}>{boxCount}</Text>}
                        </View>
                    )
                }
            </View>
            {
                isShowSubTitle && (
                    <Pressable onPress={onPressHandler ? () => onPressHandler : undefined} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ fontSize: 18, color: "#94a3b8" }}>{subTitle}</Text>
                    </Pressable>
                )
            }

            {
                isShowButton && (
                    <Animated.View style={[{ width: 32, height: 32, display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#7068FF', borderRadius: 8, marginLeft: 12 }, buttonStyle]}>
                        <Pressable onPress={buttonEvent} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32 }}
                            onPressIn={onPressIn}
                            onPressOut={onPressOut}
                        >
                            <FontAwesome6 name="plus" size={18} color="white" />
                        </Pressable>
                    </Animated.View>
                )
            }
        </View>
    )
}

export default BlockHeader

const styles = StyleSheet.create({
    blockHeader: {
        width: '100%',
        height: 'auto',
        display: 'flex',
        flexDirection: 'row',
        marginBottom: 24,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
})