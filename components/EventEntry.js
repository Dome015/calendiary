import { View, Text, Alert, Pressable } from "react-native";
import { StyleSheet } from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { updateEvent } from "../db/database";
import { Colours, getDateString, getFormattedTime, notificationHourOffset, notificationMinuteOffset, scheduleEventNotification, unscheduleEventNotification } from "../common";

function EventEntry({ event, onDelete, setGroupedEventList, onMiddlePress }) {
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
        if (newEvent.notification)
            scheduleEventNotification(newEvent, notificationHourOffset, notificationMinuteOffset);
        else
            unscheduleEventNotification(newEvent);
        // Update db
        updateEvent(newEvent);
        // Update state
        setGroupedEventList(oldGroupList => {
            const groupList = [...oldGroupList];
            const group = groupList.find(elem => elem.title === getDateString(new Date(newEvent.date)));
            for (let i = 0; i < group.data.length; i++) {
                if (group.data[i].id === newEvent.id) {
                    group.data[i] = newEvent;
                    break;
                }
            }
            return groupList;
        });
    }

    return (
        <View style={[styles.emptyView, styles.elevation]}>
            <Pressable style={{ flex: 0.125 }} onPress={toggleNotification}>
                <Icon
                    name={event.notification ? "bell-ring-outline" : "bell-outline"}
                    color="white" size={25} />
            </Pressable>
            <Pressable style={{ flex: 0.675, backgroundColor: "red" }} onPress={() => onMiddlePress(event)}>
                <View><Text style={styles.emptyText}>{event.description}</Text></View>
                <View><Text style={styles.timeText}>{getFormattedTime(new Date(event.date))}</Text></View>
            </Pressable>
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
        backgroundColor: Colours.secondary,
        padding: "5%",
        borderRadius: 10,
        marginBottom: "2%",
        marginLeft: "2%",
        marginRight: "2%"
    },
    emptyText: {
        color: Colours.dark,
        fontSize: 20,
        marginBottom: "2%"
    },
    timeText: {
        color: Colours.dark,
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
    elevation: {
        elevation: 20,
        shadowColor: "black",
        shadowOpacity: 1,
        shadowRadius: 4,
        elevation: 5,
        shadowOffset: {
            width: 0,
            height: 0,
        },
    },
});

export default EventEntry;

