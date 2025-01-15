import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    Gesture,
    GestureDetector,
    Directions,
    Pressable,
} from 'react-native-gesture-handler';
import { StyleSheet, View, Text, RefreshControl } from 'react-native';
import ActionSheet, { ActionSheetRef, SheetManager, SheetProps } from 'react-native-actions-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { useAnimatedReaction, useSharedValue, runOnJS, LinearTransition } from 'react-native-reanimated';
import Entypo from '@expo/vector-icons/Entypo';
import BlockHeader from '../BlockHeader';
import { useSQLiteContext } from 'expo-sqlite';
import { TaskItemQueryType } from '@/types/appTypes';
import TaskItem from '../TaskItem';
import { Skeleton } from 'moti/skeleton';


const CreateSubTaskSheet = ({ payload }: SheetProps<'create-sub-task'>) => {

    const db = useSQLiteContext();
    const sheetRef = useRef<ActionSheetRef | null>(null)
    const sheetIndexShareValue = useSharedValue<number>(0)
    const [index, setIndex] = useState<number>(0)
    const mountRef = useRef<boolean>(false)
    const [allTasks, setAllTasks] = useState<{
        allSubTasks: TaskItemQueryType[];
        loading: boolean;
    }>({
        allSubTasks: [],
        loading: true,
    });
    const insets = useSafeAreaInsets();


    const flingGestureUp = Gesture.Fling()
        .direction(Directions.UP)
        .onStart((e) => {
            sheetIndexShareValue.value = 1
        });


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

                    setAllTasks({
                        ...allTasks,
                        allSubTasks: habit,
                        loading: false,
                    });

                }
            } catch (error) {
                setAllTasks({
                    ...allTasks,
                    loading: false,
                });
            }
        }

        getAllMainTask();
    }, [payload?.mainTaskId]);

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

    const flingGesture = Gesture.Exclusive(flingGestureUp, flingGestureDown)



    const handleOnCloseSheet = useCallback(() => {
        SheetManager.hide('create-sub-task');
    }, []);


    const onTaskDone = (id: number) => {
        const taskIndex = allTasks.allSubTasks.findIndex((task) => task.id === id);

        if (taskIndex === -1) return;

        const currentTask = allTasks.allSubTasks[taskIndex];

        const updatedTask: TaskItemQueryType = {
            ...currentTask,
            completed: currentTask.completed === 0 ? 1 : 0,
        };

        const newHabit = [
            ...allTasks.allSubTasks.slice(0, taskIndex),
            ...allTasks.allSubTasks.slice(taskIndex + 1),
        ];

        if (updatedTask.completed === 1) {
            newHabit.push(updatedTask);
        } else {
            newHabit.unshift(updatedTask);
        }

        setAllTasks({
            ...allTasks,
            allSubTasks: newHabit,
        });
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
            ref={sheetRef}
        >
            <GestureDetector gesture={flingGesture} >
                <View style={[styles.sheetContent, { paddingTop: index === 1 ? insets.top : 20 }]}>
                    <View style={styles.header}>
                        <Pressable onPress={handleOnCloseSheet}
                            accessibilityLabel='Close Create Sub Task Sheet'
                        >
                            <Entypo name="chevron-down" size={24} color="white" style={{ transform: index === 1 ? 'rotate(90deg)' : 'rotate(0deg)' }} />
                        </Pressable>
                        <Text style={styles.mainTaskTitle} lineBreakMode='tail' numberOfLines={1}>{payload?.mainTaskTitle}</Text>
                        <Entypo name="dots-three-horizontal" size={24} color="white" />
                    </View>
                    <View style={styles.subTaskList}>

                        {/* Block Header */}
                        <BlockHeader
                            isShowSubTitle={false}
                            mainTitle="Sub Task"
                            type='secondary'
                            subTitle=""
                            isShowBoxCount={allTasks.allSubTasks.length > 0}
                            boxCount={allTasks.allSubTasks.length}
                            isShowButton={true}
                        />

                    </View>
                    {/* Task List */}
                    <View style={[styles.tasksContainer, { height: index === 1 ? 'auto' : '34%' }]}>
                        {
                            allTasks.allSubTasks.length > 0 && !allTasks.loading && (
                                <Animated.FlatList
                                    showsVerticalScrollIndicator={false}
                                    showsHorizontalScrollIndicator={false}
                                    data={allTasks.allSubTasks}
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
                        {allTasks.allSubTasks.length === 0 && !allTasks.loading && (
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyText}>Empty</Text>
                            </View>
                        )}
                        {/* Loading Skeletons */}
                        {allTasks.loading && (
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
                        index === 0 && allTasks.allSubTasks.length > 0 && (
                            <View style={styles.swipeUpContainer}>
                                <MaterialIcons name="swipe-up" size={40} color="white" />
                                <Text style={{ color: "#BBBBD4" }}>Swipe Up To Expand</Text>
                            </View>
                        )
                    }
                </View>
            </GestureDetector>
        </ActionSheet>
    );
}




export default CreateSubTaskSheet;

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
    },
    header: {
        flexDirection: "row", justifyContent: "space-between", width: "100%", alignItems: "center", paddingHorizontal: 20
    },
    subTaskList: {
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        marginTop: 24,
        width: "100%",
        paddingHorizontal: 20,
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
        width: '100%', paddingHorizontal: 20, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 12, marginTop: 8
    }
});
