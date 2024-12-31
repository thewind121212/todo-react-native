import { StyleSheet, Text, View, TextInput as RNTextInput } from 'react-native'
import React from 'react'


interface Props {
    mainTaskName: string
    setMainTaskName: (value: string) => void
    placeHolder?: string
}

const TextInput: React.FC<Props> = ({ mainTaskName, setMainTaskName, placeHolder = "Place Holder Not Found" }) => {
    const [foucs, setFocus] = React.useState(false)


    return (
        <RNTextInput
            style={[styles.input, { borderBottomColor: foucs || mainTaskName.length > 0 ? "#BBBBD4" : "white" }]}
            placeholder={placeHolder}
            keyboardType="default"
            value={mainTaskName}
            onChangeText={setMainTaskName}
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
            placeholderTextColor={'#BBBBD4'}
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
        borderBottomWidth: 1,
        marginTop: 8,
        fontWeight: "500"
    }
})