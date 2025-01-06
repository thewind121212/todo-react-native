import { StyleSheet,  TextInput as RNTextInput } from 'react-native'
import React from 'react'
import { useCreateMainTaskStore } from '@/store/createMainTask'


interface Props {
    placeHolder?: string
    isSheetDirty: boolean
}

const TextInput: React.FC<Props> = ({ placeHolder = "Place Holder Not Found", isSheetDirty }) => {
    const [foucs, setFocus] = React.useState(false)
    const { name, setName } = useCreateMainTaskStore()

    return (
        <RNTextInput
            style={[styles.input, { borderBottomColor: (isSheetDirty && name.length === 0) ? "#F67280" : (foucs || name.length > 0) ? "#7068FF" : "#BBBBD4" }]}
            placeholder={isSheetDirty && name.length === 0 ? "Name task require" : placeHolder}
            keyboardType="default"
            value={name}
            onChangeText={setName}
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
            placeholderTextColor={isSheetDirty && name.length === 0 ? "#F67280" : '#BBBBD4'}
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