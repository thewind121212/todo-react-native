import { useCallback, useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming } from "react-native-reanimated";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useSQLiteContext } from 'expo-sqlite';
import ContextMenu from 'react-native-context-menu-view';
import { useSubTaskContext } from '@/store/contextViewSub';
import { SheetManager } from 'react-native-actions-sheet';



type Props = {
    cardContent: string,
    taskItemId: number,
    primaryColor: string,
    isDoneProps?: boolean,
    isSmallVersion?: boolean
    isUseSetDoneLocal?: boolean
    setDoneOutFunc?: (id: number) => void
}

const TaskItem = ({ cardContent, primaryColor, isSmallVersion = false, isDoneProps = false, taskItemId, isUseSetDoneLocal = true, setDoneOutFunc = () => { },
}: Props) => {

    const [isDone, setIsDone] = useState(false)
    const { delTasks } = useSubTaskContext();





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
            setIsDone(!isDone)
            setDoneOutFunc(taskItemId)
        }
    }



    const handleContextMenuPress = useCallback(
        (e: any) => {
            const index = e.nativeEvent.index;
            if (index === 1) {
                // Delete Task Item
                db.execAsync(`DELETE FROM tasks WHERE id = ${taskItemId}`)
                delTasks(taskItemId)
            }
            if (index === 0) {
                // Edit Task Item
                SheetManager.show('create-sub-task', {
                    payload: {
                        type: 'edit',
                        mainTaskId: null,
                        subTaskId: taskItemId,
                        title: cardContent,
                        color: primaryColor,
                    }
                });
            }
        },
        [taskItemId]
    );

    useEffect(() => {
        opacity.value = withRepeat(
            withTiming(0.5, { duration: 2000 }),
            -1,
            true
        );
    }, [opacity]);
    return (

        <ContextMenu
            actions={[
                { title: 'Edit', systemIcon: 'pencil.tip', iconColor: '#1E1E1E' },
                { title: 'Delete', systemIcon: 'trash', destructive: true },
            ]}
            id='taskItemContextMenu'
            style={styles.contextMenu}
            onPress={handleContextMenuPress}
        >
            <View style={[styles.constainer, { paddingVertical: isSmallVersion ? 12 : 20, }]}>
                <Animated.View style={[styles.wrapper, animatedStyle, { height: isSmallVersion ? 22 : 38, backgroundColor: isDone ? "#737379" : primaryColor, }]} />
                <Text style={[styles.cartContent, { color: isDone ? "#737379" : "#FFFFFF", textDecorationLine: isDone ? 'line-through' : "none" }]}>{cardContent}</Text>
                <View style={styles.wrapperInner}>
                    <Pressable style={[styles.button, { borderColor: primaryColor, opacity: !isDone ? 1 : 0, width: isSmallVersion ? 22 : 24, height: isSmallVersion ? 22 : 24, }]}
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
        </ContextMenu >
    )
}


const styles = StyleSheet.create({
    contextMenu: {
        overflow: 'hidden',
        borderRadius: 6,
    },
    constainer: {
        width: '100%', height: "auto", backgroundColor: '#222239', borderRadius: 8, paddingRight: 20, paddingLeft: 34, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', position: "relative", zIndex: 1
    },
    wrapper: {
        width: 4,
        position: "absolute", left: 20, borderTopLeftRadius: 8, borderTopRightRadius: 8, borderBottomRightRadius: 8, borderBottomLeftRadius: 8
    },
    cartContent: {
        fontSize: 18, fontWeight: "400", maxWidth: "80%"
    },
    wrapperInner: {
        width: 28, height: 28, aspectRatio: "1/1", display: "flex", justifyContent: "center", alignItems: "center"
    },
    button: {
        borderRadius: "50%", borderWidth: 2.4,
    }
})

export default TaskItem