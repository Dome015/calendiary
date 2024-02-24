import { StyleSheet } from "react-native";
import { Pressable, Text } from "react-native";

function AddEventButton({ onPress }) {
    return (
        <Pressable style={styles.addButtonPressable} onPress={onPress}>
            <Text style={styles.addButtonText}>
                +
            </Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
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

export default AddEventButton;