import { View, Text, StyleSheet, ScrollView, RefreshControl, Modal } from 'react-native'
import React, { useEffect, useMemo, useState } from 'react'
import BlockHeader from '@/components/BlockHeader'


import OverviewHomeTask, { OverviewHomeTaskPlaceHolder } from '@/components/OverviewHomeTask'
import { useOnboardingPersisStore } from '@/store/useOnboarding'
import OverviewHomeHabit, { OverviewHabitPlaceHolder } from '@/components/OverviewHomeHabit'
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

      await sleep(300)

      try {
        const result = await db.getAllAsync<TaskItemQueryType>(`SELECT t.*, mt.type AS main_task_type, mt.color AS primary_color, mt.title AS main_task_title, mt.id AS main_task_id, mt.due_day AS dueDate , mt.create_date AS createDate
      FROM tasks t
      JOIN main_tasks mt ON t.main_task_id = mt.id
      ORDER BY mt.create_date DESC
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
          setRefreshing(false)
        }
      } catch (error) {
        setAllTasks({
          ...allTasks,
          loading: false
        })
        setRefreshing(false)
      }

    }

    getAllMainTask()

  }, [refreshing])


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





  const taskTransform: {
    fullPercent: number,
    taskRandom: Array<TaskItemNotHabitType & { completePercent: number }>
    modifiyTask: Array<TaskItemNotHabitType & { completePercent: number, remainTimePercent: number }>
  } = useMemo(() => {

    let fullPercent = 0
    let taskRandom: Array<TaskItemNotHabitType & { completePercent: number }> = []
    let modifiyTask: Array<TaskItemNotHabitType & { completePercent: number, remainTimePercent: number }> = []

    for (const task of allTasks.tasks) {
      let taskDone = 0
      for (const subTask of task.data) {
        taskDone += subTask.completed ? 1 : 0
      }
      const completeItem = taskDone / task.data.length * 100

      fullPercent += completeItem

      const [year, month, day] = task.dueDate.split('-').map(Number);
      const dueDayTimeStamp = new Date(year, month - 1, day).getTime()
      const createDayTimeStamp = new Date(task.createDate).getTime()
      const today = new Date().getTime()
      const re = 100 - ((today - createDayTimeStamp) / (dueDayTimeStamp - createDayTimeStamp) * 100)
      const newTask = { ...task, completePercent: completeItem, remainTimePercent: re }
      modifiyTask.push(newTask)

      if (taskRandom.length < 2 && completeItem < 100) {
        taskRandom.push(newTask)
      }
    }


    return {
      fullPercent,
      taskRandom,
      modifiyTask
    }
  }, [allTasks.tasks])



  const { fullPercent, taskRandom, modifiyTask } = taskTransform



  return (

    <ScrollView style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Modal style={styles.modal} transparent={true} visible={!isFinished}>
        <OnBoarding />
      </Modal>

      <View style={styles.helloBlock}>
        <Text style={styles.greetingText}>
          <Text style={styles.greetingColor}>{getGreeting()} </Text>
          <Text style={styles.greetingName}>LinhTran</Text>
        </Text>
      </View>

      <BlockHeader
        isShowSubTitle={false}
        mainTitle="Habit Overview"
        subTitle="see all"
        isShowBoxCount={false}
        boxCount={TOTAL_TASKS}
      />
      {
        allTasks.habit.length > 0 && !allTasks.loading && (
          <OverviewHomeHabit doneTask={completedHabit} allTasks={allTasks.habit.length} />
        )
      }
      {
        (allTasks.habit.length === 0 || allTasks.loading) && (
          <OverviewHabitPlaceHolder />
        )
      }
      <BlockHeader
        isShowSubTitle={false}
        mainTitle="Task Overview"
        subTitle="see all"
        isShowBoxCount={false}
        boxCount={1}
      />
      {
        allTasks.tasks.length > 0 && !allTasks.loading && (
          <OverviewHomeTask tasks={allTasks.tasks} fullPercent={fullPercent} taskRandom={taskRandom} />
        )
      }
      {
        (allTasks.habit.length === 0 || allTasks.loading) && (
          <OverviewHomeTaskPlaceHolder />
        )
      }
      <BlockHeader
        isShowSubTitle={true}
        mainTitle="Recent Habit"
        subTitle="see all"
        isShowBoxCount={true}
        boxCount={allTasks.habit.length}
      />
      <View style={styles.columnContainer}>
        {
          habitByPriority.length > 0 && !allTasks.loading && habitByPriority.map((item) =>
            <TaskItem
              key={item.id}
              cardContent={item.title}
              primaryColor={item.primary_color}
              taskItemId={item.id}
              isUseSetDoneLocal={true}
              isDoneProps={item.completed === 1 ? true : false}
            />
          )
        }
        {
          (habitByPriority.length === 0 || allTasks.loading) && (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Empty</Text>
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

      <BlockHeader
        isShowSubTitle={true}
        mainTitle="Recent Task"
        subTitle="see all"
        isShowBoxCount={true}
        boxCount={modifiyTask.length}
      />

      <View style={styles.columnContainer}>
        {
          modifiyTask.length > 0 && !allTasks.loading && modifiyTask.map((item) =>
            <MainTask
              key={item.id}
              mainTaskName={item.title}
              overAllPercent={item.completePercent}
              remainTimePercent={item.remainTimePercent}
              primaryColor={item.primary_color}
            />
          )
        }
        {
          allTasks.loading && (
            <>
              {[...Array(10).keys()].map((_, index) => (
                <Skeleton key={index + "groupTaskSkeletonHabit"} colorMode={'dark'} width={'100%'} height={64} colors={["#222239", "#2c2c49"]} />
              ))}
            </>
          )
        }
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
  modal: {
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },
  greetingText: {
    fontSize: 32,
    color: '#fff',
    fontWeight: '300',
  },
  greetingColor: {
    color: "#FF748B",
  },
  greetingName: {
    fontWeight: '600',
  },
  columnContainer: {
    flexDirection: 'column',
    width: '100%',
    height: 'auto',
    overflow: 'hidden',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    gap: 14,
    marginBottom: 20,
  },
  emptyContainer: {
    width: "100%",
    height: 400,
    display: "flex",
    justifyContent: "center",
    alignContent: "center",
  },
  emptyText: {
    textAlign: "center",
    fontSize: 24,
    color: "#94a3b8",
  },
});

export default Index