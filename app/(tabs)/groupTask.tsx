
import { View, StyleSheet, RefreshControl, TextInput, Pressable, Text } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSQLiteContext } from 'expo-sqlite';
import { SheetManager } from 'react-native-actions-sheet';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import React, { useEffect, useMemo, useState, useTransition } from 'react'
import BlockHeader from '@/components/BlockHeader'
import GroupCard from '@/components/GroupCard';
import { MainTaskType } from '@/types/appTypes';
import { Skeleton } from 'moti/skeleton'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Animated, { LinearTransition } from 'react-native-reanimated';
import { calcRemainTimePercent } from '@/utils/helper';




const AllTasks = () => {


  const [refreshing, setRefreshing] = useState(false);
  const [shouldRefresh, setShouldRefresh] = useState(true);
  const [pending, startTransiton] = useTransition()
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



  const deleteMainTaskHander = async (id: string) => {
    try {
      setAllTasks({
        ...allTasks,
        allMainTasks: allTasks.allMainTasks.filter((task) => task.id.toString() !== id)
      })

      startTransiton(() => {
        db.runSync(`DELETE FROM main_tasks WHERE id = (?)`, id)
      })
    } catch (error) {
      console.log(error)
    }
  }

  const onEditHander = async (task: MainTaskType) => {
    SheetManager.show('create-main-task', {
      payload: {
        type: task.type === 'habit' ? "editHabit" : "editTask",
        task: task,
        onTaskCreate: () => { },
        onUpdateTask: (id: number, editedTask: MainTaskType | undefined) => {
          if (!editedTask) return
          const index = allTasks.allMainTasks.findIndex(task => task.id === id)
          startTransiton(() => {
            allTasks.allMainTasks[index] = editedTask
            setAllTasks({
              ...allTasks,
              allMainTasks: [...allTasks.allMainTasks]
            })
          })
        }
      }
    })
  }



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
              const re = calcRemainTimePercent(task.due_day!, task.create_date)
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
      <SafeAreaView style={{ flex: 1, width: "100%", backgroundColor: '#1A182C', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', padding: 20, marginTop: 0 }}>

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
          style={{ flexDirection: 'column', width: '100%', overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 14, marginBottom: 150 }}
        >

          {
            taskRender.length > 0 && <Animated.FlatList
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              data={taskRender}
              renderItem={
                ({ item }) => (
                  <GroupCard key={item.id} mainTaskItem={item} deleteMainTaskHander={deleteMainTaskHander} editMainTaskHander={onEditHander} />
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