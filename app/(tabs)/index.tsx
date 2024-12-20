import { View, Text, Modal, StyleSheet, Pressable, Dimensions } from 'react-native'
import React from 'react'
import BlockHeader from '@/components/BlockHeader'
import OnBoarding from '@/components/OnBoarding'
import { useOnboardingPersisStore } from '@/store/useOnboarding'
import CircularProgress from '@/components/CircleProgress'

// @ts-ignore
import Cry from '@/assets/emoji/crying-svgrepo-com.svg'
// @ts-ignore
import Smile from '@/assets/emoji/smiling-svgrepo-com.svg'
// @ts-ignore
import Happy from '@/assets/emoji/happy-svgrepo-com.svg'
// @ts-ignore
import Love from '@/assets/emoji/in-love-svgrepo-com.svg'

const TOTAL_TASKS = 10
const COMPLETED_TASKS = 8

const Index = () => {

  const { isFinished } = useOnboardingPersisStore()

  const {width} = Dimensions.get('window')

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


  const emojiRender = (percentComplete: number, size: number) => {
    if (percentComplete < 25) {
      return <Cry width={size} height={size} />
    } else if (percentComplete < 50) {
      return <Smile width={size} height={size} />
    } else if (percentComplete < 75) {
      return <Happy width={size} height={size} />
    } else {
      return <Love width={size} height={size} />
    }
  }


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
      <BlockHeader isShowSubTitle={false} mainTitle="OverView" subTitle="View All" />

      <View style={styles.overviewBlock}>
        <View style={{ justifyContent: 'center', alignItems: 'center', position: 'relative', aspectRatio: '1/1', width: "50%", backgroundColor: '#2C2A4A', borderRadius: 16 }}>
          <View style={{ width: "100%", justifyContent: 'center', alignItems: 'center', display: 'flex', height: "auto" }}>
            <View style={{width: 54, height: 54 , zIndex: 2}}>
              {
                emojiRender(COMPLETED_TASKS / TOTAL_TASKS * 100, 54)
              }
            </View>
            <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '20%', backgroundColor: "#fff", marginTop: -6, paddingHorizontal: 8, paddingVertical: 4, zIndex: 1 }}>
              <Text style={{ fontSize: 18, color: '#1A182C', fontWeight: 600 }}>{COMPLETED_TASKS}/{TOTAL_TASKS}</Text>
            </View>
          </View>
          <View style={{ position: 'absolute', top: 0, left: 0, flex: 1, justifyContent: 'center', alignItems: 'center', display: 'flex', width: "100%", aspectRatio: '1/1' }}>
            <CircularProgress progress={COMPLETED_TASKS / TOTAL_TASKS * 100} strokeWidth={5} size={ (width/2 * 0.8)} />
          </View>
        </View>
        <View></View>
        <View></View>
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
  overviewBlock: {
    width: '100%',
    height: 'auto',
    display: 'flex',
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20
  }
})

export default Index