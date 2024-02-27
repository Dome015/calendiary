import { useState, useEffect } from "react";
import { StyleSheet, View, Text, Modal, Pressable, TextInput, Switch } from "react-native";
import { Colours, getDhm, getFormattedDate, getFormattedTime, getMinutes, notificationHourOffset, notificationMinuteOffset, scheduleEventNotification } from "../common";
import DatePicker from "react-native-date-picker";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { insertEvent, updateEvent } from "../db/database";
import FormButton from "./FormButton";

function AddEventModal({ show, setShow, onAdd, eventToEdit, setEventToEdit, onEdit }) {
    const [description, setDescription] = useState("");
    const [date, setDate] = useState(new Date());
    const [openDatePicker, setOpenDatePicker] = useState(false);
    const [openTimePicker, setOpenTimePicker] = useState(false);
    const [notification, setNotification] = useState(true);
    // Notification offset
    const [notificationDays, setNotificationDays] = useState("");
    const [notificationHours, setNotificationHours] = useState("60");
    const [notificationMins, setNotificationMins] = useState("");

    const reset = () => {
        // Set initial values
        if (eventToEdit) {
            setDescription(eventToEdit.description);
            setDate(new Date(eventToEdit.date));
            setNotification(eventToEdit.notification);
            const offsetData = getDhm(eventToEdit.notificationMinOffset);
            console.log(offsetData);
            setNotificationDays(offsetData.days.toString());
            setNotificationHours(offsetData.hours.toString());
            setNotificationMins(offsetData.minutes.toString());
        } else {
            setDescription("");
            setNotification(true);
            setNotificationDays("0");
            setNotificationHours("1");
            setNotificationMins("0");
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
            // Compute notification minute offset
            const notificationDaysN = notificationDays.length > 0 ? parseInt(notificationDays) : 0;
            const notificationHoursN = notificationHours.length > 0 ? parseInt(notificationHours) : 0;
            const notificationMinsN = notificationMins.length > 0 ? parseInt(notificationMins) : 0;
            const notificationMinOffset = getMinutes(notificationDaysN, notificationHoursN, notificationMinsN);
            // Add event to db
            const newEvent = {
                description: description,
                date: date.toISOString(),
                notification: notification,
                notificationMinOffset: notificationMinOffset
            };
            const eventId = await insertEvent(newEvent);
            newEvent.id = eventId;
            // Schedule notification if necessary
            if (newEvent.notification) {
                scheduleEventNotification(newEvent);
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
            // Compute notification minute offset
            const notificationDaysN = notificationDays.length > 0 ? parseInt(notificationDays) : 0;
            const notificationHoursN = notificationHours.length > 0 ? parseInt(notificationHours) : 0;
            const notificationMinsN = notificationMins.length > 0 ? parseInt(notificationMins) : 0;
            const notificationMinOffset = getMinutes(notificationDaysN, notificationHoursN, notificationMinsN);
            // Edit event on the db
            const newEvent = {
                id: eventToEdit.id,
                description: description,
                date: date.toISOString(),
                notification: notification,
                notificationMinOffset: notificationMinOffset
            };
            await updateEvent(newEvent);
            // Schedule notification if necessary
            if (newEvent.notification)
                scheduleEventNotification(newEvent);
            // Update parent state
            onEdit(newEvent);
        } catch (e) {
            console.log(e);
        }
        setShow(false);
    }

    const onCancelEditEvent = () => {

    }

    const onClose = () => {
        setEventToEdit(null);
        setShow(false);
    }

    const onNotificationDaysChange = text => {
        let days = parseInt(text);
        if (days) {
            days = Math.abs(days);
            setNotificationDays(Math.round(days).toString());
        } else {
            setNotificationDays("");
        }
    }

    const onNotificationHoursChange = text => {
        let hours = parseInt(text);
        if (hours) {
            hours = Math.abs(hours);
            if (hours > 23) {
                hours = 23;
            }
            setNotificationHours(Math.round(hours).toString());
        } else {
            setNotificationHours("");
        }
    }

    const onNotificationMinsChange = text => {
        let minutes = parseInt(text);
        if (minutes) {
            minutes = Math.abs(minutes);
            if (minutes > 59) {
                minutes = 59;
            }
            setNotificationMins(Math.round(minutes).toString());
        } else {
            setNotificationMins("");
        }
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
                        <View style={styles.formTextInputView}>
                            <TextInput style={styles.formTextInput} placeholder="Description" value={description} onChangeText={text => setDescription(text)} multiline />
                        </View>
                    </View>
                    <View style={styles.formRowView}>
                        <View style={{ flex: 0.1, display: "flex", flexDirection: "row" }}>
                            <Icon name="calendar" color={Colours.inactive} size={25} />
                        </View>
                        <Pressable style={[styles.formDateInputView, { flex: 0.6, marginStart: "2%", marginEnd: "2%" }]} onPress={() => setOpenDatePicker(true)}>
                            <Text style={styles.formTextInput}>{getFormattedDate(date)}</Text>
                        </Pressable>
                        <Pressable style={[styles.formDateInputView, { flex: 0.4 }]} onPress={() => setOpenTimePicker(true)}>
                            <Text style={styles.formTextInput}>{getFormattedTime(date)}</Text>
                        </Pressable>
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
                    {/* Notification offset pick */}
                    { notification && <View style={styles.formRowView}>
                        <View style={{ flex: 0.2 }}>
                        <View style={styles.formSmallTextInputView}>
                            <TextInput style={styles.formSmallTextInput} placeholder="0" value={notificationDays.toString()} onChangeText={onNotificationDaysChange} keyboardType="number-pad" />
                            </View>
                        </View>
                        <View style={{ flex: 0.05, marginStart: "2%" }}>
                                <Text style={styles.formTextLabelSmallText}>d</Text>
                        </View>

                        <View style={{ flex: 0.2, marginStart: "2%" }}>
                            <View style={styles.formSmallTextInputView}>
                                <TextInput style={styles.formSmallTextInput} placeholder="0" value={notificationHours.toString()} onChangeText={onNotificationHoursChange} keyboardType="number-pad" />
                            </View>
                        </View>
                        <View style={{ flex: 0.05, marginStart: "2%" }}>
                            <Text style={styles.formTextLabelSmallText}>h</Text>
                        </View>

                        <View style={{ flex: 0.2, marginStart: "2%" }}>
                            <View style={styles.formSmallTextInputView}>
                                <TextInput style={styles.formSmallTextInput} placeholder="0" value={notificationMins.toString()} onChangeText={onNotificationMinsChange} keyboardType="number-pad" />
                            </View>
                        </View>
                        <View style={{ flex: 0.3, marginStart: "2%" }}>
                            <Text style={styles.formTextLabelSmallText}>m  before</Text>
                        </View>
                    </View> }
                    <View style={[styles.formRowView, { marginBottom: 0 }]}>
                        { eventToEdit && <FormButton onPress={onCancelEditEvent} text="Back" /> }
                        {eventToEdit ? <FormButton onPress={onEditEvent} text="Save" /> : <FormButton onPress={onAddEvent} text="Add" />}
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
    formTextLabelSmallText: {
        fontSize: 17,
    },
    formTextInput: {
        fontSize: 20,
    },
    formSmallTextInput: {
        fontSize: 17,
    },
    formSmallTextInputView: {
        backgroundColor: Colours.secondaryVariant,
        width: "100%",
        borderRadius: 5,
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-end",
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