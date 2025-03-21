import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import CircularProgress from '@/components/CircleProgress'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Link } from 'expo-router'

// @ts-ignore
import Cry from '@/assets/emoji/crying-svgrepo-com.svg'
// @ts-ignore
import Smile from '@/assets/emoji/smiling-svgrepo-com.svg'
// @ts-ignore
import Happy from '@/assets/emoji/happy-svgrepo-com.svg'
// @ts-ignore
import Love from '@/assets/emoji/in-love-svgrepo-com.svg'
import { Skeleton } from 'moti/skeleton';



const OverviewHomeHabit = React.memo(({ doneTask, allTasks }: { doneTask: number, allTasks: number }) => {

    const { width } = Dimensions.get('window')

    const percentComplete = allTasks === 0 ? 0 : Math.round((doneTask / allTasks) * 100)

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
            <Link
            href={'/(tabs)/allHabit?status=all'}
            >
                <View style={[styles.overviewLeftBlock, { width: (width * 1 / 2 - 20) - 6, height : (width * 1 / 2 - 20) - 6 }]}>
                    <View style={styles.overviewLeftBlockWrapper}>
                        <View style={styles.emojiBlock}>
                            {
                                emojiRender(allTasks === 0 ? 100 : percentComplete, 54)
                            }
                        </View>
                        <View style={styles.taskRatio}>
                            <Text style={styles.taskRatioTitle}>{doneTask}/{allTasks}</Text>
                        </View>
                    </View>
                    <View style={styles.cirlcleProgress}>
                        <CircularProgress progress={allTasks === 0 ? 100 : percentComplete} strokeWidth={7} strokeWidthFull={7} size={(160)} rotate='-90' color='#6861ED' />

                    </View>
                </View>
            </Link>
            <View style={[styles.overviewRightBlock, { width: (width * 1 / 2 - 20) - 6 }]}>
                <Link
                    href={'/(tabs)/allHabit?status=completed'}
                >
                    <View style={[styles.overViewRightBlockWrapper, { height: ((width * 1 / 2 - 20) - 6) / 2 - 6 }]}
                    >
                        <MaterialCommunityIcons name="progress-check" size={32} color="#fff" />
                        <Text style={styles.rightBlockTitle}>{doneTask} Done</Text>
                    </View>
                </Link>

                <Link
                    href={'/(tabs)/allHabit?status=uncompleted'}
                >
                    <View style={[styles.overViewRightBlockWrapper, { height: ((width * 1 / 2 - 20) - 6) / 2 - 6 }]} >
                        <MaterialCommunityIcons name="progress-clock" size={32} color="#fff" />
                        <Text style={styles.rightBlockTitle}>{allTasks - doneTask} </Text>
                    </View>
                </Link>
            </View>
        </View >
    )
})



export const OverviewHabitPlaceHolder = React.memo(() => {
    const { width } = Dimensions.get('window')

    return (
        <Skeleton.Group show={true}>
            <View style={styles.skeletonContainer}>
                <View style={[styles.skeletonBlock, { width: (width * 1 / 2 - 20) - 6 }]}>
                    <Skeleton colorMode={'dark'} width={"100%"} height={"100%"} colors={["#222239", "#2c2c49"]} />
                </View>
                <View style={[styles.SkeletonBlock2, { width: (width * 1 / 2 - 20) - 6, }]}>
                    <Skeleton colorMode={'dark'} width={"100%"} height={((width * 1 / 2 - 20) - 6) / 2 - 6} radius={16} colors={["#222239", "#2c2c49"]} />
                    <Skeleton colorMode={'dark'} width={"100%"} height={((width * 1 / 2 - 20) - 6) / 2 - 6} radius={16} colors={["#222239", "#2c2c49"]} />
                </View>
            </View>
        </Skeleton.Group>
    )
})

const styles = StyleSheet.create({
    overviewBlock: {
        width: '100%',
        height: 'auto',
        display: 'flex',
        flexDirection: 'row',
        gap: 12,
        marginBottom: 20
    },
    overviewLeftBlock: {
        justifyContent: 'center', alignItems: 'center', position: 'relative', aspectRatio: '1/1', backgroundColor: '#222239', borderRadius: 16, maxWidth: "100%"
    },
    overviewRightBlock:
    {
        justifyContent: 'space-between', alignItems: 'center', aspectRatio: '1/1', borderRadius: 16, overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 12,
    },
    overViewRightBlockWrapper: {
        width: "100%", backgroundColor: "#222239", borderRadius: 16, display: 'flex', justifyContent: "flex-start", flexDirection: 'row', alignItems: "center", paddingLeft: 16
    },
    overviewLeftBlockWrapper:
    {
        width: "100%", justifyContent: 'center', alignItems: 'center', display: 'flex', height: "auto"
    },
    emojiBlock: {
        width: 54, height: 54, zIndex: 2
    },
    taskRatio: {
        display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '20%', backgroundColor: "#fff", marginTop: -6, paddingHorizontal: 8, paddingVertical: 4, zIndex: 1
    },
    cirlcleProgress: {
        position: 'absolute', top: 0, left: 0, flex: 1, justifyContent: 'center', alignItems: 'center', display: 'flex', width: "100%", aspectRatio: '1/1'
    },
    taskRatioTitle: {
        fontSize: 18, color: '#1A182C', fontWeight: 600
    },
    skeletonContainer: {
        width: '100%', height: 'auto', display: 'flex', flexDirection: 'row', gap: 12, marginBottom: 20
    },
    skeletonBlock: {
        justifyContent: 'center', alignItems: 'center', position: 'relative', aspectRatio: '1/1', borderRadius: 16, maxWidth: "100%"
    },
    SkeletonBlock2: {
        justifyContent: 'space-between', alignItems: 'center', aspectRatio: '1/1', borderRadius: 16, overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 12,
    },
    rightBlockTitle: {
        color: "#fff", fontSize: 18, fontWeight: 600, marginLeft: 8
    }
})


export default OverviewHomeHabit