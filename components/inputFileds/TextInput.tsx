import { StyleSheet, Text, View, TextInput as RNTextInput } from 'react-native'
import React from 'react'


interface Props {
    mainTaskName: string
    setMainTaskName: (value: string) => void
}

const TextInput: React.FC<Props> = ({ mainTaskName, setMainTaskName }) => {
    const [foucs, setFocus] = React.useState(false)


    return (
        <RNTextInput
            style={[styles.input, { borderBottomColor: foucs || mainTaskName.length > 0 ? "#7068FF" : "white" }]}
            placeholder="Enter Main Task Name"
            keyboardType="default"
            value={mainTaskName}
            onChangeText={setMainTaskName}
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
            placeholderTextColor={'#4D4C71'}
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
        borderBottomColor: "#545466",
        borderBottomWidth: 1,
        marginTop: 8,
        fontWeight: "500"
    }
})