import React, { useEffect, useCallback } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import CircularProgress from '@/components/CircleProgress';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withRepeat, withSequence, withTiming, Easing } from 'react-native-reanimated';

const GRADIENT_COLOR_BY_PERCENT = {
    100: ['#32CD32', '#98FB98'],
    70: ['#006400', '#90EE90'],
    50: ['#FFD700', '#FFFFE0'],
    30: ['#FF4500', '#FFA07A'],
    10: ['#8B0000', '#FF6347'],
    0: ['transparent', 'transparent'],
};

export const getGradientColor = (percent: number) => {
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

    return GRADIENT_COLOR_BY_PERCENT[0];
}

type Props = {
    mainTaskName: string;
    overAllPercent: number;
    remainTimePercent: number;
    primaryColor: string;
    isRenderProgress?: boolean;
}

const MainTask = React.memo(({ mainTaskName, overAllPercent, remainTimePercent, primaryColor, isRenderProgress = true }: Props) => {
    const translateX = useSharedValue<any>("100%");
    const { width } = Dimensions.get('window');

    const translateXStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }],
        easing: Easing.inOut(Easing.ease),
    }));

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
        <View style={[styles.container, { paddingVertical: isRenderProgress ? 32 : 24 }]}>
            <Text style={styles.title}>{mainTaskName}</Text>
            <View style={styles.circularProgressContainer}>
                <View style={styles.circularProgressWrapper}>
                    <CircularProgress
                        progress={overAllPercent}
                        strokeWidth={6}
                        strokeWidthFull={3}
                        size={50}
                        rotate={'-90'}
                        color={primaryColor}
                        animationDirection='clockwise'
                    />
                    <Text style={styles.percentText}>{overAllPercent.toFixed(0)}%</Text>
                </View>
            </View>
            {isRenderProgress && (
                <View style={[styles.progressBarContainer, { width: Math.min((width - 40) * (remainTimePercent / 100), width) }]}>
                    <View style={styles.progressBarBackground}>
                        <LinearGradient
                            colors={[...getGradientColor(remainTimePercent)] as [string, string, ...string[]]}
                            start={{ x: -1, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.progressBarGradient}
                        />
                        <Animated.View style={[styles.progressBarAnimated, translateXStyle]}>
                            <LinearGradient
                                colors={[...getGradientColor(remainTimePercent)] as [string, string, ...string[]]}
                                start={{ x: -1, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.progressBarGradient}
                            />
                        </Animated.View>
                    </View>
                </View>
            )}
        </View>
    );
});

export default MainTask;

const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingVertical: 24,
        backgroundColor: '#222239',
        borderRadius: 8,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        paddingRight: 20,
        paddingLeft: 24,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        position: 'relative',
        overflow: 'hidden',
    },
    title: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '400',
    },
    circularProgressContainer: {
        position: 'absolute',
        right: 20,
        width: 50,
        height: 50,
    },
    circularProgressWrapper: {
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
    },
    percentText: {
        position: 'absolute',
        color: 'white',
        fontWeight: '600',
        fontSize: 12,
    },
    progressBarContainer: {
        height: 4,
        position: 'absolute',
        left: 0,
        bottom: 0,
        borderRadius: 2,
        overflow: 'hidden',
    },
    progressBarBackground: {
        width: '100%',
        height: 4,
        position: 'relative',
        overflow: 'hidden',
    },
    progressBarGradient: {
        width: '100%',
        height: 4,
    },
    progressBarAnimated: {
        width: '100%',
        height: 4,
        position: 'absolute',
        top: 0,
        left: 0,
    },
});
