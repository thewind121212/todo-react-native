
import { View, Text, StyleSheet, TextInput as RNTextInput } from "react-native";
import ActionSheet, { SheetManager, SheetProps } from "react-native-actions-sheet";
import { useState, useCallback, useRef } from "react";

import Button from "../Button";
import { useSQLiteContext } from "expo-sqlite";
import { TaskItemQueryType } from "@/types/appTypes";
import { SHEET_TOOGE_ANIMATION } from "@/config/animation";
import { useSubTaskContext } from "@/store/contextViewSub";

function CreateSubTask({ payload }: SheetProps<"create-sub-task">) {

    const [foucs, setFocus] = useState(false)
    const [name, setName] = useState<string>('')
    const inputRef = useRef<RNTextInput>(null);
    const [isSheetDirty, setIsSheetDirty] = useState<boolean>(false);
    const db = useSQLiteContext();

    const { editTasks } = useSubTaskContext();





    const handleOnCloseSheet = useCallback(() => {
        setIsSheetDirty(false);
        setName("");
    }, []);

    const handerCreateSubTask = useCallback(async () => {
        setIsSheetDirty(true);
        if (name === "") return;
        try {
            if (payload?.isEdit && payload?.subTaskId) {
                // Edit Sub Task
                await db.runAsync(
                    `UPDATE tasks SET title = ? WHERE id = ?`,
                    name,
                    payload.subTaskId
                );

                editTasks(payload.subTaskId, name)
                SheetManager.hide('create-sub-task');

            }
            if (payload?.siblingTask && !payload?.isEdit) {
                // Create Sub Task
                const result = await db.runAsync(
                    `INSERT INTO tasks (title, completed, priority, main_task_id ) VALUES (?, ?, ?, ?)`,
                    name,
                    0,
                    0,
                    payload.siblingTask.main_task_id
                );
                const newSubTask: TaskItemQueryType = {
                    ...payload.siblingTask,
                    id: result.lastInsertRowId,
                    primary_color: payload.siblingTask.primary_color,
                    priority: 0,
                    title: name,
                    completed: 0,
                }
                payload.onSubmit?.(newSubTask, 'create')
                SheetManager.hide('create-sub-task');
            }

        } catch (error) {
            console.log(error);
        }

    }, [db, payload, name]);





    return (
        <ActionSheet
            containerStyle={styles.actionSheetContainer}
            onBeforeClose={handleOnCloseSheet}
            closeAnimationConfig={{ ...SHEET_TOOGE_ANIMATION }}
            onOpen={() => {
                if (payload?.isEdit && payload?.title) {
                    setName(payload.title)
                }
                inputRef.current?.focus()
            }}
        >
            <View style={styles.container}>
                <Text style={styles.title}>{payload?.isEdit ? "Edit" : "Create"} Sub Task</Text>

                <RNTextInput
                    style={[styles.input, { borderBottomColor: (isSheetDirty && name.length === 0) ? "#F67280" : (foucs || name.length > 0) ? "#7068FF" : "#BBBBD4" }]}
                    placeholder={'Sub Task'}
                    keyboardType="default"
                    ref={inputRef}
                    value={name}
                    onChangeText={setName}
                    onFocus={() => setFocus(true)}
                    onBlur={() => setFocus(false)}
                    placeholderTextColor={isSheetDirty && name.length === 0 ? "#F67280" : '#BBBBD4'}
                />
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
    container: {
        width: "auto",
        height: "auto",
        padding: 20,
        flexDirection: "column",
        gap: 12,
        paddingBottom: 40,
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

export default CreateSubTask;

