import { Dimensions, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import CircularProgress from '@/components/CircleProgress'
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withRepeat, withSequence, withTiming, Easing } from 'react-native-reanimated'



const GRADIENT_COLOR_BY_PERCENT = {
    100: ['#32CD32', '#98FB98'],
    70: ['#006400', '#90EE90'],
    50: ['#FFD700', '#FFFFE0'],
    30: ['#FF4500', '#FFA07A'],
    10: ['#8B0000', '#FF6347'],
    0: ['transparent', 'transparent'],
};


const getGradientColor = (percent: number) => {
    if (percent >= 100) {
        return GRADIENT_COLOR_BY_PERCENT[100];
    }
    if (percent >= 70) {
        return GRADIENT_COLOR_BY_PERCENT[70];
    }
    if (percent >= 50) {
        return GRADIENT_COLOR_BY_PERCENT[50];
    }
    if (percent >= 30) {
        return GRADIENT_COLOR_BY_PERCENT[30];
    }
    if (percent >= 10) {
        return GRADIENT_COLOR_BY_PERCENT[10];
    }

    return GRADIENT_COLOR_BY_PERCENT[10];
}

type Props = {
    mainTaskName: string
    overAllPercent: number
    remainTimePercent: number
    primaryColor: string
}

const MainTask = ({ mainTaskName, overAllPercent, remainTimePercent, primaryColor }: Props) => {


    const translateX = useSharedValue<any>("-100%")
    const { width } = Dimensions.get('window');

    const translateYstyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: translateX.value }],
            easing: Easing.inOut(Easing.ease),
        };
    })


    useEffect(() => {
        translateX.value = withRepeat(
            withSequence(
                withTiming("0", { duration: 1500 }),
                withDelay(300, withTiming("0", { duration: 0 })),
            ),
            -1,
        )
    }, [])


    return (
        <View style={{ width: '100%', paddingVertical: 32, backgroundColor: '#222239', borderRadius: 8, borderBottomLeftRadius: 0, borderBottomRightRadius: 0, paddingRight: 20, paddingLeft: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', position: "relative", overflow: 'hidden' }}>
            <Text style={{ color: "#FFFFFF", fontSize: 18, fontWeight: "400" }}>{mainTaskName}</Text>
            <View style={[{ position: 'absolute', right: 20 , width: 50, height: 50}]} >
                <View style={{ position: "relative", display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <CircularProgress progress={overAllPercent} strokeWidth={6} strokeWidthFull={3} size={50} rotate='-90' color={primaryColor} animationDirection='clockwise' />
                    <Text style={{ position: "absolute", color: "white", fontWeight: 600, fontSize: 12 }}>{overAllPercent}%</Text>
                </View>
            </View>
            <View style={{ width: (width - 40) * (remainTimePercent / 100), height: 4, position: "absolute", left: 0, bottom: 0, borderRadius: 0, overflow: 'hidden' }}>
                <View style={{ width: '100%', height: 4, position: "relative", overflow: 'hidden' }}>
                    <LinearGradient
                        colors={[...getGradientColor(remainTimePercent)] as [string, string, ...string[]]}
                        start={{ x: -1, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={{ width: '100%', height: 4 }}
                    />
                    <Animated.View style={[{ width: '100%', height: 4, position: 'absolute', top: 0, left: 0 }, translateYstyle]}>
                        <LinearGradient
                            colors={[...getGradientColor(remainTimePercent)] as [string, string, ...string[]]}
                            start={{ x: -1, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={{ width: '100%', height: 4 }}
                        />
                    </Animated.View>

                </View>
            </View>
        </View>
    )
}

export default MainTask

const styles = StyleSheet.create({})