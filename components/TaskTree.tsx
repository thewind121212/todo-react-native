import { StyleSheet, View } from 'react-native';
import React, { useMemo } from 'react';
import MainTask from './MainTask';
import TaskItem from './TaskItem';
import { TaskItemQueryType } from '@/types/appTypes';
import { Skeleton } from 'moti/skeleton';

interface Props {
    mainTaskName: string;
    taskCreatDay: string;
    mainTaskId: string;
    dueDate: string;
    color: string;
    data: TaskItemQueryType[];
}

const TaskTree = ({
    mainTaskName,
    taskCreatDay,
    dueDate,
    color,
    data
}: Props) => {

    const [dataTasks, setDataTasks] = React.useState<TaskItemQueryType[]>(data);

    const overAllPercent = useMemo(() => {
        const completedTasks = dataTasks.filter((item) => item.completed).length;
        const totalTasks = dataTasks.length;
        return (completedTasks / totalTasks) * 100;
    }, [dataTasks]);

    const remainTimePercent = useMemo(() => {
        const [year, month, day] = dueDate.split('-').map(Number);
        const dueDayTimeStamp = new Date(year, month - 1, day).getTime();
        const createDayTimeStamp = new Date(taskCreatDay).getTime();
        const today = new Date().getTime();

        return ((dueDayTimeStamp - today) / (dueDayTimeStamp - createDayTimeStamp)) * 100;
    }, [dataTasks, dueDate, taskCreatDay]);

    const setDoneOutFunc = (id: number) => {
        const newData: TaskItemQueryType[] = dataTasks.map((item) => {
            if (item.id === id) {
                return {
                    ...item,
                    completed: item.completed === 1 ? 0 : 1
                };
            }
            return item;
        });
        setDataTasks(newData);
    };

    return (
        <View style={styles.container}>
            <MainTask
                mainTaskName={mainTaskName}
                overAllPercent={overAllPercent}
                remainTimePercent={remainTimePercent}
                primaryColor={color}
            />
            <View style={[styles.tasksContainer, { marginTop: 12 }]}>
                <View style={[styles.verticalLineContainer, { backgroundColor: color }]}>
                    <View style={[styles.circle, { backgroundColor: color, top: 0 }]} />
                    <View style={[styles.circle, { backgroundColor: color, bottom: 0 }]} />
                </View>
                <View style={[styles.tasksList, { paddingLeft: 10 }]}>
                    {dataTasks.map((item) => (
                        <TaskItem
                            key={item.id}
                            cardContent={item.title}
                            primaryColor={color}
                            isDoneProps={item.completed === 1}
                            taskItemId={item.id}
                            isUseSetDoneLocal={false}
                            setDoneOutFunc={setDoneOutFunc}
                        />
                    ))}
                </View>
            </View>
        </View>
    );
};

export function TaskTreePlaceHolder() {
    return (
        <Skeleton.Group show={true}>
            <Skeleton
                colorMode={'dark'}
                width={'100%'}
                height={85.7}
                colors={["#222239", "#2c2c49"]}
                radius={16}
            />
            <View style={styles.placeholderTasksContainer}>
                <View style={styles.placeholderVerticalLine}>
                    <Skeleton
                        colorMode={'dark'}
                        width={2}
                        height={314}
                        colors={["#222239", "#2c2c49"]}
                    />
                    <View style={styles.placeholderCircle}>
                        <Skeleton
                            colorMode={'dark'}
                            width={18}
                            height={18}
                            radius={"round"}
                            colors={["#222239", "#2c2c49"]}
                        />
                    </View>
                    <View style={styles.placeholderCircle}>
                        <Skeleton
                            colorMode={'dark'}
                            width={18}
                            height={18}
                            radius={"round"}
                            colors={["#222239", "#2c2c49"]}
                        />
                    </View>
                </View>
                <View style={styles.placeholderTasksList}>
                    {[...Array(4).keys()].map((_, index) => (
                        <Skeleton
                            key={index + "taskTree1"}
                            colorMode={'dark'}
                            width={'100%'}
                            height={68}
                            colors={["#222239", "#2c2c49"]}
                        />
                    ))}
                </View>
            </View>
        </Skeleton.Group>
    );
}

export default TaskTree;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        height: "auto",
        marginBottom: 20
    },
    tasksContainer: {
        flexDirection: 'row',
        width: '100%',
        height: "auto",
        overflow: 'hidden',
        justifyContent: "flex-end"
    },
    verticalLineContainer: {
        width: 2,
        height: "100%",
        backgroundColor: '#222239',
        borderRadius: 20,
        position: 'relative'
    },
    circle: {
        width: 18,
        height: 18,
        borderRadius: 9,
        position: "absolute",
        left: -8
    },
    tasksList: {
        flexDirection: 'column',
        width: '95%',
        height: "auto",
        overflow: 'hidden',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        gap: 14
    },
    placeholderTasksContainer: {
        flexDirection: 'row',
        width: '100%',
        height: "auto",
        overflow: 'hidden',
        marginTop: 10,
        justifyContent: "flex-end"
    },
    placeholderVerticalLine: {
        width: 2,
        height: 314,
        borderRadius: 20,
        position: 'relative',
        backgroundColor: '#222239'
    },
    placeholderCircle: {
        width: 18,
        height: 18,
        borderRadius: 9,
        position: "absolute",
        left: -8
    },
    placeholderTasksList: {
        flexDirection: 'column',
        width: '95%',
        height: 314,
        overflow: 'hidden',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        gap: 14,
        paddingLeft: 10
    }
});
