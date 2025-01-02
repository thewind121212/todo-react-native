
import { View, StyleSheet, RefreshControl, ScrollView, TextInput, Dimensions, Pressable, Text } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import React, { useEffect, useState } from 'react'
import BlockHeader from '@/components/BlockHeader'
import TaskItem from '@/components/TaskItem'
import AddButton from '@/components/AddButton';
import { useSQLiteContext } from 'expo-sqlite';
import { TaskItemQueryType } from '@/types/appTypes';
import { Skeleton } from 'moti/skeleton';


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

  const { width, height } = Dimensions.get('window');

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
      const result = await db.getAllAsync<TaskItemQueryType>(`SELECT t.*, mt.type AS main_task_type, mt.color AS primary_color, mt.title AS main_task_title, mt.id AS main_task_id, mt.due_day AS dueDate , mt.create_date AS createDate
      FROM tasks t
      JOIN main_tasks mt ON t.main_task_id = mt.id
`);

      if (result) {
        const habit: TaskItemQueryType[] = []

        result.map((item) => {
          if (item.main_task_type === 'habit') {
            habit.push(item)
          }
        })

        setAllTasks({
          ...allTasks,
          habit: habit,
          loading: false
        })
      }
    }

    getAllMainTask()

  }, [])


  const handleSearch = () => {
    console.log('searching for:', height);
  }



  return (

    <View style={{ flex: 1, width: "100%", backgroundColor: '#1A182C', display: 'flex', justifyContent: 'center', alignItems: 'center', height: "auto" }}>
      <View style={{ width: 64, height: 64, position: "fixed", top: height - (64 + 200), right: -(width / 2 - (50)), zIndex: 5, borderRadius: 12, display: "flex", justifyContent: "center", alignItems: "center" }}>
        <AddButton />
      </View>

      <ScrollView style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >

        <View style={{ width: "100%", height: 64, backgroundColor: "#222239", borderRadius: 12, marginBottom: 24, position: "relative" }}>
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

        <BlockHeader isShowSubTitle={false} mainTitle="All Habit" subTitle="see all" isShowBoxCount={true} boxCount={allTasks.habit.length} />
        <View style={{ flexDirection: 'column', width: '100%', height: "auto", overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 14, marginBottom: 110, }}>
          {
            allTasks.habit.length > 0 && !allTasks.loading && allTasks.habit.map((item) =>
              <TaskItem key={item.id} cardContent={item.title} primaryColor={item.primary_color} taskItemId={item.id} isUseSetDoneLocal={true} isDoneProps={item.completed === 1 ? true : false} />
            )
          }
          {
            (allTasks.habit.length === 0 || allTasks.loading) && (
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

      </ScrollView >

    </View >
  )


}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#1A182C',
    width: "100%",
    padding: 20,
    marginTop: -64,
  },
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