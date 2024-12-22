import { ColorValue, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import CircularProgress from './CircleProgress'


const OverviewHomeTask = () => {
    return (
        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%', aspectRatio: '2/1', gap: 12, backgroundColor: '#222239', borderRadius: 16, overflow: 'hidden', marginBottom: 20 }}>
            <View style={{ width: "50%", height: "100%", position: 'relative' }}>
                <View style={{ position: 'absolute', top: 0, left: 0, flex: 1, justifyContent: 'center', alignItems: 'center', display: 'flex', width: "100%", height: "100%" }}>
                    <CircularProgress progress={70} strokeWidth={12} strokeWidthFull={6} size={(160)} animationDirection="clockwise" rotate='-90' color='#3068DF' />
                </View>
                <View style={{ position: 'absolute', top: 0, left: 0, flex: 1, justifyContent: 'center', alignItems: 'center', display: 'flex', width: "100%", height: "100%" }}>
                    <CircularProgress progress={80} strokeWidth={12} strokeWidthFull={6} size={(120)} animationDirection="clockwise" rotate='-90' color='#FE7348' />
                </View>
                <View style={{ position: 'absolute', top: 0, left: 0, flex: 1, justifyContent: 'center', alignItems: 'center', display: 'flex', width: "100%", height: "100%" }}>
                    <CircularProgress progress={40} strokeWidth={12} strokeWidthFull={6} size={(80)} animationDirection="clockwise" rotate='-90' color='#63F4F7' />
                </View>
            </View>
            <View style={{ width: "50%", height: "100%", position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#222239' }}>
                <View style={{ width: "100%", height: 160, display: "flex", flexDirection: 'column', justifyContent: "center", alignItems: "center", gap: 12 }} >
                    <TaskInfoRight percent={70} content="All task" color="#3068DF" />
                    <TaskInfoRight percent={80} content="Shakuro" color="#FE7348" />
                    <TaskInfoRight percent={40} content="Documo" color="#63F4F7" />
                </View>
            </View>
        </View>
    )
}

export default OverviewHomeTask



function TaskInfoRight({ percent, content, color }: { percent: number, content: string, color: ColorValue }) {
    return (
        <View style={{ width: "100%", height: 'auto', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'row', gap: 12, paddingRight: 30 }}>
            <View style={{ width: 16, height: 16, borderRadius: "50%", backgroundColor: color }} />
            <Text style={{ fontSize: 18, color: '#fff', fontWeight: 600 }}>{content}</Text>
            <Text style={{ fontSize: 18, fontWeight: 600, marginLeft: "auto", color: "#737379" }}>{percent}%</Text>
        </View>
    )
}


const styles = StyleSheet.create({})