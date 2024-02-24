import { View, Text, TextInput, Pressable, Switch } from "react-native";
import { StyleSheet } from "react-native";
import { getFormattedDate, getFormattedTime, notificationHourOffset, notificationMinuteOffset, scheduleEventNotification } from "../common";
import { useState, useCallback } from "react";
import DatePicker from "react-native-date-picker";
import { insertEvent } from "../db/database";
import { useFocusEffect } from "@react-navigation/native";

function AddEventForm({ navigation, route }) {
    return (
        <View>
            <Text>Hi</Text>
        </View>
    )
}

function AddEventButton({ onAddEvent }) {

    return (
        <Pressable style={styles.addEventButtonPressable} onPress={onAddEvent}>
            <Text style={styles.addEventButtonText}>Add</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    formView: {
        margin: "3%"
    },
    formRowView: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        marginBottom: "3%"
    },
    formTextLabelView: {
        flex: 0.2
    },
    formTextInputView: {
        backgroundColor: "white",
        width: "100%",
        borderRadius: 5,
        padding: "3%",
        paddingTop: "1%",
        paddingBottom: "1%"
    },
    formDateInputView: {
        backgroundColor: "white",
        padding: "3%",
        paddingTop: "4%",
        paddingBottom: "4%",
        borderRadius: 5,
    },
    formTextLabelText: {
        color: "#8c8c8c",
        fontSize: 20,
    },
    formTextInput: {
        color: "#8c8c8c",
        fontSize: 20,
    },
    addEventButtonPressable: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#333333",
        padding: "2%",
        height: 60,
        borderRadius: 10,
        marginTop: "auto",
        flex: 1
    },
    addEventButtonText: {
        color: "white",
        fontSize: 25
    }
});

export default AddEventForm;