import { Pressable, StyleSheet, Text } from "react-native";
import { Colours } from "../common";

function AddEventFormButton({ onPress }) {
    return (
        <Pressable
            onPress={onPress}
            style={
                ({ pressed }) => { console.log(pressed); return [
                    styles.buttonPressable,
                    { backgroundColor: pressed ? Colours.mainDarker : Colours.main }
                ] }
            }>
            <Text style={styles.buttonText}>Add</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    buttonPressable: {
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