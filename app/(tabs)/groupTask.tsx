
import { View, Text, Modal, StyleSheet, RefreshControl, ScrollView } from 'react-native'
import React, { useState } from 'react'
import BlockHeader from '@/components/BlockHeader'
import TaskItem from '@/components/TaskItem'
import MainTask from '@/components/MainTask'



const GroupTask = () => {

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);

    // Simulate a network request or data refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 2000); // 2 seconds delay
  };

  return (

    <View style={{ flex: 1, width: "100%", backgroundColor: '#1A182C', display: 'flex', justifyContent: 'center', alignItems: 'center', height: "auto" }}>

      <ScrollView style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <BlockHeader isShowSubTitle={false} mainTitle="All Habit" subTitle="see all" isShowBoxCount={true} boxCount={4} />
        <View style={{ flexDirection: 'column', width: '100%', height: "auto", overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 14, marginBottom: 20 }}>
          <TaskItem cardContent="Drink water" primaryColor="#FF748B" />
          <TaskItem cardContent="Go To The Gym" primaryColor="#3068DF" />
          <TaskItem cardContent="Eat More Clean" primaryColor="#6861ED" />
          <TaskItem cardContent="Doing Some Coding" primaryColor="#FF748B" />
          <TaskItem cardContent="Sleep Well Is Best Medicine" primaryColor="#FF748B" />
        </View>

        <BlockHeader isShowSubTitle={false} mainTitle="All Task" subTitle="see all" isShowBoxCount={true} boxCount={10} />
        <View style={{ flexDirection: 'column', width: '100%', height: "auto", overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 14, marginBottom: 20 }}>
          <View style={{ flex: 1, width: "100%", height: "auto", marginBottom: 20 }}>
            {/* // Group 1: Reading */}
            <MainTask mainTaskName="Reading Activities" overAllPercent={70} remainTimePercent={90} primaryColor="#FF9A6B" />
            {/* // Group 1: Reading */}
            <View style={{ flexDirection: 'row', width: '100%', height: "auto", overflow: 'hidden', marginTop: 12, justifyContent: "flex-end" }}>
              <View style={{ width: 2, height: "100%", backgroundColor: "#FF9A6B", borderRadius: 20, position: 'relative' }}>
                <View style={{ width: 18, height: 18, borderRadius: "50%", backgroundColor: "#FF9A6B", position: "absolute", top: 0, left: -8 }}></View>
                <View style={{ width: 18, height: 18, borderRadius: "50%", backgroundColor: "#FF9A6B", position: "absolute", bottom: 0, left: -8 }}></View>
              </View>
              <View style={{ flexDirection: 'column', width: '95%', height: "auto", overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 14, paddingLeft: 10 }}>
                <TaskItem cardContent="Read a Book" primaryColor="#FF9A6B" isSmallVersion={true} />
                <TaskItem cardContent="Pick a New Book to Read" primaryColor="#FF9A6B" isSmallVersion={true} />
                <TaskItem cardContent="Set a Reading Goal" primaryColor="#FF9A6B" isSmallVersion={true} />
                <TaskItem cardContent="Highlight Key Points in the Book" primaryColor="#FF9A6B" isSmallVersion={true} />
                <TaskItem cardContent="Discuss the Book with a Friend" primaryColor="#FF9A6B" isSmallVersion={true} />
              </View>
            </View>

          </View>



          <View style={{ flex: 1, width: "100%", height: "auto", marginBottom: 20 }}>
            {/* // Group 2: Meditation */}
            <MainTask mainTaskName="Meditation Practice" overAllPercent={80} remainTimePercent={85} primaryColor="#4CAF50" />
            {/* // Group 2: Meditation */}
            <View style={{ flexDirection: 'row', width: '100%', height: "auto", overflow: 'hidden', marginTop: 12, justifyContent: "flex-end" }}>
              <View style={{ width: 2, height: "100%", backgroundColor: "#4CAF50", borderRadius: 20, position: 'relative' }}>
                <View style={{ width: 18, height: 18, borderRadius: "50%", backgroundColor: "#4CAF50", position: "absolute", top: 0, left: -8 }}></View>
                <View style={{ width: 18, height: 18, borderRadius: "50%", backgroundColor: "#4CAF50", position: "absolute", bottom: 0, left: -8 }}></View>
              </View>
              <View style={{ flexDirection: 'column', width: '95%', height: "auto", overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 14, paddingLeft: 10 }}>
                <TaskItem cardContent="Practice Meditation" primaryColor="#4CAF50" isSmallVersion={true} />
                <TaskItem cardContent="Set a Timer for Meditation" primaryColor="#4CAF50" isSmallVersion={true} />
                <TaskItem cardContent="Find a Quiet Space to Meditate" primaryColor="#4CAF50" isSmallVersion={true} />
                <TaskItem cardContent="Follow a Guided Meditation Video" primaryColor="#4CAF50" isSmallVersion={true} />
                <TaskItem cardContent="Reflect on Your Meditation Session" primaryColor="#4CAF50" isSmallVersion={true} />
              </View>
            </View>

          </View>






          <View style={{ flex: 1, width: "100%", height: "auto", marginBottom: 20 }}>
            <MainTask mainTaskName="Walking for Wellness" overAllPercent={60} remainTimePercent={75} primaryColor="#FFCC33" />
            <View style={{ flexDirection: 'row', width: '100%', height: "auto", overflow: 'hidden', marginTop: 12, justifyContent: "flex-end" }}>
              <View style={{ width: 2, height: "100%", backgroundColor: "#FFCC33", borderRadius: 20, position: 'relative' }}>
                <View style={{ width: 18, height: 18, borderRadius: "50%", backgroundColor: "#FFCC33", position: "absolute", top: 0, left: -8 }}></View>
                <View style={{ width: 18, height: 18, borderRadius: "50%", backgroundColor: "#FFCC33", position: "absolute", bottom: 0, left: -8 }}></View>
              </View>
              <View style={{ flexDirection: 'column', width: '95%', height: "auto", overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 14, paddingLeft: 10 }}>
                <TaskItem cardContent="Take a Walk Outside" primaryColor="#FFCC33" isSmallVersion={true} />
                <TaskItem cardContent="Plan a Walking Route" primaryColor="#FFCC33" isSmallVersion={true} />
                <TaskItem cardContent="Take a Photo of Something " primaryColor="#FFCC33" isSmallVersion={true} />
                <TaskItem cardContent="Track Steps Using a Fitness App" primaryColor="#FFCC33" isSmallVersion={true} />
                <TaskItem cardContent="Walk in a New Neighborhood" primaryColor="#FFCC33" isSmallVersion={true} />
              </View>
            </View>
          </View>

          <View style={{ flex: 1, width: "100%", height: "auto", marginBottom: 20 }}>

            <MainTask mainTaskName="Skill Development" overAllPercent={90} remainTimePercent={95} primaryColor="#8E44AD" />
            <View style={{ flexDirection: 'row', width: '100%', height: "auto", overflow: 'hidden', marginTop: 12, justifyContent: "flex-end" }}>
              <View style={{ width: 2, height: "100%", backgroundColor: "#8E44AD", borderRadius: 20, position: 'relative' }}>
                <View style={{ width: 18, height: 18, borderRadius: "50%", backgroundColor: "#8E44AD", position: "absolute", top: 0, left: -8 }}></View>
                <View style={{ width: 18, height: 18, borderRadius: "50%", backgroundColor: "#8E44AD", position: "absolute", bottom: 0, left: -8 }}></View>
              </View>
              <View style={{ flexDirection: 'column', width: '95%', height: "auto", overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 14, paddingLeft: 10 }}>
                <TaskItem cardContent="Learn a New Skill" primaryColor="#8E44AD" isSmallVersion={true} />
                <TaskItem cardContent="Watch a Tutorial on the Skill" primaryColor="#8E44AD" isSmallVersion={true} />
                <TaskItem cardContent="Practice the Skill for 15 Minutes" primaryColor="#8E44AD" isSmallVersion={true} />
                <TaskItem cardContent="Set a Progress Goal for the Skill" primaryColor="#8E44AD" isSmallVersion={true} />
                <TaskItem cardContent="Share What You Learned Online" primaryColor="#8E44AD" isSmallVersion={true} />
              </View>
            </View>

          </View>



          <View style={{ flex: 1, width: "100%", height: "auto", marginBottom: 20 }}>
            <MainTask mainTaskName="Healthy Eating Goals" overAllPercent={65} remainTimePercent={80} primaryColor="#FF5722" />
            <View style={{ flexDirection: 'row', width: '100%', height: "auto", overflow: 'hidden', marginTop: 12, justifyContent: "flex-end" }}>
              <View style={{ width: 2, height: "100%", backgroundColor: "#FF5722", borderRadius: 20, position: 'relative' }}>
                <View style={{ width: 18, height: 18, borderRadius: "50%", backgroundColor: "#FF5722", position: "absolute", top: 0, left: -8 }}></View>
                <View style={{ width: 18, height: 18, borderRadius: "50%", backgroundColor: "#FF5722", position: "absolute", bottom: 0, left: -8 }}></View>
              </View>
              <View style={{ flexDirection: 'column', width: '95%', height: "auto", overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 14, paddingLeft: 10 }}>
                <TaskItem cardContent="Prepare Healthy Meals" primaryColor="#FF5722" isSmallVersion={true} />
                <TaskItem cardContent="Plan a Weekly Meal Schedule" primaryColor="#FF5722" isSmallVersion={true} />
                <TaskItem cardContent="Buy Fresh Ingredients" primaryColor="#FF5722" isSmallVersion={true} />
                <TaskItem cardContent="Try a New Healthy Recipe" primaryColor="#FF5722" isSmallVersion={true} />
                <TaskItem cardContent="Pack a Healthy Lunch" primaryColor="#FF5722" isSmallVersion={true} />
              </View>
            </View>

          </View>

        </View>

      </ScrollView>

    </View>
  )


}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#1A182C',
    padding: 20,
  },
})

export default GroupTask