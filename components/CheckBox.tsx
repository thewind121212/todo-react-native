import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'


const CheckBox = ({
  value,
  onselect,
  label,
}: {
  value: boolean
  onselect: () => void
  label: string
}) => {
  const scaleShareValue = useSharedValue(0)

  const scaleStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scaleShareValue.value }]
    }
  })


  useEffect(() => {
    scaleShareValue.value = withSpring(value ? 1 : 0, { damping: 100, stiffness: 250 })
  }, [value])


  const onPress = useCallback(() => {
    onselect()
  }, [value, onselect])



  return (
    <Pressable style={styles.conatiner}
      onPressIn={onPress}
    >
      <Text style={[styles.label, { color: value ? 'white' : '#BBBBD4' }]}>{label}</Text>
      <View style={styles.checkBox}
      >
        <Animated.View style={[styles.checkBoxInner, scaleStyle]}></Animated.View>
      </View >
    </Pressable>
  )
}


const styles = StyleSheet.create({
  conatiner: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', gap: 8
  },
  label: {
    color: 'white', fontWeight: 'light', fontSize: 20
  },
  checkBox: {
    width: 20, height: 20, borderRadius: 5, borderWidth: 1, borderColor: 'white', backgroundColor: '#222239', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center'
  },
  checkBoxInner: {
    width: 15, height: 15, borderRadius: 3, backgroundColor: '#7068FF', position: 'absolute'
  }
})

export default React.memo(CheckBox)
