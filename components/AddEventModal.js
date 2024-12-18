import { useState, useEffect, useContext } from "react";
import { StyleSheet, View, Text, Modal, Pressable, TextInput, Switch, Alert, ToastAndroid } from "react-native";
import { Colours, getDhm, getFormattedDate, getFormattedTime, getMinutes } from "../common";
import DatePicker from "react-native-date-picker";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import FormButton from "./FormButton";
import SettingsContext from "../contexts/SettingsContext";

function AddEventModal({ show, setShow, onAdd, eventToEdit, setEventToEdit, onEdit, setShowView }) {
    const [description, setDescription] = useState("");
    const [date, setDate] = useState(new Date());
    const [openDatePicker, setOpenDatePicker] = useState(false);
    const [openTimePicker, setOpenTimePicker] = useState(false);
    const [notification, setNotification] = useState(true);
    // Notification offset
    const [notificationDays, setNotificationDays] = useState("");
    const [notificationHours, setNotificationHours] = useState("60");
    const [notificationMins, setNotificationMins] = useState("");
    const [notificationMinOffset, setNotificationMinOffset] = useState(60);
    // Error checking
    const [emptyDescriptionError, setEmptyDescriptionError] = useState(false);
    const [pastNotificationError, setPastNotificationError] = useState(false);

    const settingsContext = useContext(SettingsContext);

    const reset = () => {
        try {
            // Set initial values
            if (eventToEdit) {
                setDescription(eventToEdit.description);
                setDate(new Date(eventToEdit.date));
                setNotification(eventToEdit.notification);
                const offsetData = getDhm(eventToEdit.notificationMinOffset);
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
            setEmptyDescriptionError(false);
            setPastNotificationError(false);
        } catch (e) {
            console.log(e);
            ToastAndroid.showWithGravity(e, ToastAndroid.LONG, ToastAndroid.TOP);
        }
    }

    useEffect(() => reset(), [show]);

    useEffect(() => {
        // Compute notification minute offset
        const notificationDaysN = notificationDays.length > 0 ? parseInt(notificationDays) : 0;
        const notificationHoursN = notificationHours.length > 0 ? parseInt(notificationHours) : 0;
        const notificationMinsN = notificationMins.length > 0 ? parseInt(notificationMins) : 0;
        setNotificationMinOffset(getMinutes(notificationDaysN, notificationHoursN, notificationMinsN));
    }, [notificationDays, notificationHours, notificationMins])

    const onConfirmDatePick = pickedDate => {
        setDate(date =>
            new Date(pickedDate.getFullYear(), pickedDate.getMonth(), pickedDate.getDate(), date.getHours(), date.getMinutes(), 0, 0));
        setOpenDatePicker(false);
    }

    const onConfirmTimePick = pickedTime => {
        setDate(date =>
            new Date(date.getFullYear(), date.getMonth(), date.getDate(), pickedTime.getHours(), pickedTime.getMinutes(), 0, 0));
        setOpenTimePicker(false);
    }

    const onAddEvent = async () => {
        try {
            // Check for empty description
            if (description.trim().length === 0) {
                setEmptyDescriptionError(true);
                return;
            }
            // Check for past notification
            if (notification && notificationIsInThePast()) {
                setPastNotificationError(true);
                return;
            }
            // Hide modal
            setShow(false);
            // Handle addition
            const event = {
                description: description,
                date: date,
                notification: notification,
                notificationMinOffset: notificationMinOffset,
            };
            onAdd(event);
        } catch (e) {
            console.log(e);
        }
    }

    const onEditEvent = async () => {
        try {
            // Check for empty description
            if (description.trim().length === 0) {
                setEmptyDescriptionError(true);
                return;
            }
            // Check for past notification
            if (notification && notificationIsInThePast()) {
                setPastNotificationError(true);
                return;
            }
            // Hide modal
            setShow(false);
            // Handle update
            const newEvent = {
                id: eventToEdit.id,
                description: description,
                date: date,
                notification: notification,
                notificationMinOffset: notificationMinOffset
            };
            onEdit(newEvent);
        } catch (e) {
            console.log(e);
        }
    }

    const onCancelEdit = () => {
        Alert.alert("Cancel edit", `Are you sure you want to cancel all changes and go back?`,
            [
                { text: "No", style: "cancel" },
                { text: "Yes", onPress: onCancelConfirm },
            ]
        )
    }

    const onCancelConfirm = () => {
        // Go back to view screen
        setShowView(true);
        setShow(false);
    }

    const onClose = () => {
        if (eventToEdit) {
            onCancelEdit();
        } else {
            setEventToEdit(null);
            setShow(false);
        }
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

    const notificationIsInThePast = () => {
        // Check for past notification
        const notificationTargetDate = new Date(date);
        notificationTargetDate.setMinutes(notificationTargetDate.getMinutes() - notificationMinOffset);
        return notificationTargetDate <= new Date();
    }

    return (
        <Modal visible={show} animationType="fade" transparent={true} onRequestClose={onClose} useNativeDriver={true} >
            <View style={styles.centeredView} behavior="height">
                <View style={styles.modalTitleView}>
                    <Text style={styles.modalTitleText}>{eventToEdit ? "Edit event" : "Add event"}</Text>
                    <Pressable onPress={onClose} hitSlop={20}>
                        <Icon name="close" size={25} color="white"></Icon>
                    </Pressable>
                </View>
                {/* Event date/time */}
                <View style={styles.modalBodyView}>

                    <View style={styles.formRowView}>
                        <View style={styles.formTextInputView}>
                            <TextInput style={styles.formTextInput} placeholderTextColor={Colours.inactive} placeholder="Description" value={description} onChangeText={text => setDescription(text)} multiline maxLength={500} />
                        </View>
                    </View>
                    {emptyDescriptionError && description.trim().length === 0 &&
                        <View style={styles.formRowView}>
                            <Text style={styles.formErrorText}>Description cannot be empty</Text>
                        </View>
                    }

                    <View style={styles.formRowView}>
                        <View style={{ flex: 0.1, display: "flex", flexDirection: "row" }}>
                            <Icon name="calendar" color={Colours.inactive} size={25} />
                        </View>
                        <Pressable style={[styles.formDateInputView, { flex: 0.6, marginStart: "2%", marginEnd: "2%" }]} onPress={() => setOpenDatePicker(true)}>
                            <Text style={styles.formTextInput}>{getFormattedDate(date)}</Text>
                        </Pressable>
                        <Pressable style={[styles.formDateInputView, { flex: 0.4 }]} onPress={() => setOpenTimePicker(true)}>
                            <Text style={styles.formTextInput}>{getFormattedTime(date, settingsContext.timeFormat)}</Text>
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
                    {notification &&
                        <View style={styles.formRowView}>
                            <View style={{ flex: 0.2 }}>
                                <View style={styles.formSmallTextInputView}>
                                    <TextInput style={styles.formSmallTextInput} placeholderTextColor={Colours.inactive} placeholder="0" value={notificationDays.toString()} onChangeText={onNotificationDaysChange} keyboardType="number-pad" />
                                </View>
                            </View>
                            <View style={{ flex: 0.05, marginStart: "2%" }}>
                                <Text style={styles.formTextLabelSmallText}>d</Text>
                            </View>

                            <View style={{ flex: 0.2, marginStart: "2%" }}>
                                <View style={styles.formSmallTextInputView}>
                                    <TextInput style={styles.formSmallTextInput} placeholderTextColor={Colours.inactive} placeholder="0" value={notificationHours.toString()} onChangeText={onNotificationHoursChange} keyboardType="number-pad" />
                                </View>
                            </View>
                            <View style={{ flex: 0.05, marginStart: "2%" }}>
                                <Text style={styles.formTextLabelSmallText}>h</Text>
                            </View>

                            <View style={{ flex: 0.2, marginStart: "2%" }}>
                                <View style={styles.formSmallTextInputView}>
                                    <TextInput style={styles.formSmallTextInput} placeholderTextColor={Colours.inactive} placeholder="0" value={notificationMins.toString()} onChangeText={onNotificationMinsChange} keyboardType="number-pad" />
                                </View>
                            </View>
                            <View style={{ flex: 0.3, marginStart: "2%" }}>
                                <Text style={styles.formTextLabelSmallText}>m  before</Text>
                            </View>
                        </View>
                    }
                    {notification && pastNotificationError && notificationIsInThePast() &&
                        <View style={styles.formRowView}>
                            <Text style={styles.formErrorText}>Notification cannot be scheduled in the past</Text>
                        </View>
                    }
                    <View style={[styles.formRowView, { marginBottom: 0 }]}>
                        {eventToEdit ?
                            <>
                                <View style={{ flex: 0.5, marginEnd: "2%" }}><FormButton onPress={onCancelEdit} text="Cancel" backgroundColor={Colours.danger} /></View>
                                <View style={{ flex: 0.5, marginStart: "2%" }}><FormButton onPress={onEditEvent} text="Save" /></View>
                            </>
                            :
                            <FormButton onPress={onAddEvent} text="Add" />
                        }
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
        backgroundColor: Colours.main,
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
        backgroundColor: Colours.secondaryVariant,
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
        backgroundColor: Colours.secondary,
        borderRadius: 5,
        width: "100%",
        padding: "3%",
        paddingTop: "1%",
        paddingBottom: "1%",
        height: 70,
    },
    formDateInputView: {
        backgroundColor: Colours.secondary,
        padding: "3%",
        paddingTop: "4%",
        paddingBottom: "4%",
        borderRadius: 5,
    },
    formTextLabelText: {
        fontSize: 18,
        color: Colours.dark
    },
    formTextLabelSmallText: {
        fontSize: 15,
        color: Colours.dark,
    },
    formTextInput: {
        backgroundColor: Colours.secondary,
        color: Colours.dark,
        fontSize: 18,
    },
    formSmallTextInput: {
        fontSize: 16,
    },
    formErrorText: {
        fontSize: 15,
        color: Colours.danger
    },
    formSmallTextInputView: {
        backgroundColor: Colours.secondary,
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