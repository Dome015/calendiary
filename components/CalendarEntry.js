import { Text, View, StyleSheet, Pressable, Modal } from "react-native";
import { isRed, getDayOfWeekName, getHolidays, isToday, getFormattedDate, getDateString } from "../common";
import { PureComponent, useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import React from "react";
import EmptyEntry from "./EmptyEntry";
import * as db from "../db/database";
import EventEntry from "./EventEntry";

class CalendarEntry extends PureComponent {

    render() {
        const { date } = this.props;

        return (
            <View style={styles.entryView}>
                <View style={styles.titleView}>
                    <View style={styles.dateView}>
                        <Text style={[styles.titleText, isRed(date) ? styles.titleTextHoliday : {}, isToday(date) ? styles.titleTextToday : {}]}>{getFormattedDate(date)}</Text>
                    </View>
                    <View style={styles.dayOfWeekView}>
                        <Text style={[styles.titleText, isRed(date) ? styles.titleTextHoliday : {}, isToday(date) ? styles.titleTextToday : {}]}>{getDayOfWeekName(date)}</Text>
                        { getHolidays(date) && <Text style={[styles.titleSubtext, isRed(date) ? styles.titleTextHoliday : {}, isToday(date) ? styles.titleTextToday : {}]}>{getHolidays(date)}</Text> }
                    </View>
                </View>
                <View style={[styles.bodyView, isToday(date) ? styles.bodyViewToday : {}]}>
                    <EventList navigation={this.props.navigation} date={date}/>
                    <AddEventButton date={date} navigation={this.props.navigation} />
                </View>
            </View>
        );
    }
}

function EventList({ navigation, date }) {
    const [eventList, setEventList] = useState([]);
    
    useFocusEffect(React.useCallback(() => {
        const fetchEvents = async () => {
            try {
                const list = await db.getEventsByDate(date.toISOString());
                setEventList(list);
            } catch (e) {
                console.log(e);
            }
        }
        fetchEvents();
    }, [date]));

    const onDeleteConfirm = async (event) => {
        try {
            await db.deleteEventById(event.id);
            setEventList(oldEventList => {
                let eventList = [...oldEventList];
                eventList = eventList.filter(e => e.id !== event.id);
                return eventList;
            });
        } catch (e) {
            console.log(e);
        }
    }

    return ( 
        <>
            { eventList.length === 0 && <EmptyEntry /> }
            { eventList.map(event => <EventEntry key={event.id} event={event} setEventList={setEventList} navigation={navigation} onDelete={onDeleteConfirm}/>) }
        </>
    );
}

function AddEventButton({ navigation, date }) {
    return (
        <Pressable style={styles.addButtonPressable} onPress={() => navigation.navigate("AddEvent", { date: date.toISOString() })}>
            <Text style={styles.addButtonText}>
                +
            </Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    entryView: {
        marginLeft: "3%",
        marginRight: "3%",
        marginBottom: 10
    },
    titleView: {
        borderBottomColor: "#8c8c8c",
        borderBottomWidth: 1,
        display: "flex",
        alignItems: "flex-end",
        flexDirection: "row",
        padding: 4
    },
    dateView: {
        flex: 0.4,
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start"
    },
    dayOfWeekView: {
        flex: 0.6,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end"
    },
    titleTextSmall: {
        color: "#8c8c8c",
        fontSize: 14,
        padding: 4
    },
    titleText: {
        color: "#8c8c8c",
        fontSize: 20,
    },
    titleSubtext: {
        color: "#8c8c8c",
        fontSize: 12,
    },
    titleTextHoliday: {
        color: "#cc3300",
    },
    titleTextToday: {
        fontWeight: "bold"
    },
    bodyView: {
        padding: "2%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
    },
    bodyViewToday: {
        minHeight: 300
    },
    addButtonPressable: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#333333",
        padding: "2%",
        height: 60,
        borderRadius: 10,
        marginTop: "auto"
    },
    addButtonText: {
        color: "white",
        fontSize: 25
    }
});

export default CalendarEntry;
