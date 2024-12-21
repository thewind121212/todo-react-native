import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, {
    useSharedValue,
    useAnimatedProps,
    withTiming,
} from 'react-native-reanimated';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface CircularProgressProps {
    size?: number;
    strokeWidthFull?: number;
    strokeWidth?: number;
    progress: number;
    color?: string;
    animationDirection?: 'clockwise' | 'counter-clockwise';
    rotate?: string;
}

const CircularProgress: React.FC<CircularProgressProps> = ({
    size = 200,
    strokeWidth = 4,
    strokeWidthFull = 4,
    progress,
    color = '#A7D477',
    animationDirection = 'counter-clockwise',
    rotate = '0',
}) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const animatedProgress = useSharedValue(0);

    const animatedProps = useAnimatedProps(() => ({
        strokeDashoffset:
            animationDirection === 'clockwise'
                ? circumference - (animatedProgress.value / 100) * circumference
                : circumference + (animatedProgress.value / 100) * circumference,
    }));

    useEffect(() => {
        animatedProgress.value = withTiming(progress, { duration: 1000 });

        return () => {
            animatedProgress.value = 0;
        };
    }, [progress]);

    return (
        <View style={styles.container}>

            <Svg width={size} height={size} style={{ position: 'absolute', zIndex: 1, top: 0, left: 0 }}>
                <Circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="#2B2B41"
                    strokeWidth={strokeWidthFull}
                    fill="none"
                />
            </Svg>
            <Svg width={size} height={size} style={{ zIndex: 2}}>
                <Circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="transparent"
                    strokeWidth={strokeWidth}
                    fill="none"
                />
                <AnimatedCircle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={color}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    fill="none"
                    strokeDasharray={`${circumference}, ${circumference}`}
                    animatedProps={animatedProps}
                    transform={`rotate(${rotate} ${size / 2} ${size / 2})`}
                />
            </Svg>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
});

export default CircularProgress;
