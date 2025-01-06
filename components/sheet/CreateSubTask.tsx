
import React, { useEffect, useRef, useState } from 'react';
import {
    Gesture,
    GestureDetector,
    Directions,
} from 'react-native-gesture-handler';
import { StyleSheet, View, } from 'react-native';
import ActionSheet, { ActionSheetRef, SheetManager } from 'react-native-actions-sheet';
import { useAnimatedReaction, useSharedValue, runOnJS } from 'react-native-reanimated';


const CreateSubTaskSheet = () => {
    const sheetRef = useRef<ActionSheetRef | null>(null)
    const sheetIndexShareValue = useSharedValue<number>(0)
    const mountRef = useRef<boolean>(false)


    const flingGestureUp = Gesture.Fling()
        .direction(Directions.UP)
        .onStart((e) => {
            sheetIndexShareValue.value = 1
        });



    const flingGestureDown = Gesture.Fling()
        .direction(Directions.DOWN)
        .onStart((e) => {
            sheetIndexShareValue.value = sheetIndexShareValue.value - 1
        })


    const guestureHander = () => {
        if (!mountRef.current) {
            mountRef.current = true
            return
        }
        if (sheetIndexShareValue.value === -1 && sheetRef) {
            sheetRef.current?.hide()
        }

        if (sheetRef) {
            sheetRef.current?.snapToIndex(sheetIndexShareValue.value)
            return
        }


    }



    useAnimatedReaction(() => sheetIndexShareValue, (currentvalue) => {
        runOnJS(guestureHander)()
    })

    const flingGesture = Gesture.Exclusive(flingGestureUp, flingGestureDown)


    return (
        <ActionSheet containerStyle={styles.sheetContainer}
            snapPoints={[60, 110]}
            initialSnapIndex={0}
            ref={sheetRef}
        >
            <GestureDetector gesture={flingGesture} >

                <View style={{ width: "100%", height: "100%" }}></View>
            </GestureDetector>


        </ActionSheet>
    );
};




export default CreateSubTaskSheet;

const styles = StyleSheet.create({
    sheetContainer: {
        backgroundColor: '#222239',
        height: "100%",
    },
});
