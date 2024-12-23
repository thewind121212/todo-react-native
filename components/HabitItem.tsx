import { useEffect, useState } from 'react';
import { View, Text, Dimensions, Pressable } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withSpring, withTiming } from "react-native-reanimated";
import FontAwesome from '@expo/vector-icons/FontAwesome';


type Props = {
    cardContent: string,
    primaryColor: string,
}

const HabitItem = ({ cardContent, primaryColor }: Props) => {

    const [isDone, setIsDone] = useState(false)

    const scale = useSharedValue(0);

    const animatedStyleScale = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scale.value }],
        };
    });




    const opacity = useSharedValue(1);
    const animatedStyle = useAnimatedStyle(() => {
        return {
            opacity: opacity.value,
        };
    });

    useEffect(() => {
        scale.value = withTiming(isDone ? 1 : 0, {duration: 200});
    }, [scale, isDone]);


    useEffect(() => {
        opacity.value = withRepeat(
            withTiming(0.5, { duration: 2000 }),
            -1,
            true
        );
    }, [opacity]);
    return (
        <View style={{ width: '100%', paddingVertical: 20, backgroundColor: '#222239', borderRadius: 8, paddingRight: 20, paddingLeft: 34, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', position: "relative" }}>
            <Animated.View style={[{ width: 4, height: 38, backgroundColor: isDone? "#737379" : primaryColor, position: "absolute", left: 20, borderTopLeftRadius: 8, borderTopRightRadius: 8, borderBottomRightRadius: 8, borderBottomLeftRadius: 8 }, animatedStyle]} />
            <Text style={{ color: isDone ? "#737379" : "#FFFFFF", fontSize: 18, fontWeight: "400", textDecorationLine: isDone ? 'line-through' : "none"  }}>{cardContent}</Text>
            <Pressable style={{ width: 24, height: 24, borderRadius: "50%", borderColor: primaryColor, borderWidth: 2.4 , opacity: !isDone ? 1 : 0 }}
                onTouchStart={() => setIsDone(true)}
            ></Pressable>
            <Animated.View style={[{ position: 'absolute', right: 20 }, animatedStyleScale]} >
                <Pressable
                    onPress={() => setIsDone(false)}
                >
                    <FontAwesome name="check-circle" size={28} color="#737379" />
                </Pressable>
            </Animated.View>
        </View>
    )
}

export default HabitItem