import React, { useEffect, useCallback } from 'react';
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { getGradientColor } from './MainTask';
import { MainTaskType } from '@/types/appTypes';
import ContextMenu from 'react-native-context-menu-view';
import { SheetManager } from 'react-native-actions-sheet';

interface Props {
    mainTaskItem: MainTaskType;
    editMainTaskHander: (task: MainTaskType) => void;
    deleteMainTaskHander: (taskId: string) => void;
}

const GroupCard = React.memo(({ mainTaskItem, deleteMainTaskHander, editMainTaskHander }: Props) => {
    const { title, color, remainTimePercent, type } = mainTaskItem;
    const isRenderProgress = true;
    const { width } = Dimensions.get('window');

    const translateX = useSharedValue(100); // Changed from "100%" to 100

    const translateXStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }],
        easing: Easing.inOut(Easing.ease),
    }));

    useEffect(() => {
        translateX.value = withRepeat(
            withSequence(
                withTiming(0, { duration: 1500 }),
                withDelay(300, withTiming(0, { duration: 0 }))
            ),
            -1,
            false
        );
    }, [translateX]);

    const handleContextMenuPress = useCallback(
        (e: any) => {
            const index = e.nativeEvent.index;
            if (index === 1) {
                deleteMainTaskHander(mainTaskItem.id.toString());
            }
            if (index === 0) {
                editMainTaskHander(mainTaskItem);
            }
        },
        [deleteMainTaskHander, editMainTaskHander, mainTaskItem]
    );

    const handlePress = useCallback(() => {
        SheetManager.show('create-sub-task');
    }, []);

    return (
        <ContextMenu
            actions={[
                { title: 'Edit', systemIcon: 'pencil.tip', iconColor: '#1E1E1E' },
                { title: 'Delete', systemIcon: 'trash', destructive: true },
            ]}
            style={styles.contextMenu}
            onPress={handleContextMenuPress}
        >
            <Pressable style={styles.pressable} onPress={handlePress}>
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
                        <View
                            style={[
                                styles.progressBarContainer,
                                { width: (width - 40) * (remainTimePercent / 100) },
                            ]}
                        >
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
            </Pressable>
        </ContextMenu>
    );
});

export default GroupCard;

const styles = StyleSheet.create({
    contextMenu: {
        overflow: 'hidden',
        borderRadius: 6,
    },
    pressable: {
        width: '100%',
        height: 'auto',
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
