import { StyleSheet, Text, View, Modal, ScrollView, RefreshControl } from 'react-native'
import React, { useState } from 'react'
import OnBoarding from '@/components/OnBoarding'
import { useOnboardingPersisStore } from '@/store/useOnboarding'


const modal = () => {

  const { isFinished } = useOnboardingPersisStore()

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = () => {
    setRefreshing(true);

    // Simulate a network request or data refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 2000); // 2 seconds delay
  };


  return (
    <View style={{ flex: 1, backgroundColor: '#1A182C', display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
      <ScrollView style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >

      </ScrollView>
    </View>
  )
}

export default modal

const styles = StyleSheet.create({
  container: {

  }
})