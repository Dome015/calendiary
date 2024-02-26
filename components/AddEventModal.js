import { useState, useEffect } from "react";
import { StyleSheet, View, Text, Modal, Pressable, TextInput, Switch } from "react-native";
import { Colours, getFormattedDate, getFormattedTime, notificationHourOffset, notificationMinuteOffset, scheduleEventNotification } from "../common";
import DatePicker from "react-native-date-picker";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AddEventFormButton from "./AddEventFormButton";
import { insertEvent, updateEvent } from "../db/database";
import EditEventFormButton from "./EditEventFormButton";

function AddEventModal({ show, setShow, onAdd, eventToEdit, setEventToEdit, onEdit }) {
    const [description, setDescription] = useState("");
    const [date, setDate] = useState(new Date());
    const [openDatePicker, setOpenDatePicker] = useState(false);
    const [openTimePicker, setOpenTimePicker] = useState(false);
    const [notification, setNotification] = useState(true);

    const reset = () => {
        // Set initial values
        if (eventToEdit) {
            setDescription(eventToEdit.description);
            setDate(new Date(eventToEdit.date));
            setNotification(eventToEdit.notification);
        } else {
            setDescription("");
            setNotification(true);
        }
        
    }

    useEffect(() => reset(), [show]);

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
        try {
            // Add event to db
            const newEvent = {
                description: description,
                date: date.toISOString(),
                notification: notification
            };
            const eventId = await insertEvent(newEvent);
            newEvent.id = eventId;
            // Schedule notification if necessary
            if (newEvent.notification) {
                scheduleEventNotification(newEvent, notificationHourOffset, notificationMinuteOffset);
            }
            // Update parent state
            onAdd(newEvent);
        } catch (e) {
            console.log(e);
        }
        setShow(false);
    }

    const onEditEvent = async () => {
        try {
            // Edit event on the db
            const newEvent = {
                id: eventToEdit.id,
                description: description,
                date: date.toISOString(),
                notification: notification
            };
            await updateEvent(newEvent);
            // Schedule notification if necessary
            if (newEvent.notification)
                scheduleEventNotification(newEvent, notificationHourOffset, notificationMinuteOffset);
            // Update parent state
            onEdit(newEvent);
        } catch (e) {
            console.log(e);
        }
        setShow(false);
    }

    const onClose = () => {
        setEventToEdit(null);
        setShow(false);
    }

    return (
        <Modal visible={show} animationType="fade" transparent={true} onRequestClose={onClose}>
            <View style={styles.centeredView} behavior="height">
                <View style={styles.modalTitleView}>
                    <Text style={styles.modalTitleText}>{eventToEdit ? "Edit event" : "Add event"}</Text>
                    <Pressable onPress={onClose}>
                        <Icon name="close" size={25} color="white"></Icon>
                    </Pressable>
                </View>
                {/* Event date/time */}
                <View style={styles.modalBodyView}>
                    <View style={styles.formRowView}>
                        <View style={{ flex: 0.1, display: "flex", flexDirection: "row" }}>
                            <Icon name="calendar" color={Colours.inactive} size={25} />
                        </View>
                        <Pressable style={[styles.formDateInputView, { flex: 0.6, marginStart: "2%" }]} onPress={() => setOpenDatePicker(true)}>
                            <Text style={styles.formTextInput}>{getFormattedDate(date)}</Text>
                        </Pressable>
                        <Pressable style={[styles.formDateInputView, { flex: 0.4, marginStart: "2%" }]} onPress={() => setOpenTimePicker(true)}>
                            <Text style={styles.formTextInput}>{getFormattedTime(date)}</Text>
                        </Pressable>
                    </View>
                    <View style={styles.formRowView}>
                        <View style={styles.formTextInputView}>
                            <TextInput style={styles.formTextInput} placeholder="Description" value={description} onChangeText={text => setDescription(text)} multiline />
                        </View>
                    </View>
                    <View style={styles.formRowView}>
                        <View style={{ flex: 0.1, display: "flex", flexDirection: "row" }}>
                            <Icon name={notification ? "bell-ring" : "bell"} color={Colours.inactive} size={25} />
                        </View>
                        <View style={{ flex: 0.7, display: "flex", flexDirection: "row" }}>
                            <Text style={styles.formTextLabelText}>Notification</Text>
                        </View>
                        <View style={{ flex: 0.2, display: "flex", flexDirection: "row", justifyContent: "flex-end" }}>
                            <Switch
                                trackColor={{ true: `color-mix(in srgb, ${Colours.main} 50%, black)`, false: `color-mix(in srgb, ${Colours.inactive} 50%, black)` }}
                                thumbColor={notification ? Colours.main : Colours.inactive}
                                onValueChange={() => setNotification(notification => !notification)}
                                value={notification}
                            />
                        </View>
                    </View>
                    <View style={[styles.formRowView, { marginBottom: 0 }]}>
                        { eventToEdit ? <EditEventFormButton onPress={onEditEvent} /> : <AddEventFormButton onPress={onAddEvent} /> }
                    </View>
                </View>
                <DatePicker modal key={0} mode="date" open={openDatePicker} date={date} minimumDate={new Date()} onConfirm={onConfirmDatePick} onCancel={() => setOpenDatePicker(false)} />
                <DatePicker modal key={1} mode="time" open={openTimePicker} date={date} onConfirm={onConfirmTimePick} onCancel={() => setOpenTimePicker(false)} />
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    centeredView: {
        justifyContent: 'center',
        alignItems: 'center',
        display: "flex",
        flexDirection: "column",
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        padding: "5%"
    },
    modalTitleView: {
        padding: "4%",
        backgroundColor: "#0066ff",
        width: "100%",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        alignSelf: "auto",
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.5,
        shadowRadius: 4,
        elevation: 5,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    modalTitleText: {
        color: "white",
        fontSize: 20,
        fontWeight: "bold"
    },
    modalBodyView: {
        padding: "4%",
        backgroundColor: "white",
        width: "100%",
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        alignSelf: "auto",
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    formView: {
        margin: "3%"
    },
    formRowView: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        marginBottom: "5%"
    },
    titleRowView: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
    },
    formTextLabelView: {
        flex: 0.2
    },
    formTextInputView: {
        backgroundColor: "#ededed",
        width: "100%",
        borderRadius: 5,
        padding: "3%",
        paddingTop: "1%",
        paddingBottom: "1%"
    },
    formDateInputView: {
        backgroundColor: "#ededed",
        padding: "3%",
        paddingTop: "4%",
        paddingBottom: "4%",
        borderRadius: 5,
    },
    formTextLabelText: {
        fontSize: 20,
    },
    formTextInput: {
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

export default AddEventModal;