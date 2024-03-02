import { StyleSheet, View, Text } from "react-native";
import { Colours } from "../common";

function HolidayEventEntry({ event, large }) {
    return ( 
        <View style={[styles.entryView, large ? { height: 80 } : { height: 60 }]}>
            <View><Text style={styles.entryText}>{event.description}</Text></View>
            <View><Text style={styles.timeText}>Holiday</Text></View>
        </View>
     );
}

const styles = StyleSheet.create({
    entryView: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "flex-start",
        backgroundColor: Colours.secondary,
        borderRadius: 10,
        marginBottom: "2%",
        marginLeft: "3%",
        marginRight: "3%",
        padding: "2%",
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
    entryText: {
        color: Colours.inactive,
        fontSize: 20,
        fontWeight: "bold",
    },
    entryPressable: {
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent:"space-between"
    },
    timeText: {
        color: Colours.inactive,
        fontSize: 10,
    },
})

export default HolidayEventEntry;