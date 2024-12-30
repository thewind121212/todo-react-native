import { View, Text, StyleSheet } from "react-native";
import ActionSheet from "react-native-actions-sheet";
import { SheetManager } from 'react-native-actions-sheet';
import { Pressable } from "react-native-gesture-handler";
import { useCalendarStore } from "@/store/calender";
import { useEffect, useState, useCallback } from "react";
import TextInput from "../inputFileds/TextInput";
import DateInput from "../inputFileds/DateInput";



function CreateMainTask() {
  const { setDayPick } = useCalendarStore();
  const [createMainTaskState, setCreateMainTaskState] = useState<{
    title: string,
    dueDay: string,
    color: string,
  }>({
    title: '',
    dueDay: '',
    color: ''
  })

  // useEffect(() => {

  //   return () => {
  //     setDayPick('');
  //   }
  // }, [])




  // const handerCreateMainTask = () => {
  //   console.log('creating main task', title);
  // }

  // const handerCreateMainTask = useCallback(() => {
  //   console.log('creating main task', title);
  // }, [title])

  return (
    <ActionSheet containerStyle={{ backgroundColor: "#222239", height: "70%" }}>
      <View style={{ width: "100%", height: "100%", padding: 20, display: "flex", flexDirection: "column", gap: 12 }}>
        <Text style={{ color: "white", fontSize: 24, textAlign: "center" }}>Add New Main Task</Text>
        <TextInput mainTaskName={createMainTaskState.title} setMainTaskName={(value: string) => setCreateMainTaskState({ ...createMainTaskState, title: value })} />
        <Text style={{ color: "#94a3b8", marginTop: 20 }}>Date</Text>
        <DateInput />
      </View>
    </ActionSheet>
  );
}






export default CreateMainTask;
