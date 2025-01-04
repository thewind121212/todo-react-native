import { StyleSheet, Text, View, TextInput as RNTextInput } from 'react-native'
import React from 'react'


interface Props {
    mainTaskName: string
    setMainTaskName: (value: string) => void
    placeHolder?: string
    isSheetDirty: boolean
}

const TextInput: React.FC<Props> = ({ mainTaskName, setMainTaskName, placeHolder = "Place Holder Not Found", isSheetDirty }) => {
    const [foucs, setFocus] = React.useState(false)

    return (
        <RNTextInput
            style={[styles.input, { borderBottomColor: (isSheetDirty && mainTaskName.length === 0) ? "#F67280" : (foucs || mainTaskName.length > 0) ? "#7068FF" : "#BBBBD4" }]}
            placeholder={isSheetDirty && mainTaskName.length === 0 ? "Main task require" : placeHolder}
            keyboardType="default"
            value={mainTaskName}
            onChangeText={setMainTaskName}
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
            placeholderTextColor={isSheetDirty && mainTaskName.length === 0 ? "#F67280" : '#BBBBD4'}
        />
    )
}

export default TextInput

const styles = StyleSheet.create({
    input: {
        width: "100%",
        height: 54,
        backgroundColor: "#222239",
        color: "white",
        fontSize: 18,
        borderBottomColor: "#BBBBD4",
        borderBottomWidth: 2,
        marginTop: 8,
        fontWeight: "500"
    }
})