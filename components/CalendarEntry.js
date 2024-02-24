import { Text, View, StyleSheet } from "react-native";
import { isRed, getDayOfWeekName, getHolidays, isToday, getFormattedDate } from "../common";
import { PureComponent } from "react";
import React from "react";
import EventList from "./EventList";

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
                    <EventList date={date} />
                </View>
            </View>
        );
    }
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
    
});

export default CalendarEntry;
