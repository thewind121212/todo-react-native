import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'

type Props = {
    isShowSubTitle: boolean
    style? : any
    mainTitle: string
    subTitle: string
    isShowBoxCount?: boolean
    boxCount?: number
    onPressHandler?: () => void
}

const BlockHeader = ({ isShowSubTitle, mainTitle, subTitle, onPressHandler, isShowBoxCount = false, boxCount = 0, style }: Props) => {
    return (
        <View style={styles.blockHeader}>
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', ...style }}>
                <Text style={{ fontSize: 26, color: '#fff' }}>{mainTitle}</Text>
                {
                    isShowBoxCount && (
                        <View style={{ width: 32, height: 32, display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#222239', borderRadius: 6, marginLeft: 12 }}>
                            <Text style={{ fontSize: 18, color: '#fff' }}>{boxCount}</Text>
                        </View>
                    )
                }
            </View>
            {
                isShowSubTitle && (
                    <Pressable onPress={onPressHandler ? () => onPressHandler : undefined} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ fontSize: 18, color: "#94a3b8" }}>{subTitle}</Text>
                    </Pressable>
                )
            }
        </View>
    )
}

export default BlockHeader

const styles = StyleSheet.create({
    blockHeader: {
        width: '100%',
        height: 'auto',
        display: 'flex',
        flexDirection: 'row',
        marginBottom: 24,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
})