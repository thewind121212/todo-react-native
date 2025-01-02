import { useEffect, useState } from 'react';
import { View, Text, Pressable } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming } from "react-native-reanimated";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useSQLiteContext } from 'expo-sqlite';


type Props = {
    cardContent: string,
    taskItemId: number,
    primaryColor: string,
    isDoneProps?: boolean,
    isSmallVersion?: boolean
    isUseSetDoneLocal?: boolean
    setDoneOutFunc?: (id: number) => void
}

const TaskItem = ({ cardContent, primaryColor, isSmallVersion = false, isDoneProps = false, taskItemId, isUseSetDoneLocal = true, setDoneOutFunc = () => { } }: Props) => {

    const [isDone, setIsDone] = useState(false)


    const scale = useSharedValue(0);
    const db = useSQLiteContext();


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
        setIsDone(isDoneProps)
    }, [scale, isDoneProps]);

    useEffect(() => {
        scale.value = withTiming(isDone ? 1 : 0, { duration: 200 });
    }, [isDone])



    const handlerCheckTask = async () => {
        await db.execAsync(`UPDATE tasks SET completed = ${isDone ? 0 : 1} WHERE id = ${taskItemId}`)
        if (isUseSetDoneLocal) {
            setIsDone(!isDone)
        }
        else {
            setDoneOutFunc(taskItemId)
        }
    }

    useEffect(() => {
        opacity.value = withRepeat(
            withTiming(0.5, { duration: 2000 }),
            -1,
            true
        );
    }, [opacity]);
    return (
        <View style={{ width: '100%', height: "auto", paddingVertical: isSmallVersion ? 12 : 20, backgroundColor: '#222239', borderRadius: 8, paddingRight: 20, paddingLeft: 34, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', position: "relative" }}>
            <Animated.View style={[{ width: 4, height: isSmallVersion ? 22 : 38, backgroundColor: isDone ? "#737379" : primaryColor, position: "absolute", left: 20, borderTopLeftRadius: 8, borderTopRightRadius: 8, borderBottomRightRadius: 8, borderBottomLeftRadius: 8 }, animatedStyle]} />
            <Text style={{ color: isDone ? "#737379" : "#FFFFFF", fontSize: 18, fontWeight: "400", textDecorationLine: isDone ? 'line-through' : "none", maxWidth: "80%" }}>{cardContent}</Text>
            <View style={{ width: 28, height: 28, aspectRatio: "1/1", display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Pressable style={{ width: isSmallVersion ? 22 : 24, height: isSmallVersion ? 22 : 24, borderRadius: "50%", borderColor: primaryColor, borderWidth: 2.4, opacity: !isDone ? 1 : 0 }}
                    onTouchStart={handlerCheckTask}
                ></Pressable>
                <Animated.View style={[{ position: 'absolute' }, animatedStyleScale]} >
                    <Pressable
                        onPress={handlerCheckTask}
                    >
                        <FontAwesome name="check-circle" size={28} color="#737379" />
                    </Pressable>
                </Animated.View>
            </View>
        </View>
    )
}

export default TaskItem