import { View, Text, Image, Pressable, Keyboard } from "react-native";
import ActionSheet, { SheetManager, SheetProps } from "react-native-actions-sheet";
import ColorPicker from "../inputFileds/ColorPicker";
import { useState, useCallback, useMemo, useEffect } from "react";
import TextInput from "../inputFileds/TextInput";
import DateInput from "../inputFileds/DateInput";
import CreateOptions from "../inputFileds/CreateOptions";

import colorData from "../../data/colors.json"
import { useCreateMainTaskStore } from "@/store/createMainTask";
import Button from "../Button";
import { useSQLiteContext } from "expo-sqlite";
import { calcRemainTimePercent, getCurrentDateTime } from "@/utils/helper";
import { MainTaskType } from "@/types/appTypes";


function CreateMainTask({ payload }: SheetProps<"create-main-task">) {

  const { name, dayPick, color, resetState, setName, setDayPick, setColor, createType, setCreateType } = useCreateMainTaskStore()


  const [isSheetDirty, setIsSheetDirty] = useState<boolean>(false)
  const db = useSQLiteContext()

  if (payload?.type === "editHabit" || payload?.type === "editTask") {
    useEffect(() => {
      setCreateType(payload?.task?.type!)
      setName(payload?.task?.title!)
      setColor(payload?.task?.color!)
      setDayPick(payload?.task?.due_day! ? payload.task.due_day! : "")
    }, [])
  }



  const createMainTaskHander = useCallback(async () => {
    setIsSheetDirty(true)
    if (createType === "task" && dayPick === "") return
    if (name === "" || color === "") return

    try {
      if (payload?.type === "editHabit" || payload?.type === "editTask") {
        if (payload?.onUpdateTask && payload.task) {
          await db.runAsync(
            `UPDATE main_tasks SET title = ?, color = ?, due_day = ?  WHERE id = ?`,
            name, color, dayPick ? dayPick : null, payload.task.id,
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
          }
          payload.onUpdateTask(payload.task?.id!, newTask)
        }
      } else {
        const log = await db.runAsync(
          `INSERT INTO main_tasks (title, type, due_day, color) VALUES (?, ?, ?, ?)`,
          name, createType, dayPick ? dayPick : null, color
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
        })
      }


      SheetManager.hide('create-main-task')
    } catch (error) {
      console.log(error)
      setTimeout(() => {
        SheetManager.hide('create-main-task')
      }, 200)
    }

  }, [name, dayPick, color])


  const handerOnShetClose = useCallback(() => {
    setIsSheetDirty(false)
    resetState()
  }, [])

  const isIncludesInColorInit = useMemo(() => {
    return colorData.INIT_COLOR_PICKER.includes(color)
  }, [color])


  const isEdit = payload?.type === "editHabit" || payload?.type === "editTask"

  return (
    <ActionSheet containerStyle={{ backgroundColor: "#222239", height: "auto" }}
      onBeforeClose={handerOnShetClose}
    >
      <View style={{ width: "auto", height: "auto", padding: 20, display: "flex", flexDirection: "column", gap: 12, paddingBottom: 40 }}>
        <Text style={{ color: "white", fontSize: 24, textAlign: "center", fontWeight: 600 }}>{isEdit ? "Edit" : "Create"} Main Task</Text>
        <TextInput placeHolder="Main Task" isSheetDirty={isSheetDirty} />
        {
          !isEdit && (<CreateOptions />)
        }
        {
          (createType === "task" || payload?.type === "editTask") && (
            <>
              <Text style={{ color: "#ACABB4", marginTop: 20, marginBottom: 8, fontWeight: 500 }}>Date</Text>
              <DateInput isSheetDirty={isSheetDirty} />
            </>
          )
        }
        <View style={{ width: "100%", height: "auto", display: "flex", flexDirection: "row", justifyContent: "flex-start", gap: 8 }}
        >
          <Text style={{ color: "#ACABB4", marginTop: 20, marginBottom: 8, fontWeight: 500 }}>Color</Text>
          {
            isSheetDirty && color === "" && (
              <Text style={{ color: "#F67280", marginTop: 20, marginBottom: 8, fontWeight: 500 }}>{`(color is require)`}</Text>
            )
          }

        </View>
        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', gap: 4 }}>

          {
            colorData.INIT_COLOR_PICKER.map((item, index) => {
              return (
                <ColorPicker colorValue={item} key={index} />
              )
            })

          }
          {
            (isIncludesInColorInit || color === "") ? (
              <Pressable style={{ width: 48, height: 48, borderRadius: "50%", display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                onPressIn={() => {
                  Keyboard.dismiss()
                  SheetManager.show('color-picker-sheet')
                }}
              >
                <Image source={require('../../assets/colorful.png')} style={{ width: 36, height: 36 }} />
              </Pressable>
            ) : (

              <ColorPicker colorValue={color} isChoose={true} />
            )
          }
        </View>

        <View style={{ width: "100%", height: "auto", display: "flex", flexDirection: "row", justifyContent: "flex-end", alignItems: "center", paddingHorizontal: 10, gap: 24, marginTop: 30 }} >
          <Button tittle="Cancel" onPressHandler={() => SheetManager.hide('create-main-task')} isPrimary={false} />
          <Button tittle="Set Day" onPressHandler={createMainTaskHander} />
        </View>
      </View>
    </ActionSheet>
  );
}






export default CreateMainTask;
