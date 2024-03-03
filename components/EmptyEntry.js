import { StyleSheet } from "react-native";
import { View, Text } from "react-native";
import { Colours } from "../common";

function EmptyEntry() {
    return (
        <View style={styles.emptyView}>
            <Text style={styles.emptyText}>No events for today</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    emptyView: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
        marginBottom: "2%",
        marginLeft: "3%",
        marginRight: "3%",
        padding: "2%",
        backgroundColor: Colours.secondaryVariant,
        height: 80,
    },
    emptyText: {
        color: Colours.inactive,
        fontWeight: "bold",
        fontSize: 18,
    }
});

export default EmptyEntry;