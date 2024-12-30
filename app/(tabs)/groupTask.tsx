
import { View, StyleSheet, RefreshControl, ScrollView, TextInput, Dimensions, Pressable, Text } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons';
import { SheetManager } from 'react-native-actions-sheet';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import React, { useState } from 'react'
import BlockHeader from '@/components/BlockHeader'
import AddButton from '@/components/AddButton';
import GroupCard from '@/components/GroupCard';



const AllTasks = () => {

  const [refreshing, setRefreshing] = useState(false);
  const [query, setQuery] = useState<string>('');


  const { width, height } = Dimensions.get('window');

  const onRefresh = () => {
    setRefreshing(true);

    // Simulate a network request or data refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 2000); // 2 seconds delay
  };


  const handleSearch = () => {
    console.log('searching for:', height);
    SheetManager.show('example-sheet');

  }

  return (

    <View style={{ flex: 1, width: "100%", backgroundColor: '#1A182C', display: 'flex', justifyContent: 'center', alignItems: 'center', height: "auto" }}>

      <View style={{ width: 64, height: 64, position: "fixed", top: height - (64 + 200), right: -(width / 2 - (50)), zIndex: 5, borderRadius: 12, display: "flex", justifyContent: "center", alignItems: "center" }}>
        <AddButton />
      </View>

      <ScrollView style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >


        <View style={{ width: "100%", height: 64, backgroundColor: "#222239", borderRadius: 12, marginBottom: 24, position: "relative" }}>
          <TextInput
            style={styles.input}
            placeholder="Search"
            value={query}
            onChangeText={setQuery}
            placeholderTextColor={'#4D4C71'}
            onSubmitEditing={handleSearch}
          />
          <View style={{ width: 64, height: 64, position: "absolute", left: 0, top: 0, display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Ionicons name="search" size={32} color="white" />
          </View>
          <Pressable style={{ width: 64, height: 64, position: "absolute", right: 0, top: 0, display: "flex", justifyContent: "center", alignItems: "center" }}
            onPressIn={() => setQuery('')}
          >
            {
              query.length > 0 &&
              <FontAwesome6 name="xmark" size={24} color="white" />
            }
          </Pressable>
        </View>


        <BlockHeader isShowSubTitle={false} mainTitle="Group Habit" subTitle="see all" isShowBoxCount={true} boxCount={4} isShowButton={true} />

        <View style={{ flexDirection: 'column', width: '100%', height: 'auto', overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 14, marginBottom: 20 }}>
          <GroupCard mainTaskName="Personal Development" color="#FF748B" />
          <GroupCard mainTaskName="Health & Fitness" color="#4CAF50" />
          <GroupCard mainTaskName="Home Management" color="#FFA500" />
          <GroupCard mainTaskName="Work Projects" color="#1E90FF" />
          <GroupCard mainTaskName="Education & Learning" color="#6A5ACD" />
          <GroupCard mainTaskName="Financial Planning" color="#FFD700" />
        </View>
        <BlockHeader isShowSubTitle={false} mainTitle="Group Task" subTitle="see all" isShowBoxCount={true} boxCount={4} isShowButton={true} />
        <View style={{ flexDirection: 'column', width: '100%', height: 'auto', overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 14, marginBottom: 20 }}>
          <GroupCard mainTaskName="Reading Activities" color="#FF9A6B" isHabit={false} />
          <GroupCard mainTaskName="Meditation Practice" color="#4CAF50" isHabit={false} />
          <GroupCard mainTaskName="Walking for Wellness" color="#FFCC33" isHabit={false} />
          <GroupCard mainTaskName="Skill Development" color="#8E44AD" isHabit={false} />
          <GroupCard mainTaskName="Healthy Eating Goals" color="#FF5722" isHabit={false} />

        </View>



      </ScrollView >

    </View >
  )


}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#1A182C',
    width: "100%",
    padding: 20,
    marginTop: -64,
  },
  input: {
    height: "100%",
    paddingHorizontal: 64,
    marginBottom: 10,
    borderRadius: 12,
    color: '#4D4C71',
    fontSize: 20,
  },



})

export default AllTasks