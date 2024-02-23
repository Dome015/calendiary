import { StyleSheet } from "react-native";
import { View, Text } from "react-native";

function EmptyEntry() {
    return (
        <View style={styles.emptyView}>
            <Text style={styles.emptyText}>No events for this date.</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    emptyView: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#cccccc",
        opacity: 1,
        padding: "2%",
        height: 60,
        borderRadius: 10,
        marginBottom: "2%"
    },
    emptyText: {
        color: "#8c8c8c",
        fontSize: 20,
    }
});

export default EmptyEntry;