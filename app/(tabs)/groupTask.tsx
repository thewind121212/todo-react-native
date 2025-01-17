import React, { useEffect, useMemo, useState, useTransition, useCallback, useRef } from 'react';
import {
  View,
  StyleSheet,
  RefreshControl,
  TextInput,
  Pressable,
  Text,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useSQLiteContext } from 'expo-sqlite';
import { SheetManager } from 'react-native-actions-sheet';
import BlockHeader from '@/components/BlockHeader';
import GroupCard from '@/components/GroupCard';
import { MainTaskType } from '@/types/appTypes';
import { Skeleton } from 'moti/skeleton';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Animated, { LinearTransition } from 'react-native-reanimated';
import { calcRemainTimePercent } from '@/utils/helper';



const AllTasks = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [shouldRefresh, setShouldRefresh] = useState(true);
  const [pending, startTransition] = useTransition();
  const [query, setQuery] = useState<string>('');
  const [allTasks, setAllTasks] = useState<{
    allMainTasks: MainTaskType[];
    isLoading: boolean;
    firstMount: boolean;
  }>({
    isLoading: true,
    allMainTasks: [],
    firstMount: false,
  });


  const db = useSQLiteContext();
  const timeOutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const deleteMainTaskHandler = useCallback(async (id: string) => {
    try {
      setAllTasks(prev => ({
        ...prev,
        allMainTasks: prev.allMainTasks.filter(task => task.id.toString() !== id),
      }));

      startTransition(() => {
        db.runSync(`DELETE FROM main_tasks WHERE id = (?)`, id);
      });
    } catch (error) {
      console.log(error);
    }
  }, [db, startTransition]);

  const onEditHandler = useCallback(async (task: MainTaskType) => {
    SheetManager.show('create-main-task', {
      payload: {
        type: task.type === 'habit' ? "editHabit" : "editTask",
        task: task,
        onTaskCreate: () => { },
        onUpdateTask: (id: number, editedTask: MainTaskType | undefined) => {
          if (!editedTask) return;
          const index = allTasks.allMainTasks.findIndex(task => task.id === id);
          startTransition(() => {
            setAllTasks(prev => {
              const updatedTasks = [...prev.allMainTasks];
              updatedTasks[index] = editedTask;
              return { ...prev, allMainTasks: updatedTasks };
            });
          });
        },
      },
    });
  }, [allTasks.allMainTasks, startTransition, SheetManager]);


  const skeletonArray = useMemo(() => [...Array(5).keys()], []);

  const onRefresh = () => {
    if (refreshing) return;
    setShouldRefresh(!shouldRefresh);
    setRefreshing(true);
    timeOutRef.current = setTimeout(() => {
      setRefreshing(false);
    }, 1000)
  };


  useEffect(() => {
    if (!refreshing && allTasks.firstMount) return
    async function getAllMainTask() {
      try {
        const result = await db.getAllAsync<MainTaskType>('SELECT * FROM main_tasks ORDER BY create_date DESC');
        if (result) {
          const modifiyTask: MainTaskType[] = []
          result.map((task) => {
            if (task.type === 'task') {
              const re = calcRemainTimePercent(task.due_day!, task.create_date)
              const newTask = { ...task, remainTimePercent: re }
              modifiyTask.push(newTask)
            }
            else {
              const newTask = { ...task, remainTimePercent: 0 }
              modifiyTask.push(newTask)
            }
          })


          setAllTasks({
            ...allTasks,
            allMainTasks: modifiyTask,
            isLoading: false,
            firstMount: true
          });
        }
      } catch (error) {
        setAllTasks({
          ...allTasks,
          isLoading: false,
          firstMount: true
        })
      }
    }

    getAllMainTask()

  }, [shouldRefresh])


  const onCreateMainTaskHandler = useCallback((action: "habit" | "task", task: MainTaskType) => {
    setAllTasks(prev => ({
      ...prev,
      allMainTasks: [task, ...prev.allMainTasks],
    }));
  }, []);

  const handleSearch = useCallback((text: string) => {
    setQuery(text.trimEnd());
  }, []);

  const taskRender = useMemo(() => {
    if (query.length === 0) {
      return allTasks.allMainTasks;
    }
    const lowerCaseQuery = query.toLowerCase();
    return allTasks.allMainTasks.filter(mainTaskItem =>
      mainTaskItem.title.toLowerCase().includes(lowerCaseQuery)
    );
  }, [query, allTasks.allMainTasks]);

  const renderItem = useCallback(({ item }: { item: MainTaskType }) => (
    <GroupCard
      key={item.id}
      mainTaskItem={item}
      deleteMainTaskHander={deleteMainTaskHandler}
      editMainTaskHander={onEditHandler}
    />
  ), [deleteMainTaskHandler, onEditHandler]);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.input}
            placeholder="Search"
            value={query}
            onChangeText={handleSearch}
            placeholderTextColor={'#4D4C71'}
          />
          <View style={styles.searchIconContainer}>
            <Ionicons name="search" size={32} color="white" />
          </View>
          <Pressable
            style={styles.clearIconContainer}
            onPress={() => setQuery('')}
          >
            {query.length > 0 && (
              <FontAwesome6 name="xmark" size={24} color="white" />
            )}
          </Pressable>
        </View>

        <BlockHeader
          isShowSubTitle={false}
          mainTitle="All Main Task"
          subTitle="see all"
          isShowBoxCount={taskRender.length > 0}
          boxCount={taskRender.length}
          isShowButton={true}
          buttonEvent={() => SheetManager.show('create-main-task', { payload: { type: "habit", onTaskCreate: onCreateMainTaskHandler } })}
        />

        <View style={styles.tasksContainer}>
          {taskRender.length > 0 ? (
            <Animated.FlatList
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              initialNumToRender={10}
              data={taskRender}
              renderItem={renderItem}
              keyExtractor={(item) => item.id.toString()}
              itemLayoutAnimation={LinearTransition}
              contentContainerStyle={styles.flatListContent}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                />
              }
            />
          ) : !allTasks.isLoading ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Empty</Text>
            </View>
          ) : (
            skeletonArray.map(index => (
              <Skeleton
                key={`groupTaskSkeletonHabit-${index}`}
                colorMode={'dark'}
                width={'100%'}
                height={52}
                colors={["#222239", "#2c2c49"]}
              />
            ))
          )}
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    width: "100%",
    backgroundColor: '#1A182C',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
    marginTop: 0,
  },
  searchContainer: {
    width: "100%",
    height: 64,
    backgroundColor: "#222239",
    borderRadius: 12,
    marginBottom: 24,
    position: "relative",
    justifyContent: 'center',
  },
  input: {
    height: "100%",
    paddingHorizontal: 64,
    borderRadius: 12,
    color: '#4D4C71',
    fontSize: 20,
    backgroundColor: '#222239',
  },
  searchIconContainer: {
    width: 64,
    height: 64,
    position: "absolute",
    left: 0,
    top: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  clearIconContainer: {
    width: 64,
    height: 64,
    position: "absolute",
    right: 0,
    top: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  tasksContainer: {
    flexDirection: 'column',
    width: '100%',
    overflow: 'hidden',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    gap: 14,
    marginBottom: 150,
  },
  flatListContent: {
    gap: 14,
  },
  emptyContainer: {
    width: "100%",
    height: 400,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    textAlign: "center",
    fontSize: 24,
    color: "#94a3b8",
  },
});

export default AllTasks;
