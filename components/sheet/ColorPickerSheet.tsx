import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ActionSheet, { FlatList, SheetManager } from 'react-native-actions-sheet';
import Button from '../Button';
import ColorPicker from '../inputFileds/ColorPicker';

import colorData from "../../data/colors.json"
import { useColorsStore } from '@/store/colors';


const ColorPickerSheet = () => {
    const { setColoPick, colorPicked } = useColorsStore()
    const [localSheetPick, setLocalSheetPick] = React.useState<string>(colorPicked)

    return (
        <ActionSheet containerStyle={{ backgroundColor: "#222239", height: "auto" }}
            onClose={() => {
                setLocalSheetPick(colorPicked)
            }}
        >

            <View style={{ height: "auto", padding: 10, paddingBottom: 40 }}>
                <Text style={{ color: "white", fontSize: 24, textAlign: "center" }}>Colors</Text>
                <Text style={{ color: "#ACABB4", marginTop: 20, marginBottom: 8, fontWeight: 500 }}>Macaron Colors</Text>
                <View style={{ width: '100%' }}>
                    <FlatList
                        style={{ width: '100%', display: 'flex' }}
                        contentContainerStyle={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', gap: 4 }}
                        data={colorData.BRAND_COLOR_SETS['Macaron Colors']}
                        keyExtractor={(item) => item}
                        renderItem={({ item }) => {
                            return (
                                <ColorPicker colorValue={item} setColorValue={() => setLocalSheetPick(item)} selectedColor={localSheetPick} />
                            )
                        }}

                    ></FlatList>

                </View>
                <Text style={{ color: "#ACABB4", marginTop: 20, marginBottom: 8, fontWeight: 500 }}>Morandi Colors</Text>
                <View style={{ width: '100%' }}>
                    <FlatList
                        style={{ width: '100%', display: 'flex' }}
                        contentContainerStyle={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', gap: 4 }}
                        data={colorData.BRAND_COLOR_SETS['Morandi Colors']}
                        keyExtractor={(item) => item}
                        renderItem={({ item }) => {
                            return (
                                <ColorPicker colorValue={item} setColorValue={() => setLocalSheetPick(item)} selectedColor={localSheetPick} />
                            )
                        }}

                    ></FlatList>

                </View>


                <Text style={{ color: "#ACABB4", marginTop: 20, marginBottom: 8, fontWeight: 500 }}>Classic Colors</Text>
                <View style={{ width: '100%' }}>
                    <FlatList
                        style={{ width: '100%', display: 'flex' }}
                        contentContainerStyle={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', gap: 4 }}
                        data={colorData.BRAND_COLOR_SETS['Classic Colors']}
                        keyExtractor={(item) => item}
                        renderItem={({ item }) => {
                            return (
                                <ColorPicker colorValue={item} setColorValue={() => setLocalSheetPick(item)} selectedColor={localSheetPick} />
                            )
                        }}

                    ></FlatList>
                </View>


                <Text style={{ color: "#ACABB4", marginTop: 20, marginBottom: 8, fontWeight: 500 }}>Memphis Colors</Text>
                <View style={{ width: '100%' }}>
                    <FlatList
                        style={{ width: '100%', display: 'flex' }}
                        contentContainerStyle={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', gap: 4 }}
                        data={colorData.BRAND_COLOR_SETS['Memphis']}
                        keyExtractor={(item) => item}
                        renderItem={({ item }) => {
                            return (
                                <ColorPicker colorValue={item} setColorValue={() => setLocalSheetPick(item)} selectedColor={localSheetPick} />
                            )
                        }}

                    ></FlatList>

                </View>
                <View style={{ width: "100%", height: "auto", display: "flex", flexDirection: "row", justifyContent: "flex-end", alignItems: "center", paddingHorizontal: 10, gap: 24, marginTop: 30 }} >
                    <Button tittle="Cancel" onPressHandler={() => {
                        SheetManager.hide('color-picker-sheet')
                    }} isPrimary={false} />
                    <Button tittle="Set Day" onPressHandler={() => {
                        setColoPick(localSheetPick)
                        SheetManager.hide('color-picker-sheet')
                    }} />
                </View>

            </View>
        </ActionSheet>
    );
}

export default ColorPickerSheet

const styles = StyleSheet.create({})