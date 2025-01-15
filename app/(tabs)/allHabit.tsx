import {
  View,
  StyleSheet,
  TextInput,
  Pressable,
  Text,
  RefreshControl,
  StatusBar,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import React, { useEffect, useMemo, useState } from 'react';
import BlockHeader from '@/components/BlockHeader';
import TaskItem from '@/components/TaskItem';
import { useSQLiteContext } from 'expo-sqlite';
import { TaskItemQueryType } from '@/types/appTypes';
import { Skeleton } from 'moti/skeleton';
import Animated, { LinearTransition } from 'react-native-reanimated';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const AllHabits = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [allTasks, setAllTasks] = useState<{
    habit: TaskItemQueryType[];
    loading: boolean;
  }>({
    habit: [],
    loading: true,
  });
  const [query, setQuery] = useState<string>('');
  const db = useSQLiteContext();

  const onRefresh = () => {
    setRefreshing(true);
  };

  const onTaskDone = (id: number) => {
    const taskIndex = allTasks.habit.findIndex((task) => task.id === id);

    if (taskIndex === -1) return;

    const currentTask = allTasks.habit[taskIndex];

    const updatedTask: TaskItemQueryType = {
      ...currentTask,
      completed: currentTask.completed === 0 ? 1 : 0,
    };

    const newHabit = [
      ...allTasks.habit.slice(0, taskIndex),
      ...allTasks.habit.slice(taskIndex + 1),
    ];

    if (updatedTask.completed === 1) {
      newHabit.push(updatedTask);
    } else {
      newHabit.unshift(updatedTask);
    }

    setAllTasks({
      ...allTasks,
      habit: newHabit,
    });
  };

  useEffect(() => {
    const sleep = (ms: number) => {
      return new Promise((resolve) => setTimeout(resolve, ms));
    };

    async function getAllMainTask() {
      await sleep(300);

      try {
        const result = await db.getAllAsync<TaskItemQueryType>(
          `SELECT t.*, mt.type AS main_task_type, mt.color AS primary_color, mt.title AS main_task_title, mt.id AS main_task_id, mt.due_day AS dueDate , mt.create_date AS createDate
          FROM tasks t
          JOIN main_tasks mt ON t.main_task_id = mt.id
          `
        );

        if (result) {
          const habit: TaskItemQueryType[] = [];

          result.map((item) => {
            if (item.main_task_type === 'habit' && item.completed === 1) {
              habit.push(item);
            } else if (item.main_task_type === 'habit' && item.completed === 0) {
              habit.unshift(item);
            }
          });

          setAllTasks({
            ...allTasks,
            habit: habit,
            loading: false,
          });

          setRefreshing(false);
        }
      } catch (error) {
        setAllTasks({
          ...allTasks,
          loading: false,
        });
        setRefreshing(false);
      }
    }

    getAllMainTask();
  }, [refreshing]);

  const handleSearch = (e: string) => {
    setQuery(e);
  };

  const taskRender = useMemo(() => {
    if (query.length === 0) {
      return allTasks.habit;
    }
    return allTasks.habit.filter((task) =>
      task.title.toLowerCase().includes(query.toLowerCase())
    );
  }, [query, allTasks.habit]);

  const renderItem = ({ item }: { item: TaskItemQueryType }) => (
    <TaskItem
      key={item.id}
      cardContent={item.title}
      primaryColor={item.primary_color}
      taskItemId={item.id}
      isUseSetDoneLocal={false}
      setDoneOutFunc={onTaskDone}
      isDoneProps={item.completed === 1}
    />
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.input}
            placeholder="Search"
            value={query}
            onChangeText={handleSearch}
            placeholderTextColor="#4D4C71"
          />
          <View style={styles.searchIconContainer}>
            <Ionicons name="search" size={32} color="white" />
          </View>
          <Pressable
            style={styles.clearIconContainer}
            onPressIn={() => setQuery('')}
          >
            {query.length > 0 && (
              <FontAwesome6 name="xmark" size={24} color="white" />
            )}
          </Pressable>
        </View>

        {/* Block Header */}
        <BlockHeader
          isShowSubTitle={false}
          mainTitle="All Habit"
          subTitle="see all"
          isShowBoxCount={taskRender.length > 0}
          boxCount={taskRender.length}
          isShowButton={true}
        />

        {/* Task List */}
        <View style={styles.tasksContainer}>
          <Animated.FlatList
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            data={taskRender}
            renderItem={renderItem}
            itemLayoutAnimation={LinearTransition}
            contentContainerStyle={styles.flatListContent}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
          {/* Empty State */}
          {taskRender.length === 0 && !allTasks.loading && (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Empty</Text>
            </View>
          )}
          {/* Loading Skeletons */}
          {allTasks.loading && (
            <View style={styles.skeletonContainer}>
              {[...Array(10).keys()].map((_, index) => (
                <Skeleton
                  key={index + 'groupTaskSkeletonHabit'}
                  colorMode="dark"
                  width="100%"
                  height={52}
                  colors={['#222239', '#2c2c49']}
                />
              ))}
            </View>
          )}
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export function AllHabitsPlaceHolder() {
  return (
    <Skeleton.Group show={true}>
      <Skeleton
        colorMode="dark"
        width="100%"
        height={64}
        colors={['#222239', '#2c2c49']}
        radius={12}
      />
      <View style={styles.placeholderTasksContainer}>
        <Skeleton
          colorMode="dark"
          width={2}
          height={314}
          colors={['#222239', '#2c2c49']}
        />
        <View style={styles.placeholderCircle}>
          <Skeleton
            colorMode="dark"
            width={18}
            height={18}
            radius="round"
            colors={['#222239', '#2c2c49']}
          />
        </View>
        <View style={styles.placeholderCircle}>
          <Skeleton
            colorMode="dark"
            width={18}
            height={18}
            radius="round"
            colors={['#222239', '#2c2c49']}
          />
        </View>
        <View style={styles.placeholderTasksList}>
          {[...Array(4).keys()].map((_, index) => (
            <Skeleton
              key={index + 'taskTree1'}
              colorMode="dark"
              width="100%"
              height={68}
              colors={['#222239', '#2c2c49']}
            />
          ))}
        </View>
      </View>
    </Skeleton.Group>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    width: '100%',
    backgroundColor: '#1A182C',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
    paddingTop: StatusBar.currentHeight || 0,
  },
  searchContainer: {
    width: '100%',
    height: 64,
    backgroundColor: '#222239',
    borderRadius: 12,
    marginBottom: 24,
    position: 'relative',
    justifyContent: 'center',
  },
  input: {
    height: '100%',
    paddingHorizontal: 64,
    borderRadius: 12,
    color: 'white',
    fontSize: 20,
  },
  searchIconContainer: {
    width: 64,
    height: 64,
    position: 'absolute',
    left: 0,
    top: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearIconContainer: {
    width: 64,
    height: 64,
    position: 'absolute',
    right: 0,
    top: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tasksContainer: {
    flexDirection: 'column',
    width: '100%',
    height: 'auto',
    overflow: 'hidden',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    gap: 14,
    marginBottom: 150,
  },
  flatListContent: {
    gap: 14,
    paddingBottom: 20, // To ensure last item is visible
  },
  emptyContainer: {
    width: '100%',
    height: 400,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 24,
    color: '#94a3b8',
  },
  skeletonContainer: {
    width: '100%',
    height: 'auto',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    gap: 14,
  },
  placeholderTasksContainer: {
    flexDirection: 'row',
    width: '100%',
    height: 'auto',
    overflow: 'hidden',
    marginTop: 10,
    justifyContent: 'flex-end',
  },
  placeholderCircle: {
    width: 18,
    height: 18,
    borderRadius: 9, // Half of width and height to make it a circle
    position: 'absolute',
    left: -8,
    backgroundColor: '#222239', // Background color for skeleton placeholder
  },
  placeholderTasksList: {
    flexDirection: 'column',
    width: '95%',
    height: 314,
    overflow: 'hidden',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    gap: 14,
    paddingLeft: 10,
  },
});

export default AllHabits;
