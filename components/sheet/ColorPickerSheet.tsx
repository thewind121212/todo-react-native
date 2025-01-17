import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ActionSheet, { FlatList, SheetManager } from 'react-native-actions-sheet';
import Button from '../Button';
import ColorPicker from '../inputFileds/ColorPicker';
import colorData from "../../data/colors.json";

const ColorPickerSheet = React.memo(() => {

    const renderColorSection = (title: string, colors: string[]) => (
        <>
            <Text style={styles.sectionTitle}>{title}</Text>
            <FlatList
                style={styles.flatList}
                contentContainerStyle={styles.flatListContent}
                data={colors}
                keyExtractor={(item) => item}
                renderItem={({ item }) => <ColorPicker colorValue={item} />}
                horizontal
            />
        </>
    );


    return (
        <ActionSheet containerStyle={styles.sheetContainer}
            closable={true}
            keyboardHandlerEnabled={false}
        >
            <View style={styles.container}>
                <Text style={styles.header}>Colors</Text>
                {renderColorSection('Macaron Colors', colorData.BRAND_COLOR_SETS['Macaron Colors'])}
                {renderColorSection('Morandi Colors', colorData.BRAND_COLOR_SETS['Morandi Colors'])}
                {renderColorSection('Classic Colors', colorData.BRAND_COLOR_SETS['Classic Colors'])}
                {renderColorSection('Memphis Colors', colorData.BRAND_COLOR_SETS['Memphis'])}
                <View style={styles.buttonContainer}>
                    <Button
                        title="Cancel"
                        onPressHandler={() => SheetManager.hide('color-picker-sheet')}
                        isPrimary={false}
                    />
                    <Button
                        title="Set Color"
                        onPressHandler={() => SheetManager.hide('color-picker-sheet')}
                    />
                </View>
            </View>
        </ActionSheet>
    );
});

export default ColorPickerSheet;

const styles = StyleSheet.create({
    sheetContainer: {
        backgroundColor: '#222239',
        height: 'auto',
    },
    container: {
        padding: 10,
        paddingBottom: 40,
    },
    header: {
        color: 'white',
        fontSize: 24,
        textAlign: 'center',
    },
    sectionTitle: {
        color: '#ACABB4',
        marginTop: 20,
        marginBottom: 8,
        fontWeight: '500',
    },
    flatList: {
        width: '100%',
    },
    flatListContent: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        gap: 4,
    },
    buttonContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingHorizontal: 10,
        gap: 24,
        marginTop: 30,
    },
});
