import { View, Text, Alert, Pressable } from "react-native";
import { StyleSheet } from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { updateEvent } from "../db/database";
import { getFormattedTime, notificationHourOffset, notificationMinuteOffset, scheduleEventNotification, unscheduleEventNotification } from "../common";

function EventEntry({ event, onDelete }) {
    const createDeleteAlert = () => {
        Alert.alert("Delete Event", `Are you sure you want to delete this event?\n${event.description}`,
            [
                { text: "No", style: "cancel" },
                { text: "Yes", onPress: () => onDelete(event) },
            ]
        )
    };

    const toggleNotification = () => {
        const newEvent = {...event};
        newEvent.notification = !event.notification;
        console.log(newEvent);
        if (newEvent.notification)
            scheduleEventNotification(newEvent, notificationHourOffset, notificationMinuteOffset);
        else
            unscheduleEventNotification(newEvent);
        // Update db
        updateEvent(newEvent);
        // Update state
        setEventList(oldEventList => {
            const eventList = [];
            for (const oldEvent of oldEventList) {
                if (oldEvent.id === event.id)
                    oldEvent.notification = !oldEvent.notification;
                eventList.push(oldEvent);
            }
            return eventList;
        });
    }

    return (
        <View style={styles.emptyView}>
            <Pressable style={{ flex: 0.125 }} onPress={toggleNotification}>
                <Icon
                    name={event.notification ? "bell-ring-outline" : "bell-outline"}
                    color="white" size={25} />
            </Pressable>
            <View style={{ flex: 0.675 }}>
                <View><Text style={styles.emptyText}>{event.description}</Text></View>
                <View><Text style={styles.timeText}>{getFormattedTime(new Date(event.date))}</Text></View>
            </View>
            <View style={[{ flex: 0.2 }, styles.deleteView]}>
                <Icon.Button
                    name="trash-can" iconStyle={styles.onlyIcon} backgroundColor="white"
                    color="#0066ff" borderRadius={100} size={25} onPress={createDeleteAlert}/>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    emptyView: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        backgroundColor: "#0066ff",
        padding: "5%",
        borderRadius: 10,
        marginBottom: "2%"
    },
    emptyText: {
        color: "#ffffff",
        fontSize: 20,
        marginBottom: "2%"
    },
    timeText: {
        color: "#ffffff",
        fontSize: 10,
    },
    deleteView: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-end"
    },
    onlyIcon: {
        marginRight: 0
    },
});

export default EventEntry;

