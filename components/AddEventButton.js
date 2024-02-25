import { StyleSheet, Text } from "react-native";
import { View } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Colours } from "../common";

function AddEventButton({ onPress }) {
    return (
        <View style={styles.addButtonView}>
            <Icon.Button name="add" size={25} backgroundColor={Colours.main} color={Colours.secondary} onPress={onPress}>
                <Text style={styles.addButtonText}>New event</Text>
            </Icon.Button>
        </View>
    );
}

const styles = StyleSheet.create({
    addButtonView: {
        position: "absolute",
        bottom: 10,
        right: 10
    },
    addButtonText: {
        fontSize: 20,
        marginRight: 4,
        color: Colours.secondary
    }
});

export default AddEventButton;