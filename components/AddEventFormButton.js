import { Pressable, StyleSheet, Text } from "react-native";
import { Colours } from "../common";

function AddEventFormButton({ onPress }) {
    return (
        <Pressable style={styles.buttonPressable} onPress={onPress}>
            <Text style={styles.buttonText}>Add</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    buttonPressable: {
        backgroundColor: Colours.main,
        borderRadius: 20,
        width: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        padding: "5%",
        paddingTop: "4%",
        paddingBottom: "4%"
    },
    buttonText: {
        color: Colours.secondary,
        fontSize: 20
    }
});

export default AddEventFormButton;