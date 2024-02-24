import { View, Text, Alert } from "react-native";
import { StyleSheet } from "react-native";
import PushNotification, { Importance } from "react-native-push-notification";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

function EventEntry({ event, onDelete, onDeleteConfirm }) {
    const createDeleteAlert = () => {
        Alert.alert("Delete Event", `Are you sure you want to delete this event?\n${event.description}`,
            [
                { text: "No", style: "cancel" },
                { text: "Yes", onPress: () => onDelete(event) },
            ]
        )
    };

    const generateNotification = () => {
        console.log("creating notification");
        PushNotification.localNotificationSchedule({
            channelId: "calendiary",
            message: "My Notification Message", // (required)
            date: new Date(Date.now() + 5 * 1000), // in 60 secs
            allowWhileIdle: true, 
            importance: Importance.HIGH,
            priority: "high"
          });
    }

    return (
        <View style={styles.emptyView}>
            <View style={{ flex: 0.2 }}>
                <Icon.Button
                    name="bell-ring-outline" iconStyle={styles.onlyIcon} backgroundColor="white"
                    color="#0066ff" borderRadius={100} size={25} onPress={generateNotification}/>
            </View>
            <View style={{ flex: 0.6 }}><Text style={styles.emptyText}>{event.description}</Text></View>
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

