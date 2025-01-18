
import { View, Text, StyleSheet, TextInput as RNTextInput, Pressable } from "react-native";
import ActionSheet, { SheetManager, SheetProps } from "react-native-actions-sheet";
import { useState, useCallback, useRef } from "react";

import Button from "../Button";
import React from 'react';
import { useSQLiteContext } from "expo-sqlite";
import { MainTaskType, TaskItemQueryType } from "@/types/appTypes";
import { SHEET_TOOGE_ANIMATION } from "@/config/animation";
import { useSubTaskContext } from "@/store/contextViewSub";


const DEFAULT_MAIN_TASK: TaskItemQueryType = {
    id: 0,
    title: '',
    completed: 0,
    priority: 0,
    main_task_id: 0,
    mainTaskId: 0,
    main_task_title: '',
    primary_color: '',
    dueDate: '',
    createDate: '' as Date & string, updateDate: '' as Date & string,
    main_task_type: 'habit',
}


function CreateSubTask({ payload }: SheetProps<"create-sub-task">) {

    const [subTask, setSubTask] = useState<{
        name: string
        mainTaskName: string
        mainTaskId: number | null
        primaryColor: string | null
    }>({
        name: payload?.type === 'edit' && payload?.title ? payload.title : "",
        mainTaskName: "",
        mainTaskId: payload?.mainTaskId ?? null,
        primaryColor: payload?.color ?? null
    })
    const inputRef = useRef<RNTextInput>(null);
    const [isSheetDirty, setIsSheetDirty] = useState<boolean>(false);
    const db = useSQLiteContext();

    const { editTasks, setTasks, tasks, loading } = useSubTaskContext();

    const handerCreateSubTask = useCallback(async () => {
        setIsSheetDirty(true);
        try {
            if (payload?.type === 'edit' && payload?.subTaskId && subTask.name) {
                // Edit Sub Task
                await db.runAsync(
                    `UPDATE tasks SET title = ? WHERE id = ?`,
                    subTask.name,
                    payload.subTaskId
                );
                payload.editOuterFunc ? payload.editOuterFunc(payload.subTaskId, subTask.name) :
                    editTasks(payload.subTaskId, subTask.name)
                SheetManager.hide('create-sub-task');

            }
            if (payload?.type !== 'edit' && subTask.name && subTask.primaryColor && subTask.mainTaskId) {
                // Create Sub Task
                const result = await db.runAsync(
                    `INSERT INTO tasks (title, completed, priority, main_task_id ) VALUES (?, ?, ?, ?)`,
                    subTask.name,
                    0,
                    0,
                    subTask.mainTaskId
                );
                const newSubTask: TaskItemQueryType[] = [{
                    ...DEFAULT_MAIN_TASK,
                    id: result.lastInsertRowId,
                    primary_color: subTask.primaryColor,
                    priority: 0,
                    title: subTask.name,
                    completed: 0,
                }, ...tasks]
                setTasks(newSubTask, loading)
                SheetManager.hide('create-sub-task');
            }
        } catch (error) {
            console.log(error);
        }

    }, [db, payload, subTask.name, subTask.mainTaskId, subTask.mainTaskName, subTask.primaryColor, tasks, loading, editTasks, setTasks]);


    const onChoseMainTask = useCallback((mainTask: MainTaskType) => {
        {
            setSubTask({
                ...subTask,
                mainTaskId: mainTask.id,
                mainTaskName: mainTask.title,
                primaryColor: mainTask.color
            })
        }
    }, [subTask, setSubTask])


    return (
        <ActionSheet
            containerStyle={styles.actionSheetContainer}
            keyboardHandlerEnabled={true}
        >
            <View style={styles.container}>
                <Text style={styles.title}>{payload?.type === 'edit' ? "Edit" : "Create"} Sub Task</Text>

                <RNTextInput
                    style={[styles.input, { borderBottomColor: (isSheetDirty && subTask.name.length === 0) ? "#F67280" : (subTask.primaryColor) ? subTask.primaryColor ?? '"#7068FF"' : "#BBBBD4" }]}
                    placeholder={'Sub Task'}
                    keyboardType="default"
                    ref={inputRef}
                    value={subTask.name}
                    onChangeText={(val) => setSubTask({ ...subTask, name: val })}
                    placeholderTextColor={isSheetDirty && subTask.name.length === 0 ? "#F67280" : '#BBBBD4'}
                />
                {
                    payload?.type === 'create-from-tab' && (
                        <Pressable
                            style={[styles.wrapper, { borderColor: (isSheetDirty && !subTask.mainTaskId) ? "#F67280" : subTask.mainTaskId ? subTask.primaryColor! ?? '"#7068FF"' : "#BBBBD4" }]}
                            onTouchStart={() => SheetManager.show('main-task-picker', {
                                payload: {
                                    onTaskSelect: onChoseMainTask,
                                }
                            })}
                        >
                            <Text style={[styles.titleMainTaskName, { color: !subTask.mainTaskId ? "#BBBBD4" : "white" }]} >
                                {subTask.mainTaskId ? subTask.mainTaskName : "Main Task Require"}
                            </Text>
                        </Pressable>
                    )
                }
                <View style={styles.buttonContainer}>
                    <Button title="Cancel" onPressHandler={() => SheetManager.hide('create-sub-task')} isPrimary={false} />
                    <Button title="Apply" onPressHandler={handerCreateSubTask} />
                </View>
            </View>
        </ActionSheet>
    );
}

const styles = StyleSheet.create({
    actionSheetContainer: {
        backgroundColor: "#222239",
        height: "auto",
    },
    wrapper: {
        width: "100%", height: 60, borderWidth: 1,
        borderRadius: 12,
        marginTop: 20,
        paddingLeft: 16, display: "flex", justifyContent: "center", alignItems: "flex-start"
    },
    container: {
        width: "auto",
        height: "auto",
        padding: 20,
        flexDirection: "column",
        gap: 12,
        paddingBottom: 40,
    },
    titleMainTaskName: {
        fontSize: 18, fontWeight: 500
    },
    title: {
        color: "white",
        fontSize: 24,
        textAlign: "center",
        fontWeight: "bold",
    },
    label: {
        color: "#ACABB4",
        marginTop: 20,
        marginBottom: 8,
        fontWeight: "500",
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
    input: {
        width: "100%",
        height: 54,
        backgroundColor: "#222239",
        color: "white",
        fontSize: 18,
        borderBottomColor: "#BBBBD4",
        borderBottomWidth: 2,
        marginTop: 8,
        fontWeight: "500"
    }
});

export default React.memo(CreateSubTask)

