import { StyleSheet, View, Text } from "react-native";
import { Colours } from "../common";

function HolidayEventEntry({ event }) {
    return ( 
        <View style={styles.entryView}>
            <View><Text style={styles.emptyText}>{event.description}</Text></View>
            <View><Text style={styles.timeText}>Holiday</Text></View>
        </View>
     );
}

const styles = StyleSheet.create({
    entryView: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        backgroundColor: Colours.danger,
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
        color: Colours.secondary,
        fontSize: 20,
        fontWeight: "bold",
    },
    timeText: {
        color: Colours.secondary,
        fontSize: 10,
    },
})

export default HolidayEventEntry;