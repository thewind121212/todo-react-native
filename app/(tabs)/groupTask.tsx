
import { View, StyleSheet, RefreshControl, ScrollView, TextInput, Dimensions, Pressable, Text } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { SQLiteDatabase, useSQLiteContext } from 'expo-sqlite';
import { SheetManager } from 'react-native-actions-sheet';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import React, { useEffect, useMemo, useState } from 'react'
import BlockHeader from '@/components/BlockHeader'
import GroupCard from '@/components/GroupCard';
import { MainTaskType } from '@/types/appTypes';
import { Skeleton } from 'moti/skeleton'
import { HoldItem } from 'react-native-hold-menu';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Animated, { LinearTransition } from 'react-native-reanimated';



const deleteMainTaskHander = async (db: SQLiteDatabase, id: string) => {
  try {
    const result = await db.runAsync(`DELETE FROM main_tasks WHERE id = (?)`, id)
    console.log(result)
  } catch (error) {
    console.log(error)
  }
}


const AllTasks = () => {


  const [refreshing, setRefreshing] = useState(false);
  const [shouldRefresh, setShouldRefresh] = useState(true);
  const [query, setQuery] = useState<string>('');
  const [allTasks, setAllTasks] = useState<{
    allMainTasks: MainTaskType[]
    isLoading: boolean
  }>({
    isLoading: true,
    allMainTasks: []
  });

  const db = useSQLiteContext();
  const timeOutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);


  const MenuItems = [
    {
      text: 'Edit', icon: () => <FontAwesome name="edit" size={22} color="white" />, onPress: (action: "editHabit" | "editTask", task: MainTaskType) => {

        SheetManager.show('create-main-task', { payload: { type: action, onTaskCreate: () => setRefreshing(true), task: task } })
      }
    },
    {
      text: 'Delete', icon: () => <FontAwesome6 name="delete-left" size={22} color="white" />, onPress: (task: MainTaskType) => {
        deleteMainTaskHander(db, task.id.toString())
        setRefreshing(true)
      }, isDestructive: true
    },
  ];




  const onRefresh = () => {
    if (refreshing) return;
    setShouldRefresh(!shouldRefresh);
    setRefreshing(true);
    timeOutRef.current = setTimeout(() => {
      setRefreshing(false);
    }, 1000)
  };


  useEffect(() => {
    async function getAllMainTask() {
      try {
        const result = await db.getAllAsync<MainTaskType>('SELECT * FROM main_tasks ORDER BY create_date DESC');
        if (result) {
          const modifiyTask: MainTaskType[] = []
          result.map((task) => {
            if (task.type === 'task') {
              const [year, month, day] = task.due_day ? task.due_day.split('-').map(Number) : [0, 0, 0];
              const dueDayTimeStamp = new Date(year, month - 1, day).getTime()
              const createDayTimeStamp = new Date(task.create_date).getTime()
              const today = new Date().getTime()
              const re = 100 - ((today - createDayTimeStamp) / (dueDayTimeStamp - createDayTimeStamp) * 100)
              const newTask = { ...task, remainTimePercent: re }
              modifiyTask.push(newTask)
            }
            else {
              const newTask = { ...task, remainTimePercent: 0 }
              modifiyTask.push(newTask)
            }
          })


          setAllTasks({
            ...allTasks,
            allMainTasks: modifiyTask,
            isLoading: false
          });
        }
      } catch (error) {
        setAllTasks({
          ...allTasks,
          isLoading: false
        })
      }
    }

    getAllMainTask()

  }, [shouldRefresh])


  const onCreateMainTaskHander = (action: "habit" | "task", task: MainTaskType) => {
    setAllTasks({
      ...allTasks,
      allMainTasks: [task, ...allTasks.allMainTasks]
    })
  }


  const handleSearch = (e: string) => {
    setQuery(e.trimEnd());
  }


  const taskRender = useMemo(() => {
    if (query.length === 0) {
      return allTasks.allMainTasks;
    }
    return allTasks.allMainTasks.filter((mainTaskItem) => mainTaskItem.title.toLowerCase().includes(query.toLowerCase()));

  }, [query, allTasks.allMainTasks])




  return (

    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, width: "100%", backgroundColor: '#1A182C', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', height: "auto", padding: 20, marginTop: 0 }}>

        <View style={{ width: "100%", height: 64, backgroundColor: "#222239", borderRadius: 12, marginBottom: 24, position: "relative" }}>
          <TextInput
            style={styles.input}
            placeholder="Search"
            value={query}
            onChangeText={handleSearch}
            placeholderTextColor={'#4D4C71'}
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


        <BlockHeader isShowSubTitle={false} mainTitle="All Main Task" subTitle="see all" isShowBoxCount={taskRender.length > 0 ? true : false} boxCount={taskRender.length} isShowButton={true}
          buttonEvent={() => SheetManager.show('create-main-task', { payload: { type: "habit", onTaskCreate: onCreateMainTaskHander } })}
        />


        <View
          style={{ flexDirection: 'column', width: '100%', height: 'auto', overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 14, marginBottom: 20 }}
        >

          {
            taskRender.length > 0 && <Animated.FlatList
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              data={taskRender}
              renderItem={
                ({ item }) => (
                  <HoldItem key={item.id} items={MenuItems} menuAnchorPosition='top-left'
                    actionParams={{
                      Edit: ["editHabit", item],
                      Delete: [item]
                    }}
                  >
                    <GroupCard key={item.id} mainTaskItem={item} />
                  </HoldItem>
                )
              }
              itemLayoutAnimation={LinearTransition}
              contentContainerStyle={{ gap: 14 }}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            />
          }
          {
            (taskRender.length === 0 && !allTasks.isLoading) && (
              <View style={{ width: "100%", height: 400, display: "flex", justifyContent: "center", alignContent: "center" }} >
                <Text style={{ textAlign: "center", fontSize: 24, color: "#94a3b8" }}>Empty</Text>
              </View>
            )
          }
          {
            allTasks.isLoading && (
              <>
                {[...Array(5).keys()].map((_, index) => (
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
  container: {
    flex: 1,
    // backgroundColor: '#1A182C',
    width: "100%",
    padding: 20,
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

export default AllTasks