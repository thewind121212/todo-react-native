import { ColorValue, Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import CircularProgress from './CircleProgress'
import { TaskItemNotHabitType } from '@/types/appTypes'
import { Skeleton } from 'moti/skeleton'
import useLocalNotification from '../hooks/useNotification'


const OverviewHomeTask = ({
    tasks,
    fullPercent,
    taskRandom
}: {
    tasks: TaskItemNotHabitType[],
    fullPercent: number,
    taskRandom: Array<TaskItemNotHabitType & { completePercent: number }>
}) => {

    const { handleScheduleNotification } = useLocalNotification()

    return (
        <View style={styles.container}>
            <View style={styles.leftContainer}>
                <View style={styles.circularProgressContainer}>
                    <CircularProgress
                        progress={tasks.length > 0 ? fullPercent / tasks.length : 0}
                        strokeWidth={12}
                        strokeWidthFull={6}
                        size={160}
                        animationDirection="clockwise"
                        rotate="-90"
                        color="#3068DF"
                    />
                </View>
                {taskRandom.length > 0 &&
                    taskRandom.map((task, index) => {
                        let size;
                        if (index === 0) {
                            size = 120;
                        } else {
                            size = 80;
                        }
                        return (
                            <View
                                key={`${task.id}taskOverView`}
                                style={styles.circularProgressContainer}
                            >
                                <CircularProgress
                                    progress={task.completePercent}
                                    strokeWidth={12}
                                    strokeWidthFull={6}
                                    size={size}
                                    animationDirection="clockwise"
                                    rotate="-90"
                                    color={task.primary_color}
                                />
                            </View>
                        )
                    })}
            </View>
            <View style={styles.rightContainer}>
                <View
                    style={[
                        styles.taskInfoWrapper,
                        { justifyContent: tasks.length > 0 ? 'center' : 'flex-start' }
                    ]}
                >

                    <TaskInfoRight
                        percent={fullPercent / tasks.length}
                        content="All task"
                        color="#3068DF"
                    />
                    {taskRandom[0] && (
                        <TaskInfoRight
                            percent={taskRandom[0].completePercent}
                            content={taskRandom[0].title}
                            color={taskRandom[0].primary_color}
                        />
                    )}
                    {taskRandom[1] && (
                        <TaskInfoRight
                            percent={taskRandom[1].completePercent}
                            content={taskRandom[1].title}
                            color={taskRandom[1].primary_color}
                        />
                    )}
                </View>
            </View>
        </View>
    )
}

export default OverviewHomeTask

function TaskInfoRight({
    percent,
    content,
    color
}: {
    percent: number,
    content: string,
    color: ColorValue
}) {
    return (
        <View style={styles.taskInfoRightContainer}>
            <View style={[styles.colorIndicator, { backgroundColor: color }]} />
            <Text style={styles.taskInfoText}>{content}</Text>
        </View>
    )
}

export function OverviewHomeTaskPlaceHolder() {
    return (
        <Skeleton.Group show={true}>
            <Skeleton
                colorMode={'dark'}
                width="100%"
                height={200}
                radius={16}
                colors={['#222239', '#2c2c49']}
            />
            <View style={styles.placeholderMargin} />
        </Skeleton.Group>
    )
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        aspectRatio: 2 / 1,
        gap: 12,
        backgroundColor: '#222239',
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 20
    },
    leftContainer: {
        width: '50%',
        height: '100%',
        position: 'relative'
    },
    circularProgressContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
        width: '100%',
        height: '100%'
    },
    rightContainer: {
        width: '50%',
        height: '100%',
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#222239'
    },
    taskInfoWrapper: {
        width: '100%',
        height: 160,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 12
    },
    taskInfoRightContainer: {
        width: '100%',
        height: 'auto',
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'row',
        gap: 12,
        paddingRight: 30
    },
    colorIndicator: {
        width: 16,
        height: 16,
        borderRadius: "50%"
    },
    taskInfoText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: '600',
        paddingRight: 20
    },
    placeholderMargin: {
        marginBottom: 20
    }
})
