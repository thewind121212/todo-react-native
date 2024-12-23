import { useEffect, useState } from 'react';
import { View, Text, Dimensions } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming } from "react-native-reanimated";
import FontAwesome from '@expo/vector-icons/FontAwesome';


type Props = {
    cardContent: string,
    primaryColor: string,
}

const HabitItem = ({ cardContent, primaryColor }: Props) => {

    const [isDone, setIsDone] = useState(false)


    const { width } = Dimensions.get('window')
    const opacity = useSharedValue(1);
    const animatedStyle = useAnimatedStyle(() => {
        return {
            opacity: opacity.value,
        };
    });


    useEffect(() => {
        opacity.value = withRepeat(
            withTiming(0.5, { duration: 2000 }),
            -1,
            true
        );
    }, [opacity]);
    return (
        <View style={{ width: '100%', paddingVertical: 20, backgroundColor: '#222239', borderRadius: 8, paddingRight: 20, paddingLeft: 34, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', position: "relative" }}>
            <Animated.View style={[{ width: 4, height: 38, backgroundColor: primaryColor, position: "absolute", left: 20, borderTopLeftRadius: 8, borderTopRightRadius: 8, borderBottomRightRadius: 8, borderBottomLeftRadius: 8 }, animatedStyle]} />
            <Text style={{ color: "#FFFFFF", fontSize: 18, fontWeight: "400" }}>{cardContent}</Text>
            <View style={{ width: 24, height: 24, borderRadius: "50%", borderColor: primaryColor, borderWidth: 2.4 }}></View>
            <FontAwesome name="check-circle" size={28} color="#737379" style={{ position: 'absolute', right: 20 }} />
        </View>
    )
}

export default HabitItem