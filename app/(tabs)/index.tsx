import { View, Text, StyleSheet, ScrollView, RefreshControl, Dimensions } from 'react-native'
import React, { useState } from 'react'
import BlockHeader from '@/components/BlockHeader'

import OverviewHomeTask from '@/components/OverviewHomeTask'
import { useOnboardingPersisStore } from '@/store/useOnboarding'
import OverviewHomeHabit from '@/components/OverviewHomeHabit'
import HabitItem from '@/components/HabitItem'
import CircularProgress from '@/components/CircleProgress'



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

  const { width } = Dimensions.get('window');



  return (
    <ScrollView style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* {
        <Modal style={{ backgroundColor: 'rgba(0, 0, 0, 0)' }} transparent={true} visible={!isFinished}>
          <OnBoarding />
        </Modal>
      } */}

      <View style={styles.helloBlock}>
        <Text style={{ fontSize: 32, color: '#fff', fontWeight: 300 }}>
          <Text style={{ color: "#FF748B" }} >{getGreeting()} </Text>
          <Text style={{ fontWeight: 600 }}>LinhTran</Text></Text>
      </View>

      <BlockHeader isShowSubTitle={true} mainTitle="Habit Overview" subTitle="see all" isShowBoxCount={true} boxCount={TOTAL_TASKS} />
      <OverviewHomeHabit percentComplete={(COMPLETED_TASKS / TOTAL_TASKS * 100)} />
      <BlockHeader isShowSubTitle={true} mainTitle="Task Overview" subTitle="see all" isShowBoxCount={true} boxCount={8} />
      <OverviewHomeTask />
      <BlockHeader isShowSubTitle={false} mainTitle="In Progress Habit" subTitle="see all" isShowBoxCount={true} boxCount={2} />
      <View style={{ flexDirection: 'column', width: '100%', height: 300, overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 14, marginBottom: 20 }}>

        <HabitItem cardContent="Drink water" primaryColor="#FF748B" />
        <HabitItem cardContent="Go To The Gym" primaryColor="#3068DF" />
        <HabitItem cardContent="Eat More Clean" primaryColor="#6861ED" />
        <HabitItem cardContent="Doing Some Coding" primaryColor="#FF748B" />
        <HabitItem cardContent="Sleep Well Is Best Medicine" primaryColor="#FF748B" />
      </View>

      <BlockHeader isShowSubTitle={true} mainTitle="In Progress Task" subTitle="see all" isShowBoxCount={true} boxCount={2} />

      <View style={{ flexDirection: 'column', width: '100%', height: 300, overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 14, marginBottom: 20 }}>

        <View style={{ width: '100%', paddingVertical: 32, backgroundColor: '#222239', borderRadius: 8, paddingRight: 20, paddingLeft: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', position: "relative", overflow: 'hidden' }}>
          <Text style={{ color: "#FFFFFF", fontSize: 18, fontWeight: "400" }}>Learning 3D modal in cinema 4D</Text>
          <View style={[{ position: 'absolute', right: 20 }]} >
            <View style={{ position: "relative", display: "flex", justifyContent: "center", alignItems: "center" }}>
              <CircularProgress progress={40} strokeWidth={8} strokeWidthFull={4} size={60} rotate='-90' color='#6861ED' animationDirection='clockwise' />
              <Text style={{ position: "absolute", color: "white", fontWeight: 600, fontSize: 14 }}>40%</Text>
            </View>
          </View>
          <View style={{ width: (width - 40), height: 3, position: "absolute", left: 0, bottom: 0, borderRadius: 4, overflow: 'hidden' ,backgroundColor: "#6861ED" }}></View>
        </View>
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