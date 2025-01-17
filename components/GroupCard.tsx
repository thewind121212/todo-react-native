import React, { useEffect, useCallback } from 'react';
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Animated, { Easing, runOnJS, useAnimatedStyle, useSharedValue, withDelay, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { getGradientColor } from './MainTask';
import { MainTaskType } from '@/types/appTypes';
import ContextMenu from 'react-native-context-menu-view';
import { SheetManager } from 'react-native-actions-sheet';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

interface Props {
    mainTaskItem: MainTaskType;
    editMainTaskHander: (task: MainTaskType) => void;
    deleteMainTaskHander: (taskId: string) => void;
}

const GroupCard = React.memo(({ mainTaskItem, deleteMainTaskHander, editMainTaskHander }: Props) => {
    const { title, color, remainTimePercent, type } = mainTaskItem;
    const isRenderProgress = true;



    const translateX = useSharedValue<any>("100%");
    const { width } = Dimensions.get('window');

    const translateXStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }],
        easing: Easing.inOut(Easing.ease),
    }));

    useEffect(() => {
        translateX.value = withRepeat(
            withSequence(
                withTiming("0", { duration: 1500 }),
                withDelay(300, withTiming("0", { duration: 0 })),
            ),
            -1,
        )
    }, [])


    const handleContextMenuPress = (e: any) => {
        const index = e.nativeEvent.index;
        SheetManager.hide('show-sub-task');
        if (index === 1) {
            deleteMainTaskHander(mainTaskItem.id.toString());
        }
        if (index === 0) {
            editMainTaskHander(mainTaskItem);
        }
    }

    const handlePress = useCallback(() => {
        SheetManager.show('show-sub-task', { payload: { mainTaskId: mainTaskItem.id, mainTaskTitle: mainTaskItem.title, primaryColor: mainTaskItem.color } });
    }, []);

    const tapGesture = Gesture.Tap().onStart(() => {
        runOnJS(handlePress)();
    })
    return (
        <ContextMenu
            actions={[
                { title: 'Edit', systemIcon: 'pencil.tip', iconColor: '#1E1E1E' },
                { title: 'Delete', systemIcon: 'trash', destructive: true },
            ]}
            id='groupCardContextMenu'
            style={styles.contextMenu}
            onPress={handleContextMenuPress}
        >
            <GestureDetector gesture={tapGesture}>
                <View style={styles.mainGroupTaskCard}>
                    <View style={styles.titleContainer}>
                        <View style={styles.iconContainer}>
                            <View style={[styles.iconInnerContainer, { opacity: type === 'habit' ? 1 : 0 }]}>
                                <MaterialIcons name="autorenew" size={24} color="white" />
                            </View>
                            <View style={[styles.iconInnerContainer, { opacity: type === 'task' ? 1 : 0 }]}>
                                <MaterialIcons name="checklist" size={24} color="white" />
                            </View>
                        </View>
                        <Text style={styles.title}>{title}</Text>
                    </View>
                    <View style={[styles.colorIndicator, { backgroundColor: color }]} />


                    {isRenderProgress && (
                        <View style={[styles.progressBarContainer, { width: Math.min((width - 40) * (remainTimePercent / 100), width) }]}>
                            <View style={styles.progressBarBackground}>
                                <LinearGradient
                                    colors={[...getGradientColor(remainTimePercent)] as [string, string, ...string[]]}
                                    start={{ x: -1, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.progressBarGradient}
                                />
                                <Animated.View style={[styles.progressBarAnimated, translateXStyle]}>
                                    <LinearGradient
                                        colors={[...getGradientColor(remainTimePercent)] as [string, string, ...string[]]}
                                        start={{ x: -1, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                        style={styles.progressBarGradient}
                                    />
                                </Animated.View>
                            </View>
                        </View>
                    )}

                </View>
            </GestureDetector>
        </ContextMenu>
    );
});

export default GroupCard;

const styles = StyleSheet.create({
    contextMenu: {
        overflow: 'hidden',
        borderRadius: 6,
    },
    mainGroupTaskCard: {
        width: '100%',
        paddingVertical: 18,
        backgroundColor: '#222239',
        borderRadius: 8,
        paddingRight: 20,
        paddingLeft: 24,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
    },
    titleContainer: {
        flexDirection: 'row',
        gap: 8,
        alignItems: 'center',
    },
    iconContainer: {
        width: 32,
        height: 32,
        backgroundColor: '#7068FF',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 6,
        position: 'relative',
    },
    iconInnerContainer: {
        width: 24,
        height: 24,
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '600',
        maxWidth: '81%',
    },
    colorIndicator: {
        width: 30,
        height: 30,
        borderRadius: 15, // Half of width and height to make it circular
        justifyContent: 'center',
        alignItems: 'center',
    },
    progressBarContainer: {
        height: 4,
        position: 'absolute',
        left: 0,
        bottom: 0,
        overflow: 'hidden',
        borderRadius: 2,
    },
    progressBarBackground: {
        width: '100%',
        height: 4,
        position: 'relative',
        overflow: 'hidden',
    },
    progressBarGradient: {
        width: '100%',
        height: 4,
    },
    progressBarAnimated: {
        width: '100%',
        height: 4,
        position: 'absolute',
        top: 0,
        left: 0,
    },
});
