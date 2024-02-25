import { StyleSheet, Text } from "react-native";
import { View } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Colours } from "../common";

function AddEventButton({ onPress }) {
    return (
        <View style={styles.addButtonView}>
            <Icon.Button name="add" size={25} style={styles.elevation} backgroundColor={Colours.main} color={Colours.secondary} onPress={onPress}>
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
    },
    elevation: {
        elevation: 10,
        shadowColor: "black",
        shadowOpacity: 0.5,
        shadowRadius: 4,
        elevation: 5,
        shadowOffset: {
            width: 0,
            height: -5,
        },
    },
});

export default AddEventButton;