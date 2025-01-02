import { View, Text, StyleSheet, ScrollView, RefreshControl, Dimensions, Modal } from 'react-native'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import BlockHeader from '@/components/BlockHeader'


import OverviewHomeTask from '@/components/OverviewHomeTask'
import { useOnboardingPersisStore } from '@/store/useOnboarding'
import OverviewHomeHabit from '@/components/OverviewHomeHabit'
import TaskItem from '@/components/TaskItem'
import MainTask from '@/components/MainTask'
import OnBoarding from '@/components/OnBoarding'
import * as SQLite from "expo-sqlite";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import { TaskItemNotHabitType, TaskItemQueryType } from '@/types/appTypes'
import { Skeleton } from 'moti/skeleton'








const TOTAL_TASKS = 10

const Index = () => {

  const { isFinished } = useOnboardingPersisStore()
  // DEBUGER
  const db = SQLite.openDatabaseSync("todo.db");
  useDrizzleStudio(db);
  // DEBUGER

  const [allTasks, setAllTasks] = useState<{
    habit: TaskItemQueryType[]
    tasks: TaskItemNotHabitType[]
    loading: boolean
  }>({
    habit: [],
    tasks: [],
    loading: true
  })


  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = () => {
    setRefreshing(true);

    // Simulate a network request or data refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 2000); // 2 seconds delay
  };


  const getGreeting = () => {
    const currentHour = new Date().getHours();

    if (currentHour < 12) {
      return 'Good Morning!';
    } else if (currentHour < 18) {
      return 'Good Afternoon!';
    } else {
      return 'Good Evening!';
    }
  };


  useEffect(() => {

    const sleep = (ms: number) => {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function getAllMainTask() {

      await sleep(1000)

      try {
        const result = await db.getAllAsync<TaskItemQueryType>(`SELECT t.*, mt.type AS main_task_type, mt.color AS primary_color, mt.title AS main_task_title, mt.id AS main_task_id, mt.due_day AS dueDate , mt.create_date AS createDate
      FROM tasks t
      JOIN main_tasks mt ON t.main_task_id = mt.id
      `);

        if (result) {
          const habit: TaskItemQueryType[] = []
          const tasksNotHabit: TaskItemNotHabitType[] = []


          result.map((item) => {
            if (item.main_task_type === 'habit') {
              habit.push(item)
            }
            else {
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
            habit: habit,
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


  const completedHabit = useMemo(() => {

    return allTasks.habit.filter((item) => item.completed === 1).length

  }, [allTasks.habit])


  const habitByPriority = useMemo(() => {

    const habitFilter: TaskItemQueryType[] = []
    allTasks.habit.map((item) => {
      if ((item.priority === 2 || item.priority === 1) && item.completed === 0 && habitFilter.length < 5) {
        habitFilter.push(item)
      }
    })
    return habitFilter

  }, [allTasks.habit])




  return (
    <ScrollView style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {
        <Modal style={{ backgroundColor: 'rgba(0, 0, 0, 0)' }} transparent={true} visible={!isFinished}>
          <OnBoarding />
        </Modal>
      }

      <View style={styles.helloBlock}>
        <Text style={{ fontSize: 32, color: '#fff', fontWeight: 300 }}>
          <Text style={{ color: "#FF748B" }} >{getGreeting()} </Text>
          <Text style={{ fontWeight: 600 }}>LinhTran</Text></Text>
      </View>

      <BlockHeader isShowSubTitle={false} mainTitle="Habit Overview" subTitle="see all" isShowBoxCount={false} boxCount={TOTAL_TASKS} />
      <OverviewHomeHabit doneTask={completedHabit} allTasks={allTasks.habit.length} />
      <BlockHeader isShowSubTitle={false} mainTitle="Task Overview" subTitle="see all" isShowBoxCount={false} boxCount={1} />
      <OverviewHomeTask />
      <BlockHeader isShowSubTitle={true} mainTitle="Recent Habit" subTitle="see all" isShowBoxCount={true} boxCount={allTasks.habit.length} />
      <View style={{ flexDirection: 'column', width: '100%', height: "auto", overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 14, marginBottom: 20 }}>
        {
          habitByPriority.length > 0 && !allTasks.loading && habitByPriority.map((item) =>
            <TaskItem key={item.id} cardContent={item.title} primaryColor={item.primary_color} taskItemId={item.id} isUseSetDoneLocal={true} isDoneProps={item.completed === 1 ? true : false} />
          )
        }
        {
          (habitByPriority.length === 0 || allTasks.loading) && (
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

      <BlockHeader isShowSubTitle={true} mainTitle="Recent Task" subTitle="see all" isShowBoxCount={true} boxCount={12} />

      <View style={{ flexDirection: 'column', width: '100%', height: 'auto', overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 14, marginBottom: 20 }}>
        <MainTask mainTaskName="Doing Some Coding" overAllPercent={80} remainTimePercent={100} primaryColor='#D7BDE2' />
        <MainTask mainTaskName="Leet Code 150 Interview" overAllPercent={40} remainTimePercent={100} primaryColor='#FFF5BA' />
        <MainTask mainTaskName="UI Design Mockups" overAllPercent={75} remainTimePercent={90} primaryColor='#FFD1DC' />
        <MainTask mainTaskName="Database Optimization" overAllPercent={60} remainTimePercent={70} primaryColor='#B2E7E8' />
        <MainTask mainTaskName="Team Presentation Prep" overAllPercent={50} remainTimePercent={60} primaryColor='#D7BDE2' />
        <MainTask mainTaskName="API Integration" overAllPercent={30} remainTimePercent={40} primaryColor='#FFF5BA' />
      </View>

    </ScrollView>
  )
}




const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A182C',
    padding: 20,
  },
  helloBlock: {
    width: '100%',
    height: 'auto',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    marginBottom: 20
  },
})

export default Index