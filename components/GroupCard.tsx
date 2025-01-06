import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React, { useEffect, memo } from 'react'
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { getGradientColor } from './MainTask';
import { MainTaskType } from '@/types/appTypes';
import ContextMenu from "react-native-context-menu-view";
import { useRouter } from 'expo-router';
import { SheetManager } from 'react-native-actions-sheet';




interface Props {
    mainTaskItem: MainTaskType
    editMainTaskHander: (task: MainTaskType) => void
    deleteMainTaskHander: (taskId: string) => void
}


const GroupCard = memo(({ mainTaskItem, deleteMainTaskHander, editMainTaskHander }: Props) => {



    const { title, color, remainTimePercent, type } = mainTaskItem


    const isRenderProgress = true
    const { width } = Dimensions.get('window')


    const translateX = useSharedValue<any>("100%")

    const translateYstyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: translateX.value }],
            easing: Easing.inOut(Easing.ease),
        };
    })


    useEffect(() => {
        translateX.value = withRepeat(
            withSequence(
                withTiming("0", { duration: 1500 }),
                withDelay(300, withTiming("0", { duration: 0 })),
            ),
            -1,
        )
    }, [])

    return (

        <ContextMenu
            actions={[
                { title: "Edit", systemIcon: "pencil.tip", iconColor: '#1E1E1E' },
                { title: "Delete", systemIcon: "trash", destructive: true }]}
            style={{ overflow: 'hidden', borderRadius: 6 }}
            onPress={(e) => {
                if (e.nativeEvent.index === 1) {
                    deleteMainTaskHander(mainTaskItem.id.toString())
                }
                if (e.nativeEvent.index === 0) {
                    editMainTaskHander(mainTaskItem)
                }
            }}
        >
            <Pressable style={{ width: "100%", height: "auto" }}
                onPress={() => {SheetManager.show('create-sub-task')}}
            >
                <View style={styles.mainGroupTaskCard}>
                    <View style={{ display: "flex", flexDirection: "row", gap: 8, alignItems: "center" }}>
                        <View style={{ width: 32, height: 32, position: "relative", backgroundColor: "#7068FF", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRadius: 6 }}>
                            <View style={{ width: 24, height: 24, position: "absolute", display: "flex", justifyContent: "center", alignItems: "center", opacity: type === "habit" ? 1 : 0 }}>
                                <MaterialIcons name="autorenew" size={24} color="white" />
                            </View>
                            <View style={{ width: 24, height: 24, position: "absolute", display: "flex", justifyContent: "center", alignItems: "center", opacity: type === "task" ? 1 : 0 }}>
                                <MaterialIcons name="checklist" size={24} color="white" />
                            </View>
                        </View>
                        <Text style={{ color: "#FFFFFF", fontSize: 18, fontWeight: "600" }}>{title}</Text>
                    </View>
                    <View style={{ width: 30, height: 30, backgroundColor: color, borderRadius: 61, display: "flex", justifyContent: "center", alignContent: "center" }}>
                    </View>

                    {
                        isRenderProgress && (
                            <View style={{ width: (width - 40) * (remainTimePercent / 100), height: 4, position: "absolute", left: 0, bottom: 0, overflow: 'hidden', borderRadius: 2 }}>
                                <View style={{ width: '100%', height: 4, position: "relative", overflow: 'hidden' }}>
                                    <LinearGradient
                                        colors={[...getGradientColor(remainTimePercent)] as [string, string, ...string[]]}
                                        start={{ x: -1, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                        style={{ width: '100%', height: 4 }}
                                    />
                                    <Animated.View style={[{ width: '100%', height: 4, position: 'absolute', top: 0, left: 0 }, translateYstyle]}>
                                        <LinearGradient
                                            colors={[...getGradientColor(remainTimePercent)] as [string, string, ...string[]]}
                                            start={{ x: -1, y: 0 }}
                                            end={{ x: 1, y: 0 }}
                                            style={{ width: '100%', height: 4 }}
                                        />
                                    </Animated.View>

                                </View>
                            </View>
                        )
                    }
                </View>
            </Pressable>
        </ContextMenu>
    )
},)

export default GroupCard

const styles = StyleSheet.create({
    mainGroupTaskCard: {
        width: '100%',
        paddingVertical: 18,
        backgroundColor: '#222239',
        borderRadius: 8,
        paddingRight: 20,
        paddingLeft: 24,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        position: "relative",
        overflow: 'hidden'

    }

})