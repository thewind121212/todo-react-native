import { View, Text, Modal, StyleSheet, Pressable, Dimensions } from 'react-native'
import React from 'react'
import BlockHeader from '@/components/BlockHeader'
import OnBoarding from '@/components/OnBoarding'
import { useOnboardingPersisStore } from '@/store/useOnboarding'
import OverviewHome from '@/components/OverviewHome'

const TOTAL_TASKS = 10
const COMPLETED_TASKS = 8


const TOTAL_TASKS_2 = 40
const COMPLETED_TASKS_2 = 20

const Index = () => {

  const { isFinished } = useOnboardingPersisStore()


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
    <View style={styles.container}>
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

      <BlockHeader isShowSubTitle={false} mainTitle="Habit Overview" subTitle="View All" isShowBoxCount={true} boxCount={TOTAL_TASKS} />
      <OverviewHome percentComplete={(COMPLETED_TASKS/TOTAL_TASKS * 100)} />
      <BlockHeader isShowSubTitle={false} mainTitle="Task Overview" subTitle="View All" isShowBoxCount={true} boxCount={TOTAL_TASKS} />
      <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%', aspectRatio: '2/1' , flexWrap: 'wrap', gap: 12, backgroundColor: 'white', borderRadius: 16, }}>

      </View>


    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A182C',
    display: 'flex',
    justifyContent: 'flex-start',
    padding: 20,
    alignItems: 'center'
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