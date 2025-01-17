import { Pressable, StyleSheet, Text, View } from 'react-native'
import Button from '../Button'
import Entypo from '@expo/vector-icons/Entypo';
import React, { useEffect, useState } from 'react'
import ActionSheet, { SheetManager, SheetProps } from 'react-native-actions-sheet'
import { useSQLiteContext } from 'expo-sqlite'
import { MainTaskType } from '@/types/appTypes'



const MainTaskPicker = ({ payload }: SheetProps<'main-task-picker'>) => {

    const [allMainTasks, setAllMainTasks] = useState<MainTaskType[]>([])
    const [selectedMainTask, setSelectedMainTask] = useState<number | null>(null)
    const db = useSQLiteContext()


    useEffect(() => {
        const fetchAllMainTasks = async () => {
            const result = await db.getAllAsync<MainTaskType>(`SELECT * FROM main_tasks WHERE type = 'habit'`)
            if (result) {
                setAllMainTasks(result)
                setSelectedMainTask(result[0].id)
            }
        }

        fetchAllMainTasks()
    }, [])



    const onChoseMainTask = () => {
        if (payload?.onTaskSelect) {
            payload?.onTaskSelect(allMainTasks.filter(task => task.id === selectedMainTask)[0])
            SheetManager.hide('main-task-picker')
        }
    }

    return (
        <ActionSheet
            containerStyle={{ ...styles.actionSheetContainer }}
            closeAnimationConfig={{ stiffness: 200, damping: 100, mass: 1 }}
            keyboardHandlerEnabled={true}
        >

            <Text style={styles.title}>Chose Sub Task</Text>
            <View style={{ height: 'auto', display: "flex", flexDirection: "column", gap: 10 }}>
                {
                    allMainTasks.map((item) => (
                        <Pressable key={item.id} style={{ padding: 12, backgroundColor: selectedMainTask === item.id ? 'white' : "#BBBBD4", borderRadius: 10, width: "100%", display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", position: "relative" }}
                            onPress={() => setSelectedMainTask(item.id)}>
                            <Text>{item.title}</Text>
                            {
                                selectedMainTask === item.id && <Entypo name="check" size={24} color="#4ade80" style={{ position: 'absolute', right: 16, top: 8 }} />
                            }
                        </Pressable>
                    ))
                }
            </View>
            <View style={styles.buttonContainer}>
                <Button title="Cancel" onPressHandler={() => SheetManager.hide('main-task-picker')} isPrimary={false} />
                <Button title="Apply" onPressHandler={onChoseMainTask} />
            </View>

        </ActionSheet>
    )
}


const styles = StyleSheet.create({
    actionSheetContainer: {
        backgroundColor: "#222239",
        height: "auto",
        padding: 20,
        paddingBottom: 40,
    },
    title: {
        color: "white",
        fontSize: 24,
        textAlign: "center",
        marginBottom: 20,
        fontWeight: "bold",
    },
    buttonContainer: {
        width: "100%",
        height: "auto",
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
        paddingHorizontal: 10,
        gap: 24,
        marginTop: 30,
    },
})

export default React.memo(MainTaskPicker)
