import { View, Text, Image, Pressable } from "react-native";
import ActionSheet, { FlatList, SheetManager, SheetProps } from "react-native-actions-sheet";
import ColorPicker from "../inputFileds/ColorPicker";
import { useState, useCallback, useMemo, useEffect } from "react";
import TextInput from "../inputFileds/TextInput";
import DateInput from "../inputFileds/DateInput";

import colorData from "../../data/colors.json"
import { useCreateMainTaskStore } from "@/store/createMainTask";
import Button from "../Button";
import { useSQLiteContext } from "expo-sqlite";


function CreateMainTask({ payload }: SheetProps<"create-main-task">) {

  const { name, dayPick, color, resetState, setName, setDayPick, setColor } = useCreateMainTaskStore()




  const [isSheetDirty, setIsSheetDirty] = useState<boolean>(false)
  const db = useSQLiteContext()

  if (payload?.type === "editHabit" || payload?.type === "editTask") {
    useEffect(() => {
      setName(payload?.task?.title!)
      setColor(payload?.task?.color!)
      setDayPick(payload?.task?.due_day! ? payload.task.due_day! : "")
    }, [])
  }



  const createMainTaskHander = useCallback(async () => {
    setIsSheetDirty(true)
    if (payload?.type === "task" && dayPick === "") return
    if (name === "" || color === "") return

    try {
      let lastId = 0

      if (payload?.type === "editHabit" || payload?.type === "editTask") {
        await db.runAsync(
          `UPDATE main_tasks SET title = ?, color = ?, due_day = ?  WHERE id = ?`,
          name, color, dayPick ? dayPick : null, payload?.task?.id!,
        );
      } else {
        const log = await db.runAsync(
          `INSERT INTO main_tasks (title, type, due_day, color) VALUES (?, ?, ?, ?)`,
          name, payload?.type! === "habit" ? 'habit' : "task", dayPick ? dayPick : null, color
        );
        payload?.onTaskCreate(payload.type, {
          id: log.lastInsertRowId,
          title: name,
          type: payload?.type! === "habit" ? 'habit' : "task",
          create_date: new Date().toISOString(),
          update_date: new Date().toISOString(),
          due_day: dayPick ? dayPick : null,
          color: color
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


  return (
    <ActionSheet containerStyle={{ backgroundColor: "#222239", height: "auto" }}
      onClose={handerOnShetClose}
    >
      <View style={{ width: "auto", height: "auto", padding: 20, display: "flex", flexDirection: "column", gap: 12, paddingBottom: 40 }}>
        <Text style={{ color: "white", fontSize: 24, textAlign: "center", fontWeight: 600 }}>{payload?.type === 'habit' ? "Create Main Habit" : "Create Main Task"}</Text>
        <TextInput placeHolder="Main Task" isSheetDirty={isSheetDirty} />
        {
          (payload?.type === "task" || payload?.type === "editTask") && (
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
                onPressIn={() => SheetManager.show('color-picker-sheet')}
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
