import { Pressable, StyleSheet, Text } from "react-native";
import { Colours, blendColors } from "../common";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

function FormButton({ onPress, text, icon, backgroundColor, color }) {
    return ( 
        <Pressable
            onPress={onPress}
            style={
                ({ pressed }) => [
                    styles.buttonPressable,
                    { backgroundColor: pressed ? blendColors(backgroundColor || Colours.main, "#000000", 0.2) : backgroundColor || Colours.main }
                ]
            }>
            { icon && <Icon style={{ marginRight: "2%" }} name={icon} size={25} color={color || Colours.secondary} /> }
            <Text style={[styles.buttonText, { color: color || Colours.secondary }]}>{text}</Text>
        </Pressable>
     );
}

const styles = StyleSheet.create({
    buttonPressable: {
        borderRadius: 15,
        width: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        padding: "5%",
        paddingTop: "4%",
        paddingBottom: "4%",
        elevation: 20,
        shadowColor: "black",
        shadowOpacity: 1,
        shadowRadius: 4,
        elevation: 5,
        shadowOffset: {
            width: 0,
            height: 0,
        },
        height: 50
    },
    buttonText: {
        fontSize: 20
    }
});

export default FormButton;