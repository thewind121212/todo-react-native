import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'

type Props = {
    isShowSubTitle: boolean
    mainTitle: string
    subTitle: string
    isShowBoxCount?: boolean
    boxCount?: number
    onPressHandler?: () => void
}

const BlockHeader = ({ isShowSubTitle, mainTitle, subTitle, onPressHandler, isShowBoxCount = false, boxCount = 0 }: Props) => {
    return (
        <View style={styles.blockHeader}>
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'center' }}>
                <Text style={{ fontSize: 22, color: '#fff' }}>{mainTitle}</Text>
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