import { View, Text, Image, Pressable } from "react-native";
import ActionSheet, { FlatList, SheetManager } from "react-native-actions-sheet";
import { useCalendarStore } from "@/store/calender";
import ColorPicker from "../inputFileds/ColorPicker";
import { useState, useCallback, useEffect } from "react";
import TextInput from "../inputFileds/TextInput";
import DateInput from "../inputFileds/DateInput";

import colorData from "../../data/colors.json"
import { useColorsStore } from "@/store/colors";
import Button from "../Button";


function CreateMainTask() {
  const [createMainTaskState, setCreateMainTaskState] = useState<{
    title: string,
    dueDay: string,
    color: string,
  }>({
    title: '',
    dueDay: '',
    color: ''
  })

  const { setDayPick } = useCalendarStore();
  const { colorPicked, setColoPick } = useColorsStore()

  useEffect(() => {
    if (colorPicked === "") return
    setCreateMainTaskState({
      ...createMainTaskState,
      color: colorPicked
    })
  }, [colorPicked])


  const handerOnShetClose = useCallback(() => {
    setCreateMainTaskState({
      title: '',
      dueDay: '',
      color: ''
    });
    setDayPick('');
    setColoPick('');
  }, [])



  const pinkInitColorHandler = useCallback((color: string) => {
    setCreateMainTaskState({
      ...createMainTaskState,
      color: color
    })

    setColoPick("")
  }, [])

  return (
    <ActionSheet containerStyle={{ backgroundColor: "#222239", height: "auto" }}
      onClose={handerOnShetClose}
    >
      <View style={{ width: "auto", height: "auto", padding: 20, display: "flex", flexDirection: "column", gap: 12, paddingBottom: 40 }}>
        <Text style={{ color: "white", fontSize: 24, textAlign: "center" }}>Add New Main Task</Text>
        <TextInput mainTaskName={createMainTaskState.title} setMainTaskName={(value: string) => setCreateMainTaskState({ ...createMainTaskState, title: value })} placeHolder="Main Task" />
        <Text style={{ color: "#ACABB4", marginTop: 20, marginBottom: 8, fontWeight: 500 }}>Date</Text>
        <DateInput />
        <Text style={{ color: "#ACABB4", marginTop: 20, marginBottom: 8, fontWeight: 500 }}>Color</Text>
        <View style={{ width: '100%' }}>
          <FlatList
            style={{ width: '100%', display: 'flex' }}
            contentContainerStyle={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', gap: 4 }}
            data={colorData.INIT_COLOR_PICKER}
            keyExtractor={(item) => item}
            renderItem={({ item, index }) => {
              return (
                <View style={{ display: 'flex', flexDirection: 'row', gap: 4 }}>
                  <ColorPicker colorValue={item} setColorValue={(value: string) => pinkInitColorHandler(value)} selectedColor={createMainTaskState.color} />
                  {
                    index === colorData.INIT_COLOR_PICKER.length - 1 && colorPicked === "" && (
                      <Pressable style={{ width: 48, height: 48, borderRadius: "50%", display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                        onPressIn={() => SheetManager.show('color-picker-sheet')}
                      >
                        <Image source={require('../../assets/colorful.png')} style={{ width: 36, height: 36 }} />
                      </Pressable>
                    )
                  }
                  {
                    index === colorData.INIT_COLOR_PICKER.length - 1 && colorPicked !== "" && (

                      <ColorPicker colorValue={colorPicked} setColorValue={() => SheetManager.show('color-picker-sheet')} selectedColor={colorPicked} />
                    )
                  }
                </View>
              )
            }}

          ></FlatList>

          <View style={{ width: "100%", height: "auto", display: "flex", flexDirection: "row", justifyContent: "flex-end", alignItems: "center", paddingHorizontal: 10, gap: 24, marginTop: 30 }} >
            <Button tittle="Cancel" onPressHandler={() => {
              SheetManager.hide('create-main-task')
            }} isPrimary={false} />
            <Button tittle="Set Day" onPressHandler={() => {
              SheetManager.hide('create-main-task')
            }} />
          </View>
        </View>
      </View>
    </ActionSheet>
  );
}






export default CreateMainTask;
