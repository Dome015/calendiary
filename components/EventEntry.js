import { View, Text, Pressable, ToastAndroid } from "react-native";
import { StyleSheet } from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { updateEvent } from "../db/database";
import { Colours, blendColors, getDateString, getFormattedDateTime, getFormattedTime, scheduleEventNotification, unscheduleEventNotification } from "../common";
import { useContext, useEffect, useState } from "react";
import SettingsContext from "../contexts/SettingsContext";

function EventEntry({ event, setGroupedEventList, onMiddlePress, large, loading }) {
    const [pressed, setPressed] = useState(false);
    const [shownDescription, setShownDescription] = useState(event.description);

    const settingsContext = useContext(SettingsContext)

    const notificationIsInThePast = () => {
        // Check for past notification
        const notificationTargetDate = new Date(event.date);
        notificationTargetDate.setMinutes(notificationTargetDate.getMinutes() - event.notificationMinOffset);
        return notificationTargetDate <= new Date();
    }

    const toggleNotification = () => {
        if (loading || notificationIsInThePast())
            return;
        try {
            const newEvent = { ...event };
            newEvent.notification = !event.notification;
            if (newEvent.notification)
                scheduleEventNotification(newEvent, settingsContext.timeFormat);
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
            let toastMsg = "Notification removed";
            if (newEvent.notification) {
                const notificationDate = new Date(newEvent.date);
                notificationDate.setMinutes(notificationDate.getMinutes() - newEvent.notificationMinOffset);
                toastMsg = `Notification scheduled for ${getFormattedDateTime(notificationDate)}`;
            }
            ToastAndroid.showWithGravity(toastMsg, ToastAndroid.SHORT, ToastAndroid.TOP);
        } catch (e) {
            console.log(e);
            ToastAndroid.showWithGravity(e, ToastAndroid.LONG, ToastAndroid.TOP);
        }

    }

    useEffect(() => {
        if (event.description.length <= 50)
            setShownDescription(event.description);
        else
            setShownDescription(event.description.substring(0, 51) + "...");
    }, [event.description]);

    return (
        <View style={[
            styles.emptyView,
            styles.elevation,
            { backgroundColor: pressed ? blendColors(Colours.secondary, "#000000", 0.2) : Colours.secondary }]}
        >
            <Pressable style={[{ flex: 0.9 }, styles.entryPressable]} onPressIn={() => setPressed(true)} onPressOut={() => setPressed(false)} onPress={() => loading ? {} : onMiddlePress(event)}>
                <View><Text style={[styles.emptyText, large ? styles.emptyTextLarge : styles.emptyTextNormal]}>{shownDescription}</Text></View>
                <View><Text style={styles.timeText}>{getFormattedTime(new Date(event.date), settingsContext.timeFormat)}</Text></View>
            </Pressable>
            <Pressable style={{ flex: 0.1 }} onPress={toggleNotification}>
                <Icon
                    name={event.notification ? "bell-ring-outline" : "bell-outline"}
                    color={notificationIsInThePast() ? Colours.inactive : Colours.dark} size={25} />
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    emptyView: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        borderRadius: 10,
        marginBottom: "2%",
        marginLeft: "3%",
        marginRight: "3%",
        padding: "2%",
    },
    emptyText: {
        color: Colours.dark,
        fontWeight: "bold",
    },
    emptyTextLarge: {
        fontSize: 20,
    },
    emptyTextNormal: {
        fontSize: 16,
    },
    entryPressable: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "2%"
    },
    timeText: {
        color: Colours.dark,
        fontSize: 12,
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

