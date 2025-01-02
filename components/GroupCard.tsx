import { StyleSheet, Text, View } from 'react-native'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import React from 'react'


interface Props {
    mainTaskName: string
    color: string
    isHabit?: boolean
}

const GroupCard = ({ mainTaskName, color, isHabit = true }: Props) => {
    return (
        <View style={styles.mainGroupTaskCard}>
            <View style={{ display: "flex", flexDirection: "row", gap: 8, alignItems: "center" }}>
                <View style={{ width: 24, height: 24 }}>
                    {
                        isHabit ? (
                            <MaterialIcons name="autorenew" size={24} color="white" />
                        ) : (
                            <FontAwesome5 name="tasks" size={24} color="white" />
                        )
                    }
                </View>
                <Text style={{ color: "#FFFFFF", fontSize: 18, fontWeight: "400" }}>{mainTaskName}</Text>
            </View>
            <View style={{ width: 30, height: 30, backgroundColor: color, borderRadius: 61, display: "flex", justifyContent: "center", alignContent: "center" }}>
            </View>
        </View>
    )
}

export default GroupCard

const styles = StyleSheet.create({
    mainGroupTaskCard: {
        width: '100%',
        paddingVertical: 18,
        backgroundColor: '#222239',
        borderRadius: 8,
        paddingRight: 20,
        paddingLeft: 24,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        position: "relative",
        overflow: 'hidden'

    }

})