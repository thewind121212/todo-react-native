import { View, Text, StyleSheet, ScrollView, RefreshControl, Dimensions, Modal } from 'react-native'
import React, { useState } from 'react'
import BlockHeader from '@/components/BlockHeader'

import OverviewHomeTask from '@/components/OverviewHomeTask'
import { useOnboardingPersisStore } from '@/store/useOnboarding'
import OverviewHomeHabit from '@/components/OverviewHomeHabit'
import TaskItem from '@/components/TaskItem'
import MainTask from '@/components/MainTask'
import OnBoarding from '@/components/OnBoarding'




const TOTAL_TASKS = 10
const COMPLETED_TASKS = 8


const TOTAL_TASKS_2 = 40
const COMPLETED_TASKS_2 = 20

const Index = () => {
  const { isFinished } = useOnboardingPersisStore()


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

      <BlockHeader isShowSubTitle={true} mainTitle="Habit Overview" subTitle="see all" isShowBoxCount={true} boxCount={TOTAL_TASKS} />
      <OverviewHomeHabit percentComplete={(COMPLETED_TASKS / TOTAL_TASKS * 100)} />
      <BlockHeader isShowSubTitle={true} mainTitle="Task Overview" subTitle="see all" isShowBoxCount={true} boxCount={8} />
      <OverviewHomeTask />
      <BlockHeader isShowSubTitle={false} mainTitle="Recent Habit" subTitle="see all" isShowBoxCount={true} boxCount={2} />
      <View style={{ flexDirection: 'column', width: '100%', height: "auto", overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 14, marginBottom: 20 }}>
        <TaskItem cardContent="Drink water" primaryColor="#FF748B" />
        <TaskItem cardContent="Go To The Gym" primaryColor="#3068DF" />
        <TaskItem cardContent="Eat More Clean" primaryColor="#6861ED" />
        <TaskItem cardContent="Doing Some Coding" primaryColor="#FF748B" />
        <TaskItem cardContent="Sleep Well Is Best Medicine" primaryColor="#FF748B" />
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