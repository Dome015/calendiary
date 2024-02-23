import { View, Text } from "react-native";
import { StyleSheet } from "react-native";

function EventEntry({ event }) {
    return (
        <View style={styles.emptyView}>
            <Text style={styles.emptyText}>{event.description}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    emptyView: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#0066ff",
        padding: "2%",
        height: 60,
        borderRadius: 10,
        marginBottom: "2%"
    },
    emptyText: {
        color: "#ffffff",
        fontSize: 20,
    }
});

export default EventEntry;

