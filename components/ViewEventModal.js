import { Modal, View, StyleSheet, Text, Pressable, Alert } from "react-native";
import { Colours, getFormattedDate, getFormattedDateTime, notificationHourOffset, notificationMinuteOffset } from "../common";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import FormButton from "./FormButton";

function ViewEventModal({ event, setEvent, show, setShow, setShowEdit, onDelete }) {
    if (!event)
        return null;

    console.log(event);

    const onClose = () => {
        setEvent(null);
        setShow(false);
    }

    const onEdit = () => {
        setShow(false);
        setShowEdit(true);
    }

    const createDeleteAlert = () => {
        Alert.alert("Delete event", `Are you sure you want to delete this event?`,
            [
                { text: "No", style: "cancel" },
                { text: "Yes", onPress: () => onDelete(event) },
            ]
        )
    };

    const eventDate = new Date(event.date);
    const notificationDate = new Date(event.date);
    notificationDate.setMinutes(notificationDate.getMinutes() - event.notificationMinOffset);

    return (
        <Modal visible={show} animationType="fade" transparent={true} onRequestClose={onClose}>
            <View style={styles.centeredView} behavior="height">
                <View style={styles.modalTitleView}>
                    <Text style={styles.modalTitleText}>Event</Text>
                    <Pressable onPress={onClose}>
                        <Icon name="close" size={25} color="white"></Icon>
                    </Pressable>
                </View>
                <View style={styles.modalBodyView}>
                    
                    <View style={styles.rowView}>
                        <Text style={styles.rowText}>{event.description}</Text>
                    </View>
                    <View style={styles.rowView}>
                        <View style={{ flex: 0.1, display: "flex", flexDirection: "row" }}>
                            <Icon name="calendar" color={Colours.inactive} size={25} />
                        </View>
                        <Text style={[styles.rowTextNotification, { flex: 0.9 }]}>{getFormattedDateTime(eventDate)}</Text>
                    </View>
                    <View style={styles.rowView}>
                        <View style={{ flex: 0.1, display: "flex", flexDirection: "row" }}>
                            <Icon name={event.notification ? "bell-ring" : "bell"} color={Colours.inactive} size={25} />
                        </View>
                        <Text style={[styles.rowTextNotification, { flex: 0.9 }]}>{event.notification ? `You will be notified on ${getFormattedDateTime(notificationDate)}` : "Notification disabled"}</Text>
                    </View>
                   <View style={[styles.rowView, { marginBottom: 0 }]}>
                        <View style={{ flex: 0.5, marginRight: "2%" }}><FormButton onPress={createDeleteAlert} text="Delete" backgroundColor={Colours.danger} /></View>
                        <View style={{ flex: 0.5, marginLeft: "2%" }}><FormButton onPress={onEdit} text="Edit" /></View>
                    </View>
                </View>
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
    rowView: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        marginBottom: "5%"
    },
    rowText: {
        fontSize: 20,
        color: Colours.dark
    },
    rowTextNotification: {
        fontSize: 15,
        color: Colours.dark
    }
});

export default ViewEventModal;