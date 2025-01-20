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
import { useNavigation } from 'expo-router';
import { useSubTaskContext } from '@/store/contextViewSub';
import { SheetManager } from 'react-native-actions-sheet';
import CheckBox from '@/components/CheckBox';



const AllHabits = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<{
    search: string;
    type: 'all' | 'completed' | 'uncompleted';
  }>({
    search: '',
    type: 'all',
  });
  const { tasks, setTasks, loading, mountOn, setMountOn } = useSubTaskContext();
  const isFirstMounted = React.useRef<boolean>(false);
  const db = useSQLiteContext();

  const navigator = useNavigation();
  const focused = navigator.isFocused()



  const onRefresh = () => {
    setRefreshing(true);
  };



  const onTaskDone = (id: number) => {
    const taskIndex = tasks.findIndex((task) => task.id === id);

    if (taskIndex === -1) return;

    const currentTask = tasks[taskIndex];

    const updatedTask: TaskItemQueryType = {
      ...currentTask,
      completed: currentTask.completed === 0 ? 1 : 0,
    };

    const newHabit = [
      ...tasks.slice(0, taskIndex),
      ...tasks.slice(taskIndex + 1),
    ];

    if (updatedTask.completed === 1) {
      newHabit.push(updatedTask);
    } else {
      newHabit.unshift(updatedTask);
    }

    setTasks(newHabit, loading);
  };


  useEffect(() => {
    if (!focused) return
    if (mountOn === 'tab' && isFirstMounted.current) return
    if (!isFirstMounted.current) {
      isFirstMounted.current = true
    }
    async function getAllMainTask() {
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

          setTasks(habit, false);
          setMountOn('tab');


          setRefreshing(false);
        }
      } catch (error) {
        setTasks([], false);
        setRefreshing(false);
        setMountOn('tab');
      }
    }

    getAllMainTask();
  }, [refreshing, focused]);

  const handleSearch = (e: string) => {
    setFilter({ ...filter, search: e });
  };

  const taskRender = useMemo(() => {
    if (filter.search.length === 0 && filter.type === 'all') {
      return tasks;
    }

    return tasks.filter((task) => (
      (task.title.toLowerCase().includes(filter.search.toLowerCase()) && task.completed === (filter.type === 'completed' ? 1 : filter.type === 'uncompleted' ? 0 : task.completed))
    ));

  }, [filter, tasks]);


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
            value={filter.search}
            onChangeText={handleSearch}
            placeholderTextColor="#4D4C71"
          />
          <View style={styles.searchIconContainer}>
            <Ionicons name="search" size={32} color="white" />
          </View>
          <Pressable
            style={styles.clearIconContainer}
            onPressIn={() => setFilter({ ...filter, search: '' })}
          >
            {filter.search.length > 0 && (
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
          buttonEvent={() => SheetManager.show('create-sub-task', {
            payload: {
              type: 'create-from-tab',
              mainTaskId: null,
              title: '',
              color: '',
            }
          })}
          isShowButton={true}
        />

        {/* filter optons  */}
        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', width: '100%', marginBottom: 20, display: 'flex', gap: 20 }}>
          <CheckBox label='All' value={filter.type === 'all'} onselect={() => setFilter({ ...filter, type: 'all' })} />
          <CheckBox label='Done' value={filter.type === 'completed'} onselect={() => setFilter({ ...filter, type: 'completed' })} />
          <CheckBox label='Undone' value={filter.type === 'uncompleted'} onselect={() => setFilter({ ...filter, type: 'uncompleted' })} />
        </View>

        {/* Task List */}
        <View style={styles.tasksContainer}>
          {
            !loading && (
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
            )
          }
          {/* Empty State */}
          {taskRender.length === 0 && !loading && (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Empty</Text>
            </View>
          )}
          {/* Loading Skeletons */}
          {loading && (
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
    marginTop: 20,
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
    overflow: 'hidden',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    gap: 14,
    paddingBottom: 180,
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
