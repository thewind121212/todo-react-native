import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
    Dimensions,
    Pressable,
    StyleSheet,
    Text,
    View,
    FlatList
} from 'react-native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Carousel from 'react-native-reanimated-carousel';
import LottieView from 'lottie-react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
}
    from 'react-native-reanimated';
import { useOnboardingPersisStore } from '@/store/useOnboarding';
import { configureReanimatedLogger, ReanimatedLogLevel } from 'react-native-reanimated';

configureReanimatedLogger({
    level: ReanimatedLogLevel.warn,
    strict: true,
});

const DOT_PAGES = ['dot0', 'dot1', 'dot2'];
const ANIMATIONS = [
    { key: 'animation1', source: require('@/assets/animationFiles/animation-1.json') },
    { key: 'animation2', source: require('@/assets/animationFiles/animation-2.json') },
    { key: 'animation3', source: require('@/assets/animationFiles/animation-3.json') },
];
const HEADER_TEXT = [
    'Plan your schedules easily',
    'Make your day become more productive',
    'Manage all your daily tasks'
];
const CONTENT_TEXT = [
    'Planning your routine will become a habit that leads you to a success path.',
    'Make your day more productive and have more time to do what you love.',
    'Manage all your daily tasks and have more time to do what you love.'
];

const OnBoarding = React.memo(() => {
    const [isReady, setIsReady] = useState(false);
    const { isFinished, setFinished } = useOnboardingPersisStore();
    const [currentPage, setCurrentPage] = useState<number>(0);
    const scale = useSharedValue(1);
    const translateYInfo = useSharedValue(100);
    const carouselRef = useRef<any>(null);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const { height } = Dimensions.get('window');

    const containerTop = useSharedValue(0);
    const heroOpacity = useSharedValue(0);

    const containerTopStyle = useAnimatedStyle(() => ({
        top: containerTop.value,
    }));

    const scaleStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const translateYStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateYInfo.value }],
    }));

    const heroOpacityStyle = useAnimatedStyle(() => ({
        opacity: heroOpacity.value,
    }));

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsReady(true);
        }, 200);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (isReady) {
            translateYInfo.value = withSpring(0, { damping: 100, stiffness: 100 });
            heroOpacity.value = withSpring(1, { damping: 100, stiffness: 100 });
        }
    }, [isReady, translateYInfo, heroOpacity]);

    const pressHandler = useCallback((direction: 'left' | 'right' = 'right') => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        scale.value = withSpring(1.2, { damping: 10, stiffness: 100 });
        if (currentPage === 2 && direction === 'right') {
            containerTop.value = withSpring(height, { damping: 10, stiffness: 100 });
            timerRef.current = setTimeout(() => {
                setFinished();
            }, 500);
            return;
        }
        if (currentPage === 0 && direction === 'left') {
            return;
        }
        direction === 'right' ? setCurrentPage(prev => prev + 1) : setCurrentPage(prev => prev - 1);
    }, [currentPage, containerTop, height, scale, setFinished]);

    const pressOutHandler = useCallback(() => {
        scale.value = withSpring(1, { damping: 10, stiffness: 100 });
    }, [scale]);

    useEffect(() => {
        carouselRef.current?.scrollTo({ index: currentPage, animated: true });
    }, [currentPage]);

    const renderDot = useCallback(({ index }: { index: number }) => (
        <View
            key={`dot-${index}`}
            style={[
                styles.onboardingDot,
                currentPage === index && styles.activeDot
            ]}
        />
    ), [currentPage]);

    return (
        <Animated.View style={[styles.rootContainer, containerTopStyle]}>
            <View style={styles.wrapper}>
                <Animated.View style={[styles.skipButton, heroOpacityStyle]}>
                    <Pressable
                        style={styles.skipPressable}
                        onTouchStart={setFinished}
                    >
                        <Text style={styles.skipText}>Skip</Text>
                        <FontAwesome6 name="chevron-right" size={14} color="white" />
                    </Pressable>
                </Animated.View>
                <View style={styles.onboardingItem}>
                    <Animated.View style={[styles.carouselContainer, heroOpacityStyle]}>
                        <Carousel
                            width={400}
                            height={400}
                            data={ANIMATIONS}
                            ref={carouselRef}
                            loop={false}
                            autoPlay={false}
                            scrollAnimationDuration={1000}
                            defaultIndex={0}
                            renderItem={({ item }) => (
                                <View style={styles.carouselItem}>
                                    <LottieView
                                        source={item.source}
                                        autoPlay
                                        loop
                                        style={styles.lottieView}
                                    />
                                </View>
                            )}
                        />
                    </Animated.View>
                    <Animated.View style={[styles.onboardingInfo, translateYStyle]}>
                        <Text style={styles.headerText}>{HEADER_TEXT[currentPage]}</Text>
                        <Text style={styles.contentText}>{CONTENT_TEXT[currentPage]}</Text>
                        <View style={styles.dotContainer}>
                            <FlatList
                                data={DOT_PAGES}
                                renderItem={renderDot}
                                keyExtractor={(item) => item}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.flatListContent}
                            />
                        </View>
                        <View style={styles.buttonContainer}>
                            {currentPage !== 0 && (
                                <Animated.View style={[styles.navButton, scaleStyle, styles.leftButton]}>
                                    <Pressable
                                        style={styles.navPressable}
                                        onPressIn={() => pressHandler('left')}
                                        onPressOut={pressOutHandler}
                                    >
                                        <FontAwesome6 name="arrow-right" size={24} color="white" />
                                    </Pressable>
                                </Animated.View>
                            )}
                            <Animated.View style={[styles.navButton, scaleStyle, styles.rightButton]}>
                                <Pressable
                                    style={styles.navPressable}
                                    onPressIn={() => pressHandler('right')}
                                    onPressOut={pressOutHandler}
                                >
                                    <FontAwesome6 name="arrow-right" size={24} color="white" />
                                </Pressable>
                            </Animated.View>
                        </View>
                    </Animated.View>
                </View>
            </View>
        </Animated.View>
    );
});

export default OnBoarding;

const styles = StyleSheet.create({
    rootContainer: {
        position: 'absolute',
        zIndex: 1000,
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: '#1A182C',
    },
    wrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    skipButton: {
        position: 'absolute',
        top: 64,
        right: 32,
    },
    skipPressable: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        width: '100%',
        height: '100%',
        justifyContent: 'flex-end',
    },
    skipText: {
        color: '#fff',
        fontSize: 18,
    },
    onboardingItem: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        justifyContent: 'flex-end',
    },
    carouselContainer: {
        width: '100%',
        height: 520,
        marginTop: '25%',
        alignSelf: 'center',
    },
    carouselItem: {
        flex: 1,
    },
    lottieView: {
        width: 400,
        height: 400,
        alignSelf: 'center',
    },
    onboardingInfo: {
        width: '100%',
        height: '42%',
        backgroundColor: '#222239',
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        padding: 32,
        gap: 16,
        position: 'relative',
        overflow: 'hidden',
    },
    headerText: {
        color: '#fff',
        fontSize: 32,
    },
    contentText: {
        color: '#92919D',
        fontSize: 16,
        lineHeight: 24,
    },
    dotContainer: {
        position: 'absolute',
        bottom: 160,
        left: 32,
        height: 6,
        flexDirection: 'row',
        gap: 4,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    onboardingDot: {
        width: 15,
        height: '100%',
        borderRadius: 100,
        backgroundColor: '#676776',
    },
    activeDot: {
        width: 35,
        backgroundColor: '#fff',
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 80,
        left: 32,
        width: '100%',
        height: 60,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    navButton: {
        width: 60,
        height: 60,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    leftButton: {
        backgroundColor: '#FCC760',
    },
    rightButton: {
        backgroundColor: '#6D65F8',
        marginLeft: 'auto',
    },
    navPressable: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    flatListContent: {
        flexDirection: 'row',
        gap: 4,
        justifyContent: 'center',
    },
});
