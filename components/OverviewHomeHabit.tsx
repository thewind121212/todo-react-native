import { Dimensions, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import CircularProgress from '@/components/CircleProgress'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

// @ts-ignore
import Cry from '@/assets/emoji/crying-svgrepo-com.svg'
// @ts-ignore
import Smile from '@/assets/emoji/smiling-svgrepo-com.svg'
// @ts-ignore
import Happy from '@/assets/emoji/happy-svgrepo-com.svg'
// @ts-ignore
import Love from '@/assets/emoji/in-love-svgrepo-com.svg'
import { FlipInEasyX } from 'react-native-reanimated';

const TOTAL_TASKS = 10
const COMPLETED_TASKS = 8


const OverviewHomeHabit = ({ percentComplete }: { percentComplete: number }) => {

    const { width } = Dimensions.get('window')

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
        <View style={styles.overviewBlock}>
            <View style={{ justifyContent: 'center', alignItems: 'center', position: 'relative', aspectRatio: '1/1', width: (width * 1 / 2 - 20) - 6, backgroundColor: '#222239', borderRadius: 16, maxWidth: "100%" }}>
                <View style={{ width: "100%", justifyContent: 'center', alignItems: 'center', display: 'flex', height: "auto" }}>
                    <View style={{ width: 54, height: 54, zIndex: 2 }}>
                        {
                            emojiRender(percentComplete, 54)
                        }
                    </View>
                    <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '20%', backgroundColor: "#fff", marginTop: -6, paddingHorizontal: 8, paddingVertical: 4, zIndex: 1 }}>
                        <Text style={{ fontSize: 18, color: '#1A182C', fontWeight: 600 }}>{COMPLETED_TASKS}/{TOTAL_TASKS}</Text>
                    </View>
                </View>
                <View style={{ position: 'absolute', top: 0, left: 0, flex: 1, justifyContent: 'center', alignItems: 'center', display: 'flex', width: "100%", aspectRatio: '1/1' }}>
                    <CircularProgress progress={percentComplete} strokeWidth={7} strokeWidthFull={7} size={(160)} rotate='-90' color='#6861ED' />

                </View>
            </View>

            <View style={{ justifyContent: 'space-between', alignItems: 'center', aspectRatio: '1/1', width: (width * 1 / 2 - 20) - 6, borderRadius: 16, overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 12, }}>
                <View style={ { width: "100%", height: ((width * 1 / 2 - 20) - 6) / 2 - 6, backgroundColor: "#222239", borderRadius: 16, display: 'flex', justifyContent: "flex-start", flexDirection: 'row', alignItems: "center", paddingLeft: 16 }} >
                    <MaterialCommunityIcons name="progress-check" size={32} color="#fff" />
                    <Text style={{ color: "#fff", fontSize: 18, fontWeight: 600, marginLeft: 8 }}>{COMPLETED_TASKS} Done</Text>
                </View>
                <View style={ { width: "100%", height: ((width * 1 / 2 - 20) - 6) / 2 - 6, backgroundColor: "#222239", borderRadius: 16, display: 'flex', justifyContent: "flex-start", flexDirection: 'row', alignItems: "center", paddingLeft: 16 }} >
                    <MaterialCommunityIcons name="progress-clock" size={32} color="#fff" />
                    <Text style={{ color: "#fff", fontSize: 18, fontWeight: 600, marginLeft: 8 }}>{TOTAL_TASKS - COMPLETED_TASKS} </Text>
                </View>
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    overviewBlock: {
        width: '100%',
        height: 'auto',
        display: 'flex',
        flexDirection: 'row',
        gap: 12,
        marginBottom: 20
    }
})


export default OverviewHomeHabit