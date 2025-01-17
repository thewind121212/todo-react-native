import { View, Text, Image, Pressable, Keyboard, StyleSheet } from "react-native";
import ActionSheet, { SheetManager, SheetProps } from "react-native-actions-sheet";
import ColorPicker from "../inputFileds/ColorPicker";
import { useState, useCallback, useMemo, useEffect } from "react";
import TextInput from "../inputFileds/TextInput";
import DateInput from "../inputFileds/DateInput";
import CreateOptions from "../inputFileds/CreateOptions";

import colorData from "../../data/colors.json";
import { useCreateMainTaskStore } from "@/store/createMainTask";
import Button from "../Button";
import { useSQLiteContext } from "expo-sqlite";
import { calcRemainTimePercent, getCurrentDateTime } from "@/utils/helper";
import { MainTaskType } from "@/types/appTypes";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";

function CreateMainTask({ payload }: SheetProps<"create-main-task">) {
  const { name, dayPick, color, resetState, setName, setDayPick, setColor, createType, setCreateType } = useCreateMainTaskStore();

  const [isSheetDirty, setIsSheetDirty] = useState<boolean>(false);
  const db = useSQLiteContext();

  useEffect(() => {
    if (payload?.type === "editHabit" || payload?.type === "editTask") {
      setCreateType(payload.task?.type || 'task');
      setName(payload.task?.title || '');
      setColor(payload.task?.color || '');
      setDayPick(payload.task?.due_day || "");
    }
  }, [payload, setCreateType, setName, setColor, setDayPick]);

  const createMainTaskHandler = useCallback(async () => {
    setIsSheetDirty(true);
    if (createType === "task" && dayPick === "") return;
    if (name === "" || color === "") return;

    try {
      if (payload?.type === "editHabit" || payload?.type === "editTask") {
        if (payload.onUpdateTask && payload.task) {
          await db.runAsync(
            `UPDATE main_tasks SET title = ?, color = ?, due_day = ? WHERE id = ?`,
            name,
            color,
            dayPick ? dayPick : null,
            payload.task.id
          );
          const newTask: MainTaskType = {
            id: payload.task.id,
            title: name,
            type: createType === "habit" ? 'habit' : "task",
            create_date: payload.task.create_date,
            update_date: payload.task.update_date,
            due_day: dayPick ? dayPick : null,
            color: color,
            remainTimePercent: dayPick ? calcRemainTimePercent(dayPick, payload.task.create_date) : 0
          };
          payload.onUpdateTask(payload.task.id, newTask);
        }
      } else {
        const log = await db.runAsync(
          `INSERT INTO main_tasks (title, type, due_day, color) VALUES (?, ?, ?, ?)`,
          name,
          createType,
          dayPick ? dayPick : null,
          color
        );
        payload?.onTaskCreate(createType, {
          id: log.lastInsertRowId,
          title: name,
          type: createType === "habit" ? 'habit' : "task",
          create_date: getCurrentDateTime(),
          update_date: getCurrentDateTime(),
          due_day: dayPick ? dayPick : null,
          color: color,
          remainTimePercent: dayPick ? calcRemainTimePercent(dayPick, getCurrentDateTime()) : 0
        });
      }

      SheetManager.hide('create-main-task');
    } catch (error) {
      console.log(error);
      setTimeout(() => {
        SheetManager.hide('create-main-task');
      }, 200);
    }
  }, [name, dayPick, color, createType, db, payload]);


  const isIncludesInColorInit = useMemo(() => {
    return colorData.INIT_COLOR_PICKER.includes(color);
  }, [color]);

  const isEdit = payload?.type === "editHabit" || payload?.type === "editTask";

  const showCustomColorPicker = useMemo(() => {
    return !isIncludesInColorInit && color !== "";
  }, [isIncludesInColorInit, color]);

  const disMissKeyBoard = () => {
    Keyboard.dismiss();
  }

  const tapGesture = Gesture.Tap().onStart(() => {
    runOnJS(disMissKeyBoard)();
  })


  return (
    <ActionSheet
      containerStyle={styles.actionSheetContainer}
      closeAnimationConfig={{ stiffness: 200, damping: 100, mass: 1 }}
      onOpen={() => {
        if (payload?.type !== "editHabit" && payload?.type !== "editTask") {
          resetState()
          setIsSheetDirty(false);
        }
      }}
      keyboardHandlerEnabled={true}
    >
      <GestureDetector gesture={tapGesture}>
        <View style={styles.container}>
          <Text style={styles.title}>{isEdit ? "Edit" : "Create"} Main Task</Text>
          <TextInput placeHolder="Main Task" isSheetDirty={isSheetDirty} />
          {
            !isEdit && (<CreateOptions />)
          }
          {
            (createType === "task" || payload?.type === "editTask") && (
              <>
                <Text style={styles.label}>Date</Text>
                <DateInput isSheetDirty={isSheetDirty} />
              </>
            )
          }
          <View style={styles.colorLabelContainer}>
            <Text style={styles.label}>Color</Text>
            {
              isSheetDirty && color === "" && (
                <Text style={styles.errorText}>(color is required)</Text>
              )
            }
          </View>
          <View style={styles.colorPickerContainer}>
            {
              colorData.INIT_COLOR_PICKER.map((item) => (
                <ColorPicker colorValue={item} key={item} />
              ))
            }
            {
              showCustomColorPicker ? (
                <ColorPicker colorValue={color} isChoose={true} />
              ) : (
                <Pressable
                  accessibilityLabel="Open color picker"
                  accessibilityRole="button"
                  style={styles.customColorPressable}
                  onPressIn={() => {
                    Keyboard.dismiss();
                    SheetManager.show('color-picker-sheet');
                  }}
                >
                  <Image source={require('../../assets/colorful.png')} style={styles.colorfulImage} />
                </Pressable>
              )
            }
          </View>

          <View style={styles.buttonContainer}>
            <Button title="Cancel" onPressHandler={() => SheetManager.hide('create-main-task')} isPrimary={false} />
            <Button title="Appy" onPressHandler={createMainTaskHandler} />
          </View>
        </View>
      </GestureDetector>
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
  errorText: {
    color: "#F67280",
    marginTop: 20,
    marginBottom: 8,
    fontWeight: "500",
  },
  colorLabelContainer: {
    width: "100%",
    height: "auto",
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: 8,
  },
  colorPickerContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 4,
  },
  customColorPressable: {
    width: 48,
    height: 48,
    borderRadius: 24, // Half of width/height for a circle
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorfulImage: {
    width: 36,
    height: 36,
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
});

export default CreateMainTask;

