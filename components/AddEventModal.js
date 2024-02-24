import { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { StyleSheet, View, Text, Modal, Pressable, Dimensions } from "react-native";

function AddEventModal({ inDate, show, setShow }) {
    const [description, setDescription] = useState("");
    const [date, setDate] = useState(inDate);
    const [openDatePicker, setOpenDatePicker] = useState(false);
    const [openTimePicker, setOpenTimePicker] = useState(false);
    const [notification, setNotification] = useState(true);

    useFocusEffect(useCallback(() => {
        // Set initial values
        setDescription("");
        setDate(inDate);
        setNotification(true);
    }, []));

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
        const eventId = await insertEvent(newEvent);
        newEvent.id = eventId;
        // Schedule notification if necessary
        if (newEvent.notification) {
            scheduleEventNotification(newEvent, notificationHourOffset, notificationMinuteOffset);
        }
        setShow(false);
    }

    return (
            <Modal visible={show} animationType="fade" transparent={true} onRequestClose={() => setShow(false)}>
                <View style={styles.centeredView}>
                <View style={[styles.modalTitleView, { flex: 0.05 }]}>
                    <Text style={styles.modalTitleText}>Add event</Text>
                    </View>
                    <View style={[styles.modalBodyView]}>
                    <Pressable onPress={() => setShow(false)}>
                        <Text>Add event modal</Text>
                    </Pressable>
                    </View>
                </View>
                    
            </Modal>
    )
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
        backgroundColor: "#0066ff",
        width: "100%",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        alignSelf: "auto",
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        padding: "4%",
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
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

export default AddEventModal;