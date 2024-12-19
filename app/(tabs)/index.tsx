import { View, Text, Modal } from 'react-native'
import React from 'react'
import OnBoarding from '@/components/OnBoarding'
import { useOnboardingPersisStore } from '@/store/useOnboarding'


const INIT = true

const Index = () => {

  const { isFinished } = useOnboardingPersisStore()


  return (
    <View style={{ flex: 1, backgroundColor: '#1A182C', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      {
        <Modal style={{ backgroundColor: 'rgba(0, 0, 0, 0)' }} transparent={true} visible={!isFinished}>
          <OnBoarding />
        </Modal>
      }
      <Text style={{fontSize: 30 , color: 'white'}}>index</Text>
    </View>
  )
}

export default Index