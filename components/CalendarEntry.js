import { Text, View, StyleSheet, Pressable } from "react-native";
import { isRed, getDayOfWeekName, getHolidays, isToday, getFormattedDate, getDateString } from "../common";
import { PureComponent, useContext } from "react";

import EmptyEntry from "./EmptyEntry";
import PageContext from "../context/PageContext";
import * as db from "../db/database";
import EventEntry from "./EventEntry";

class CalendarEntry extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            eventList: []
        };
    }

    componentDidMount() {
        // Fetch events for date
        const fetchEvents = async () => {
            const list = await db.getEventsByDate(getDateString(this.props.date));
            this.setState({ eventList : list });
        }
        fetchEvents();
    }

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
                    { this.state.eventList.length === 0 && <EmptyEntry /> }
                    { this.state.eventList.map(event => <EventEntry event={event} />) }
                    <AddEventButton date={date} />
                </View>
            </View>
        );
    }
}

function AddEventButton({ date }) {
    const pageContext = useContext(PageContext);

    return (
        <Pressable style={styles.addButtonPressable} onPress={() => pageContext.setPage("addEvent")}>
            <Text style={styles.addButtonText}>
              
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
