import React, { useEffect, useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

type Props = {
    isShowSubTitle: boolean;
    style?: object;
    mainTitle: string;
    subTitle: string;
    isShowBoxCount?: boolean;
    boxCount?: number;
    onPressHandler?: () => void;
    isShowButton?: boolean;
    buttonEvent?: () => void;
    type?: 'default' | 'primary' | 'secondary'
};

const BlockHeader = React.memo(({
    isShowSubTitle,
    mainTitle,
    subTitle,
    onPressHandler,
    isShowBoxCount = false,
    boxCount = 0,
    style,
    isShowButton = false,
    buttonEvent = () => { },
    type = 'default',
}: Props) => {

    const shrinkSharedValue = useSharedValue(1);

    const buttonAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: shrinkSharedValue.value }],
    }));

    const handlePressIn = useCallback(() => {
        buttonEvent();
        shrinkSharedValue.value = withSpring(0.8, { damping: 10, stiffness: 100 });
    }, [buttonEvent, shrinkSharedValue]);

    const handlePressOut = useCallback(() => {
        shrinkSharedValue.value = withSpring(1, { damping: 10, stiffness: 100 });
    }, [shrinkSharedValue]);

    return (
        <View style={styles.blockHeader}>
            <View style={[styles.titleContainer, style]}>
                <Text style={[styles.mainTitle, { fontSize: type === 'secondary' ? 20 : 26 , color : type === 'secondary' ? '#BBBBD4' : 'white'}]}>{mainTitle}</Text>
                {isShowBoxCount && (
                    <View style={[styles.boxCountContainer, ...(type === 'secondary' ? [{backgroundColor: 'white', width: 32, height: 32, borderRadius: 8, marginLeft: 0,}] : [])]}>
                        {boxCount !== 0 && <Text style={[styles.boxCountText,{fontWeight: type === 'secondary' ? '600' : '400'} ,...(type === 'secondary' ? [{  color: '#1A182C', fontSize: 16}] : [])]}>{boxCount}</Text>}
                    </View>
                )}
            </View>

            {
                isShowSubTitle && (
                    <Pressable
                        onPress={onPressHandler}
                        style={styles.subTitleContainer}
                        disabled={!onPressHandler}
                    >
                        <Text style={styles.subTitle}>{subTitle}</Text>
                    </Pressable>
                )
            }

            {
                isShowButton && (
                    <Animated.View style={[styles.animatedButton, buttonAnimatedStyle]}>
                        <Pressable
                            onPress={buttonEvent}
                            style={styles.buttonPressable}
                            onPressIn={handlePressIn}
                            onPressOut={handlePressOut}
                            android_ripple={{ color: 'rgba(255,255,255,0.3)', radius: 16 }}
                        >
                            <FontAwesome6 name="plus" size={18} color="white" />
                        </Pressable>
                    </Animated.View>
                )
            }
        </View >
    );
});

export default BlockHeader;

const styles = StyleSheet.create({
    blockHeader: {
        width: '100%',
        flexDirection: 'row',
        marginBottom: 24,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    mainTitle: {
        fontSize: 26,
        color: '#fff',
        fontWeight: '600',
    },
    boxCountContainer: {
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#222239',
        borderRadius: 6,
        marginLeft: 12,
    },
    boxCountText: {
        fontSize: 18,
        color: '#fff',
    },
    subTitleContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    subTitle: {
        fontSize: 18,
        color: '#94a3b8',
    },
    animatedButton: {
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#7068FF',
        borderRadius: 8,
        marginLeft: 12,
    },
    buttonPressable: {
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
