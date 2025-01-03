
import { View, StyleSheet, RefreshControl, ScrollView, TextInput, Dimensions, Pressable, Text } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSQLiteContext } from 'expo-sqlite';
import { SheetManager } from 'react-native-actions-sheet';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import React, { useEffect, useState } from 'react'
import BlockHeader from '@/components/BlockHeader'
import GroupCard from '@/components/GroupCard';
import { MainTaskType } from '@/types/appTypes';
import { Skeleton } from 'moti/skeleton'




const AllTasks = () => {

  const [refreshing, setRefreshing] = useState(false);
  const [query, setQuery] = useState<string>('');
  const [allTasks, setAllTasks] = useState<{
    habit: MainTaskType[],
    task: MainTaskType[]
    isLoading: boolean
  }>({
    isLoading: true,
    habit: [],
    task: []
  });

  const db = useSQLiteContext();



  const { width, height } = Dimensions.get('window');

  const onRefresh = () => {
    setRefreshing(true);

    // Simulate a network request or data refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 2000); // 2 seconds delay
  };


  const handleSearch = () => {
    console.log('searching for:', height);
  }


  useEffect(() => {


    //simulate sleep

    const sleep = (ms: number) => {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function getAllMainTask() {

      await sleep(300)
      try {
        const result = await db.getAllAsync<MainTaskType>('SELECT * FROM main_tasks');
        if (result) {
          const habit = result.filter((item) => item.type === 'habit');
          const task = result.filter((item) => item.type === 'task');
          setAllTasks({
            ...allTasks,
            habit,
            task,
            isLoading: false
          })
        }

      } catch (error) {
        setAllTasks({
          ...allTasks,
          isLoading: false
        })

      }
    }



    getAllMainTask()

  }, [])

  return (

    <View style={{ flex: 1, width: "100%", backgroundColor: '#1A182C', display: 'flex', justifyContent: 'center', alignItems: 'center', height: "auto" }}>
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


        <BlockHeader isShowSubTitle={false} mainTitle="Group Habit" subTitle="see all" isShowBoxCount={allTasks.habit.length > 0 ? true : false} boxCount={allTasks.habit.length} isShowButton={true}
          buttonEvent={() => SheetManager.show('create-main-task')}
        />


        <View
          style={{ flexDirection: 'column', width: '100%', height: 'auto', overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 14, marginBottom: 20 }}
        >
          {
            allTasks.habit.length > 0 && allTasks.habit.map((mainTaskItem) => {
              return (
                <GroupCard key={mainTaskItem.id} mainTaskName={mainTaskItem.title} color={mainTaskItem.color} />
              )
            })
          }
          {
            (allTasks.habit.length === 0 && !allTasks.isLoading) && (
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


        <View style={{ marginTop: 40 }}></View>
        <BlockHeader isShowSubTitle={false} mainTitle="Group Task" subTitle="see all" isShowBoxCount={allTasks.habit.length > 0 ? true : false} boxCount={allTasks.task.length} isShowButton={true} />
        <View
          style={{ flexDirection: 'column', width: '100%', height: 'auto', overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 14, marginBottom: 20 }}
        >
          {
            allTasks.task.length > 0 && allTasks.task.map((mainTaskItem) => {
              return (
                <GroupCard key={mainTaskItem.id} mainTaskName={mainTaskItem.title} color={mainTaskItem.color} isHabit={false} />
              )
            })
          }
          {
            (allTasks.task.length === 0 && !allTasks.isLoading) && (
              <View style={{ width: "100%", height: 400, display: "flex", justifyContent: "center", alignContent: "center" }} >
                <Text style={{ textAlign: "center", fontSize: 24, color: "#94a3b8" }}>Empty</Text>
              </View>
            )
          }
          {
            allTasks.isLoading && (
              <>
                {[...Array(5).keys()].map((_, index) => (
                  <Skeleton key={index + "groupTaskSkeletonTasks"} colorMode={'dark'} width={'100%'} height={52} colors={["#222239", "#2c2c49"]} />
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