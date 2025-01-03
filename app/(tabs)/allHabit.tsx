
import { View, StyleSheet, TextInput, Dimensions, Pressable, Text, RefreshControl, StatusBar } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons';

import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import React, { useEffect, useState } from 'react'
import BlockHeader from '@/components/BlockHeader'
import TaskItem from '@/components/TaskItem'
import { useSQLiteContext } from 'expo-sqlite';
import { TaskItemQueryType } from '@/types/appTypes';
import { Skeleton } from 'moti/skeleton';
import Animated, { LinearTransition } from 'react-native-reanimated';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { asCalendarConsumer } from 'react-native-calendars';


const AllHabits = () => {

  const [refreshing, setRefreshing] = useState(false);
  const [allTasks, setAllTasks] = useState<{
    habit: TaskItemQueryType[]
    loading: boolean
  }>({
    habit: [],
    loading: true
  })
  const [query, setQuery] = useState<string>('');
  const db = useSQLiteContext();

  const { height } = Dimensions.get('window');

  const onRefresh = () => {
    setRefreshing(true);
  };


  const onTaskDone = (id: number) => {
    const taskIndex = allTasks.habit.findIndex(task => task.id === id);

    if (taskIndex === -1) return;

    const currentTask = allTasks.habit[taskIndex];

    const updatedTask: TaskItemQueryType = {
      ...currentTask,
      completed: currentTask.completed === 0 ? 1 : 0
    };

    const newHabit = [
      ...allTasks.habit.slice(0, taskIndex),
      ...allTasks.habit.slice(taskIndex + 1)
    ];

    if (updatedTask.completed === 1) {
      newHabit.push(updatedTask);
    } else {
      newHabit.unshift(updatedTask);
    }

    setAllTasks({
      ...allTasks,
      habit: newHabit
    });
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
          const habit: TaskItemQueryType[] = []

          result.map((item) => {
            if (item.main_task_type === 'habit' && item.completed === 1) {
              habit.push(item)
            } else if (item.main_task_type === 'habit' && item.completed === 0) {
              habit.unshift(item)
            }
          })

          setAllTasks({
            ...allTasks,
            habit: habit,
            loading: false
          })

          setRefreshing(false);
        }
      } catch (error) {
        setAllTasks({
          ...allTasks,
          loading: false
        })
        setRefreshing(false);
      }
    }

    getAllMainTask()

  }, [refreshing])


  const handleSearch = () => {
    console.log('searching for:', height);
  }

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
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, width: "100%", backgroundColor: '#1A182C', display: 'flex', justifyContent: 'center', alignItems: 'center', height: "auto", padding: 20, marginTop: 0 }}>

        <View style={{ width: "100%", height: 64, backgroundColor: "#222239", borderRadius: 12, marginBottom: 24, position: "relative", marginTop: 144 }}>
          <TextInput
            style={styles.input}
            placeholder="Search"
            value={query}
            onChangeText={setQuery}
            placeholderTextColor={'#4D4C71'}
            onSubmitEditing={handleSearch}
          />
          <View style={{ width: 64, height: 64, position: "absolute", left: 0, top: 0, display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Ionicons name="search" size={32} color="white" />
          </View>
          <Pressable style={{ width: 64, height: 64, position: "absolute", right: 0, top: 0, display: "flex", justifyContent: "center", alignItems: "center" }}
            onPressIn={() => setQuery('')}
          >
            {
              query.length > 0 &&
              <FontAwesome6 name="xmark" size={24} color="white" />
            }
          </Pressable>
        </View>

        <BlockHeader isShowSubTitle={false} mainTitle="All Habit" subTitle="see all" isShowBoxCount={allTasks.habit.length > 0 ? true : false} boxCount={allTasks.habit.length} buttonEvent={() => console.log("linh")} isShowButton={true} />
        <View style={{ flexDirection: 'column', width: '100%', height: "auto", overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 14, marginBottom: 110, }}>
          {
            <Animated.FlatList
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              data={allTasks.habit}
              renderItem={renderItem}
              itemLayoutAnimation={LinearTransition}
              contentContainerStyle={{ gap: 14 }}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            />
          }
          {
            (allTasks.habit.length === 0 && !allTasks.loading) && (
              <View style={{ width: "100%", height: 400, display: "flex", justifyContent: "center", alignContent: "center" }} >
                <Text style={{ textAlign: "center", fontSize: 24, color: "#94a3b8" }}>Empty</Text>
              </View>
            )
          }
          {
            allTasks.loading && (
              <>
                {[...Array(10).keys()].map((_, index) => (
                  <Skeleton key={index + "groupTaskSkeletonHabit"} colorMode={'dark'} width={'100%'} height={52} colors={["#222239", "#2c2c49"]} />
                ))}
              </>
            )
          }
        </View>

      </SafeAreaView >
    </SafeAreaProvider>
  )


}


const styles = StyleSheet.create({
  input: {
    height: "100%",
    paddingHorizontal: 64,
    marginBottom: 10,
    borderRadius: 12,
    color: '#4D4C71',
    fontSize: 20,
  },
})

export default AllHabits