import { useSubTaskContext } from '@/store/contextViewSub';
import { TaskItemQueryType } from '@/types/appTypes';
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import { useSQLiteContext } from 'expo-sqlite';
import { Skeleton } from 'moti/skeleton';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { RefreshControl, StyleSheet, Text, View } from 'react-native';
import ActionSheet, { ActionSheetRef, SheetManager, SheetProps } from 'react-native-actions-sheet';
import {
    Directions,
    Gesture,
    GestureDetector,
    Pressable,
} from 'react-native-gesture-handler';
import Animated, { interpolate, LinearTransition, runOnJS, useAnimatedReaction, useAnimatedStyle, useSharedValue, withDelay, withRepeat, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BlockHeader from '../BlockHeader';
import TaskItem from '../TaskItem';


const ShowSubTaskSheet = ({ payload }: SheetProps<'show-sub-task'>) => {
    const db = useSQLiteContext();
    const sheetRef = useRef<ActionSheetRef | null>(null)
    const sheetIndexShareValue = useSharedValue<number>(0)
    const arrowShareValue = useSharedValue<{
        y: number;
        opacity: number;
    }>({ y: 0, opacity: 100 })
    const [index, setIndex] = useState<number>(0)
    const mountRef = useRef<boolean>(false)
    const { tasks, setTasks, loading, setLoading } = useSubTaskContext();



    const insets = useSafeAreaInsets();


    const arrowStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateY: arrowShareValue.value.y }],
            opacity: interpolate(arrowShareValue.value.opacity, [0, 100], [0, 1]),
        };
    })


    const flingGestureUp = Gesture.Fling()
        .direction(Directions.UP)
        .onStart((e) => {
            sheetIndexShareValue.value = 1
        })

    useEffect(() => {
        if (!payload?.mainTaskId) return
        async function getAllMainTask() {
            try {
                const result = await db.getAllAsync<TaskItemQueryType>(
                    `SELECT t.*, mt.type AS main_task_type, mt.color AS primary_color, mt.title AS main_task_title, mt.id AS main_task_id, mt.due_day AS dueDate , mt.create_date AS createDate
          FROM tasks t
          JOIN main_tasks mt ON t.main_task_id = mt.id
          WHERE mt.id = ${payload?.mainTaskId}
          `
                );

                if (result) {
                    const habit: TaskItemQueryType[] = [];
                    result.map((item) => {
                        if (item.completed === 1) {
                            habit.push(item);
                        } else if (item.completed === 0) {
                            habit.unshift(item);
                        }
                    });


                    setTasks(habit, false, 'sheet');

                }
            } catch (error) {
                setTasks([], false, 'sheet');
            }
        }

        getAllMainTask();

        arrowShareValue.value = withRepeat(withDelay(300, withTiming({ y: -12, opacity: 0 }, { duration: 1500 })), 2)


    }, []);

    const flingGestureDown = Gesture.Fling()
        .direction(Directions.DOWN)
        .onStart((e) => {
            sheetIndexShareValue.value = sheetIndexShareValue.value - 1
        })



    const guestureHander = () => {
        if (!mountRef.current) {
            mountRef.current = true
            return
        }
        if (sheetIndexShareValue.value === -1 && sheetRef) {
            sheetRef.current?.hide()
        }

        if (sheetRef) {
            sheetRef.current?.snapToIndex(sheetIndexShareValue.value)
            return
        }

    }


    useAnimatedReaction(() => sheetIndexShareValue, (currentvalue) => {
        runOnJS(guestureHander)()
    }, [sheetIndexShareValue])


    const flingGestureRight = Gesture.Fling()
        .direction(Directions.RIGHT)
        .onStart((e) => {
            sheetIndexShareValue.value = -1
        })



    const flingGesture = Gesture.Exclusive(flingGestureUp, flingGestureDown, flingGestureRight)



    const handleOnCloseSheet = useCallback(() => {
        SheetManager.hide('show-sub-task');
    }, []);


    const onTaskDone = (id: number) => {
        const taskIndex = tasks.findIndex((task) => task.id === id);

        if (taskIndex === -1) return;

        const currentTask = tasks[taskIndex];

        const updatedTask: TaskItemQueryType = {
            ...currentTask,
            completed: currentTask.completed === 0 ? 1 : 0,
        };

        const newHabit = [
            ...tasks.slice(0, taskIndex),
            ...tasks.slice(taskIndex + 1),
        ];

        if (updatedTask.completed === 1) {
            newHabit.push(updatedTask);
        } else {
            newHabit.unshift(updatedTask);
        }


        setTasks(newHabit, loading);
    };


    const renderItem = ({ item }: { item: TaskItemQueryType }) => (
        <TaskItem
            key={item.id}
            cardContent={item.title}
            primaryColor={item.primary_color}
            taskItemId={item.id}
            isUseSetDoneLocal={false}
            setDoneOutFunc={onTaskDone}
            isDoneProps={item.completed === 1}
        />
    );



    return (
        <ActionSheet containerStyle={styles.sheetContainer}
            snapPoints={[60, 102]}
            initialSnapIndex={0}
            onSnapIndexChange={setIndex}
            onClose={() => {
                setLoading(true)
            }}
            keyboardHandlerEnabled={false}
            ref={sheetRef}
        >
            <View style={[styles.sheetContent, { paddingTop: index === 1 ? insets.top : 24 }]}>
                <View style={styles.header}>
                    <Pressable onPress={handleOnCloseSheet}
                        accessibilityLabel='Close Create Sub Task Sheet'
                    >
                        <Entypo name="chevron-down" size={24} color="white" style={{ transform: index === 1 ? 'rotate(90deg)' : 'rotate(0deg)', marginLeft: 8 }} />
                    </Pressable>
                    <Text style={styles.mainTaskTitle} lineBreakMode='tail' numberOfLines={1}>{payload?.mainTaskTitle}</Text>
                    <Entypo name="dots-three-horizontal" size={24} color="white" />
                </View>
                <GestureDetector gesture={flingGesture}>
                    <View style={{ width: '100%', height: '100%' }}>
                        <View style={styles.subTaskList}>

                            {/* Block Header */}
                            <BlockHeader
                                isShowSubTitle={false}
                                mainTitle=""
                                type='secondary'
                                subTitle=""
                                isShowBoxCount={tasks.length > 0}
                                boxCount={tasks.length}
                                isShowButton={true}
                                buttonEvent={() => SheetManager.show('create-sub-task', {
                                    payload: {
                                        type: 'create',
                                        mainTaskId: tasks[0]?.main_task_id ? tasks[0]?.main_task_id : payload?.mainTaskId!,
                                        title: '',
                                        color: tasks[0]?.primary_color ? tasks[0]?.primary_color : payload?.primaryColor!,
                                    }
                                })}
                            />

                        </View>
                        {/* Task List */}

                        <View style={[styles.tasksContainer, { maxHeight: index === 1 ? '84%' : 300 }]}>
                            {
                                tasks.length > 0 && !loading && (
                                    <Animated.FlatList
                                        showsVerticalScrollIndicator={false}
                                        showsHorizontalScrollIndicator={false}
                                        data={tasks}
                                        renderItem={renderItem}
                                        keyExtractor={(item) => item.id.toString()}
                                        itemLayoutAnimation={LinearTransition}
                                        contentContainerStyle={[styles.flatListContent]}
                                        refreshControl={
                                            <RefreshControl refreshing={false} onRefresh={() => { }} />
                                        }
                                    />

                                )
                            }
                            {/* Empty State */}
                            {tasks.length === 0 && !loading && (
                                <View style={styles.emptyContainer}>
                                    <Text style={styles.emptyText}>Empty</Text>
                                </View>
                            )}
                            {/* Loading Skeletons */}
                            {loading && (
                                <View style={styles.skeletonContainer}>
                                    {[...Array(4).keys()].map((_, index) => (
                                        <Skeleton
                                            key={index + 'groupTaskSkeletonHabit'}
                                            colorMode="dark"
                                            width="100%"
                                            height={52}
                                            colors={['#222239', '#2c2c49']}
                                        />
                                    ))}
                                </View>
                            )}
                        </View>
                        {
                            index === 0 && tasks.length > 0 && (
                                <Animated.View style={[styles.swipeUpContainer, arrowStyle]}>
                                    <AntDesign name="arrowup" size={40} color="#BBBBD4" />
                                </Animated.View>
                            )
                        }
                    </View>
                </GestureDetector>
            </View>
        </ActionSheet>
    );
};



export default ShowSubTaskSheet;

const styles = StyleSheet.create({
    sheetContainer: {
        backgroundColor: '#222239',
        height: "100%",
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
    },
    sheetContent: {
        height: "100%",
        width: "100%",
    },
    mainTaskTitle: {
        color: "white",
        fontSize: 24,
        textAlign: "center",
        fontWeight: "bold",
        maxWidth: '60%',
    },
    header: {
        flexDirection: "row", justifyContent: "space-between", width: "100%", alignItems: "center", paddingRight: 24, paddingLeft: 24
    },
    subTaskList: {
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        marginTop: 24,
        width: "100%",
        paddingLeft: 18,
        paddingRight: 20,
        height: "auto",
    },
    tasksContainer: {
        flexDirection: 'column',
        width: '100%',
        overflow: 'hidden',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        gap: 14,
    },
    flatListContent: {
        flexGrow: 0,
        gap: 6,
    },
    emptyContainer: {
        width: '100%',
        height: '60%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        textAlign: 'center',
        fontSize: 24,
        color: '#94a3b8',
    },
    skeletonContainer: {
        width: '100%',
        height: 'auto',
        justifyContent: 'flex-start',
        paddingHorizontal: 20,
        alignItems: 'flex-start',
        gap: 14,
    },
    swipeUpContainer: {
        width: '100%', paddingHorizontal: 20, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 12, marginTop: 24
    }
});
