import { View, Text, TextInput, Pressable, Switch } from "react-native";
import { StyleSheet } from "react-native";
import { getFormattedDate, getFormattedTime } from "../common";
import { useEffect, useState } from "react";
import DatePicker from "react-native-date-picker";
import { insertEvent } from "../db/database";

function AddEventForm({ navigation, route }) {
    const [description, setDescription] = useState("My event");
    const [date, setDate] = useState(new Date(route.params.date));
    const [openDatePicker, setOpenDatePicker] = useState(false);
    const [openTimePicker, setOpenTimePicker] = useState(false);
    const [notification, setNotification] = useState(true);

    useEffect(() => console.log("Hello add!"), []);

    const onConfirmDatePick = pickedDate => {
        setDate(date =>
            new Date(pickedDate.getFullYear(), pickedDate.getMonth(), pickedDate.getDate(), date.getHours(), date.getMinutes()));
        setOpenDatePicker(false);
    }

    const onConfirmTimePick = pickedTime => {
        setDate(date =>
            new Date(date.getFullYear(), date.getMonth(), date.getDate(), pickedTime.getHours(), pickedTime.getMinutes()));
        setOpenTimePicker(false);
    }

    const onAddEvent = async () => {
        const newEvent = {
            description: description,
            date: date.toISOString(),
            notification: notification
        };
        console.log(await insertEvent(newEvent));
        navigation.navigate("Home");
    }

    return (
        <View style={styles.formView}>
            <View style={styles.formRowView}>
                <Text style={styles.formTextLabelText}>Adding event</Text>
            </View>
            <View style={styles.formRowView}>
                <Text style={styles.formTextLabelText}>Description</Text>
            </View>
            <View style={styles.formRowView}>
                <View style={styles.formTextInputView}>
                    <TextInput style={styles.formTextInput} value={description} onChangeText={text => setDescription(text)} multiline />
                </View>
            </View>
            <View style={styles.formRowView}>
                <View style={styles.formTextLabelView}><Text style={styles.formTextLabelText}>Date</Text></View>
                <Pressable style={[styles.formDateInputView, { flex: 0.4 }]} onPress={() => setOpenDatePicker(true)}>
                    <Text style={styles.formTextInput}>{getFormattedDate(date)}</Text>
                </Pressable>
                <Pressable style={[styles.formDateInputView, { flex: 0.4, marginStart: "2%" }]} onPress={() => setOpenTimePicker(true)}>
                    <Text style={styles.formTextInput}>{getFormattedTime(date)}</Text>
                </Pressable>
            </View>
            <View style={styles.formRowView}>
                <View style={{ flex: 0.4 }}><Text style={styles.formTextLabelText}>Notification</Text></View>
                <View style={{ flex: 0.6, display: "flex", flexDirection: "row", justifyContent: "flex-start" }}>
                    <Switch
                        trackColor={{ true: '#33cc33', false: '#999999' }}
                        thumbColor={notification ? '#009933' : '#737373'}
                        onValueChange={() => setNotification(notification => !notification)}
                        value={notification}
                    />
                </View>
            </View>
            <View style={styles.formRowView}>
                <AddEventButton onAddEvent={onAddEvent} />
            </View>
            <DatePicker modal key={0} mode="date" open={openDatePicker} date={date} onConfirm={onConfirmDatePick} onCancel={() => setOpenDatePicker(false)} />
            <DatePicker modal key={1} mode="time" open={openTimePicker} date={date} onConfirm={onConfirmTimePick} onCancel={() => setOpenTimePicker(false)} />
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