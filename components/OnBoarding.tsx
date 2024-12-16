import { View, Text, StyleSheet, Pressable, FlatList } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useSpring, animated } from '@react-spring/native';
import Carousel from 'react-native-reanimated-carousel';
import LottieView from 'lottie-react-native';



const dotPage = ['dot0', 'dot1', 'dot2']
const imagePage = ['image0', 'image1', 'image2']

const headerText = ['Plan your schedules easily', 'Make your day become more productive ', 'Manager all your daily tasks']

const contentText = ['Planing your routine and it will become a habit that lead you to sucess path', 'Make your day become more productive and you will have more time to do what you love', 'Manager all your daily tasks and you will have more time to do what you love']


type Props = {}

export default function OnBoarding(props: Props) {
    const [isPress, setIsPress] = useState<boolean>(false)
    const [currentPage, setCurrentPage] = useState<number>(0)
    const carouselRef = useRef<any>(null)





    const pressAnimation = useSpring({
        scale: isPress ? 1.2 : 1,
        config: {
            tension: 1000,
            friction: 30,
            mass: 0.2,
        }
    })

    const pressHandler = () => {
        setIsPress(true)
        if (currentPage === 2) {
            setCurrentPage(0)
            return
        }
        setCurrentPage(currentPage + 1)
    }


    useEffect(() => {
        carouselRef.current?.scrollTo({ index: currentPage, animated: true })
    }, [currentPage])



    const AnimatedView = animated(View)

    const renderItem = ({ index }: { index: number }) => {
        return (
            <View
                style={[
                    styles.onboarding_item_count,
                    currentPage === index ? { width: 35, backgroundColor: '#fff' } : null,
                ]}
            />
        );
    };


    return (
        <View style={[styles.root_container]}>
            <View style={styles.wrapper}>
                <View style={styles.skip_button}>
                    <Pressable
                        style={{ width: '100%', height: '100%', justifyContent: 'flex-end', alignItems: 'center', display: 'flex', flexDirection: 'row', gap: 8 }}
                    >
                        <Text style={styles.skip_text}>Skip</Text>
                        <FontAwesome6 name="chevron-right" size={14} color="white" />
                    </Pressable>
                </View>
                <View style={styles.onboarding_item}>
                    <Carousel
                        width={400}
                        style={{ marginTop: 160 }}
                        enabled={false}
                        loop={false}
                        height={400}
                        data={imagePage}
                        ref={carouselRef}
                        scrollAnimationDuration={1000}
                        defaultIndex={0}
                        renderItem={({ index }) => (
                            <View
                                style={{
                                    flex: 1,
                                }}
                            >
                                {index === 0 && <LottieView source={require(`@/assets/animationFiles/animation-1.json`)} autoPlay loop style={{ width: 400, height: 400, marginLeft: 'auto', marginRight: 'auto' }} />}
                                {index === 1 && <LottieView source={require(`@/assets/animationFiles/animation-2.json`)} autoPlay loop style={{ width: 400, height: 400, marginLeft: 'auto', marginRight: 'auto' }} />}
                                {index === 2 && <LottieView source={require(`@/assets/animationFiles/animation-3.json`)} autoPlay loop style={{ width: 400, height: 400, marginLeft: 'auto', marginRight: 'auto' }} />}
                            </View>
                        )}
                    />
                    <View style={styles.onboarding_item_info}>
                        <Text style={styles.onboarding_item_header}>{headerText[currentPage]}</Text>
                        <Text style={styles.onboarding_item_content}>{contentText[currentPage]}</Text>
                        <View style={styles.onboarding_item_count_wrap}>
                            <FlatList
                                data={dotPage}
                                renderItem={renderItem}
                                keyExtractor={(item) => item.toString()}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={{ justifyContent: 'center', alignContent: 'center', display: 'flex', flexDirection: 'row', gap: 4, width: '100%' }}
                            />
                        </View>
                        <View style={{ width: '100%', height: 60, display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', position: 'absolute', bottom: 80, left: 32 }}>
                            <AnimatedView style={[styles.onboarding_item_button, { transform: [{ scale: pressAnimation.scale }] }]}>
                                <Pressable
                                    style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}
                                    onPressIn={pressHandler}
                                    onPressOut={() => setIsPress(false)}
                                >
                                    <FontAwesome6 name="arrow-right" size={24} color="white" />
                                </Pressable>
                            </AnimatedView>
                        </View>
                    </View>
                </View>
            </View>
        </View >
    )
}

const styles = StyleSheet.create({
    skip_button: {
        position: 'absolute',
        right: 32,
        top: 64,
    },
    skip_text: {
        color: '#fff',
        fontSize: 18,
    },
    root_container: {
        position: 'fixed',
        zIndex: 1000,
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: '#1A182C',
    },
    wrapper: {
        display: 'flex',
        position: 'relative',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        width: '100%',
    },
    onboarding_item: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        width: '100%',
        height: '100%',
        position: 'absolute',
    },
    onboarding_item_info: {
        alignSelf: 'flex-end',
        width: '100%',
        overflow: 'hidden',
        height: '42%',
        backgroundColor: '#222239',
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        display: 'flex',
        position: 'relative',
        flexDirection: 'column',
        gap: 16,
        padding: 32,
    },
    onboarding_item_header: {
        color: '#fff',
        fontSize: 32,

    },
    onboarding_item_content: {
        color: '#92919D',
        fontSize: 16,
        lineHeight: 24,
    },
    onboarding_item_count_wrap: {
        width: '100%',
        position: 'absolute',
        left: 32,
        bottom: 160,
        justifyContent: 'center',
        alignContent: 'center',
        height: 6,
        display: 'flex',
        flexDirection: 'row',
        marginTop: 18,
        gap: 4,
    },
    onboarding_item_count: {
        width: 15,
        borderRadius: 100,
        height: '100%',
        backgroundColor: '#676776',
        transitionDuration: '0.2s',
    },
    onboarding_item_button: {
        width: 60,
        borderRadius: 12,
        marginTop: 18,
        height: 60,
        backgroundColor: '#6D65F8',
    },
})





