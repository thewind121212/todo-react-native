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
    size?: number; // Diameter of the circle
    strokeWidth?: number; // Thickness of the circle stroke
    progress: number; // Current progress value
}

const CircularProgress: React.FC<CircularProgressProps> = ({
    size = 200,
    strokeWidth = 4,
    progress,
}) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const animatedProgress = useSharedValue(0);

    const animatedProps = useAnimatedProps(() => ({
        strokeDashoffset:
            circumference + (animatedProgress.value / 100) * circumference,
    }));

    useEffect(() => {
        animatedProgress.value = withTiming(progress, { duration: 1000 });

        return () => {
            animatedProgress.value = 0;
        };
    }, [progress]);

    return (
        <View style={styles.container}>
            <Svg width={size} height={size}>
                <Circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="gray"
                    strokeWidth={strokeWidth}
                    fill="none"
                />
                <AnimatedCircle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="#A7D477"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    fill="none"
                    strokeDasharray={`${circumference}, ${circumference}`}
                    animatedProps={animatedProps}
                    transform={`rotate(-120 ${size / 2} ${size / 2})`}
                />
            </Svg>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default CircularProgress;
