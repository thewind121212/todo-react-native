import { StyleSheet, View } from 'react-native'
import React, { useMemo } from 'react'
import MainTask from './MainTask'
import TaskItem from './TaskItem'
import { TaskItemQueryType } from '@/types/appTypes';
import { Skeleton } from 'moti/skeleton';


interface Props {
    mainTaskName: string
    taskCreatDay: string
    mainTaskId: string
    dueDate: string
    color: string,
    data: TaskItemQueryType[]
}

const TaskTree = ({
    mainTaskName,
    taskCreatDay,
    dueDate,
    color,
    data
}: Props) => {

    const [dataTasks, setDataTasks] = React.useState<TaskItemQueryType[]>(data)

    const overAllPercent = useMemo(() => {
        const completedTasks = dataTasks.filter((item) => item.completed).length
        const totalTasks = dataTasks.length
        return (completedTasks / totalTasks) * 100
    }, [dataTasks])


    const remainTimePercent = useMemo(() => {

        const dueDayTimeStamp = new Date(dueDate)
        const createDayTimeStamp = new Date(taskCreatDay)
        const today = new Date()

        return 100 - (today.getTime() - createDayTimeStamp.getTime()) / (dueDayTimeStamp.getTime() - createDayTimeStamp.getTime()) * 100

    }, [dataTasks])


    const setDoneOutFunc = (id: number) => {
        const newData: TaskItemQueryType[] = dataTasks.map((item) => {
            if (item.id === id) {
                return {
                    ...item,
                    completed: item.completed === 1 ? 0 : 1
                }
            }
            return item
        })
        setDataTasks(newData)
    }

    return (
        <View style={{ flex: 1, width: "100%", height: "auto", marginBottom: 20 }}>
            <MainTask mainTaskName={mainTaskName} overAllPercent={overAllPercent} remainTimePercent={remainTimePercent} primaryColor={color} />
            <View style={{ flexDirection: 'row', width: '100%', height: "auto", overflow: 'hidden', marginTop: 12, justifyContent: "flex-end" }}>
                <View style={{ width: 2, height: "100%", backgroundColor: color, borderRadius: 20, position: 'relative' }}>
                    <View style={{ width: 18, height: 18, borderRadius: "50%", backgroundColor: color, position: "absolute", top: 0, left: -8 }}></View>
                    <View style={{ width: 18, height: 18, borderRadius: "50%", backgroundColor: color, position: "absolute", bottom: 0, left: -8 }}></View>
                </View>
                <View style={{ flexDirection: 'column', width: '95%', height: "auto", overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 14, paddingLeft: 10 }}>
                    {
                        dataTasks.map((item) =>
                            <TaskItem key={item.id} cardContent={item.title} primaryColor={color} isDoneProps={item.completed === 1 ? true : false} taskItemId={item.id} isUseSetDoneLocal={false}
                                setDoneOutFunc={setDoneOutFunc} />
                        )
                    }
                </View>
            </View>

        </View>
    )
}



export function TaskTreePlaceHolder() {
    return (
        <Skeleton.Group show={true}>

            <Skeleton colorMode={'dark'} width={'100%'} height={85.7} colors={["#222239", "#2c2c49"]} />
            <View style={{ flexDirection: 'row', width: '100%', height: "auto", overflow: 'hidden', marginTop: 10, justifyContent: "flex-end" }}>
                <View style={{ width: 2, height: 314, borderRadius: 20, position: 'relative' }}>
                    <Skeleton colorMode={'dark'} width={2} height={314} colors={["#222239", "#2c2c49"]} />
                    <View style={{ width: 18, height: 18, borderRadius: "50%", position: "absolute", top: 0, left: -8 }}>
                        <Skeleton colorMode={'dark'} width={18} height={18} radius={"round"} colors={["#222239", "#2c2c49"]} />
                    </View>
                    <View style={{ width: 18, height: 18, borderRadius: "50%", position: "absolute", bottom: 0, left: -8 }}>
                        <Skeleton colorMode={'dark'} width={18} height={18} radius={"round"} colors={["#222239", "#2c2c49"]} />
                    </View>
                </View>
                <View style={{ flexDirection: 'column', width: '95%', height: 314, overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 14, paddingLeft: 10 }}>
                    <>
                        {[...Array(4).keys()].map((_, index) => (
                            <Skeleton key={index + "taskTree1"} colorMode={'dark'} width={'100%'} height={68} colors={["#222239", "#2c2c49"]} />
                        ))}
                    </>
                </View>
            </View>
        </Skeleton.Group>
    )
}

export default TaskTree

const styles = StyleSheet.create({})
