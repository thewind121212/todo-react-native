
import { View, StyleSheet, TextInput, Dimensions, Pressable, Text, StatusBar } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import React, { useEffect, useMemo, useState } from 'react'
import BlockHeader from '@/components/BlockHeader'
import { useSQLiteContext } from 'expo-sqlite';
import { TaskItemNotHabitType, TaskItemQueryType } from '@/types/appTypes';
import TaskTree, { TaskTreePlaceHolder } from '@/components/TaskTree';
import { FlashList } from "@shopify/flash-list";

import { MotiView } from 'moti';

import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';


const Spacer = ({ height = 16 }) => <MotiView style={{ height }} />



const AllTask = () => {


    const [refreshing, setRefreshing] = useState(false);
    const [allTasks, setAllTasks] = useState<{
        tasks: TaskItemNotHabitType[]
        loading: boolean
    }>({
        tasks: [],
        loading: true
    })
    const [query, setQuery] = useState<string>('');
    const db = useSQLiteContext();

    const { height } = Dimensions.get('window');

    const onRefresh = () => {
        setRefreshing(true);

        // Simulate a network request or data refresh
        setTimeout(() => {
            setRefreshing(false);
        }, 2000); // 2 seconds delay
    };



    useEffect(() => {

        const sleep = (ms: number) => {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        async function getAllMainTask() {
            await sleep(300)

            try {
                const result = await db.getAllAsync<TaskItemQueryType>(`SELECT t.*, mt.type AS main_task_type, mt.color AS primary_color, mt.title AS main_task_title, mt.id AS main_task_id, mt.due_day AS dueDate , mt.create_date AS createDate
            FROM tasks t
            JOIN main_tasks mt ON t.main_task_id = mt.id
            `);

                if (result) {
                    const tasksNotHabit: TaskItemNotHabitType[] = []


                    result.map((item) => {
                        if (item.main_task_type !== 'habit') {
                            const indexOfTask = tasksNotHabit.findIndex((task) => task.id === item.main_task_id.toString())
                            if (indexOfTask === -1) {
                                tasksNotHabit.push({
                                    id: item.main_task_id.toString(),
                                    primary_color: item.primary_color,
                                    title: item.main_task_title,
                                    dueDate: item.dueDate,
                                    createDate: item.createDate,
                                    data: [item]
                                })
                            } else {
                                tasksNotHabit[indexOfTask].data.push(item)
                            }
                        }
                    })

                    setAllTasks({
                        ...allTasks,
                        tasks: tasksNotHabit,
                        loading: false
                    })
                }

            } catch (error) {
                setAllTasks({
                    ...allTasks,
                    loading: false
                })
            }

        }

        getAllMainTask()

    }, [])


    const handleSearch = () => {
        console.log('searching for:', height);
    }


    const totalTask = useMemo(() => {
        return allTasks.tasks.reduce((acc, item) => acc + item.data.length, 0)
    }, [allTasks])




    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.safeArea}>
                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Search"
                        value={query}
                        onChangeText={handleSearch}
                        placeholderTextColor="#4D4C71"
                    />
                    <View style={styles.searchIconContainer}>
                        <Ionicons name="search" size={32} color="white" />
                    </View>
                    <Pressable
                        style={styles.clearIconContainer}
                        onPressIn={() => setQuery('')}
                    >
                        {query.length > 0 && (
                            <FontAwesome6 name="xmark" size={24} color="white" />
                        )}
                    </Pressable>
                </View>
                {/* Block Header */}
                <BlockHeader
                    isShowSubTitle={false}
                    mainTitle="All Task"
                    subTitle="see all"
                    isShowBoxCount={totalTask > 0}
                    boxCount={totalTask}
                />

                {/* Task List */}
                <View style={styles.tasksListContainer}>
                    {allTasks.tasks.length > 0 && !allTasks.loading ? (
                        <View style={{ width: Dimensions.get("screen").width, height: "81.3%" }}>
                            <FlashList
                                estimatedItemSize={100}
                                data={allTasks.tasks}
                                renderItem={({ item }) =>
                                    <TaskTree
                                        key={item.id}
                                        mainTaskId={item.id}
                                        mainTaskName={item.title}
                                        color={item.primary_color}
                                        data={item.data}
                                        dueDate={item.dueDate}
                                        taskCreatDay={item.createDate}
                                    />
                                }

                            />
                        </View>
                    ) : !allTasks.loading ? (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>Empty</Text>
                        </View>
                    ) : (
                        <>
                            <TaskTreePlaceHolder />
                            <Spacer height={14} />
                            <TaskTreePlaceHolder />
                        </>
                    )}
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    );

}



const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#1A182C',
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 20,
        paddingTop: StatusBar.currentHeight || 0,
    },
    searchContainer: {
        width: '100%',
        height: 64,
        backgroundColor: '#222239',
        borderRadius: 12,
        marginBottom: 24,
        marginTop: 20,
        position: 'relative',
        justifyContent: 'center',
    },
    input: {
        height: '100%',
        paddingHorizontal: 64,
        borderRadius: 12,
        color: 'white',
        fontSize: 20,
    },
    searchIconContainer: {
        width: 64,
        height: 64,
        position: 'absolute',
        left: 0,
        top: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        flex: 1,
        width: '100%',
        padding: 20,
        marginTop: -64,
    },
    clearIconContainer: {
        width: 64,
        height: 64,
        position: 'absolute',
        right: 0,
        top: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tasksListContainer: {
        height: '100%',
        overflow: 'hidden',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        gap: 14,
        marginBottom: 90,
    },
    emptyContainer: {
        width: '100%',
        height: 400,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        textAlign: 'center',
        fontSize: 24,
        color: '#94a3b8',
    },
});




export default AllTask