import { View, Text, TextInput } from "react-native";
import { StyleSheet } from "react-native";

function AddEventForm({ date }) {
    return (
        <View style={styles.formView}> 
            <View style={styles.formRowView}>
                <Text style={styles.formTextLabelText}>Description</Text>
            </View>
            <View style={styles.formRowView}>
                <View style={styles.formTextInputView}><TextInput style={styles.formTextInput} multiline></TextInput></View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    formView: {
        margin: "3%"
    },
    formRowView: {
        display: "flex",
        flexDirection: "row",
        marginBottom: "3%"
    },
    formTextLabelView: {
        flex: 0.4
    },
    formTextInputView: {
        backgroundColor: "white",
        width: "100%",
        borderRadius: 5,
    },
    formTextLabelText: {
        color: "#8c8c8c",
        fontSize: 20,
    },
    formTextInput: {
        color: "#8c8c8c",
        fontSize: 20,
        margin: "3%",
        marginTop: "1%",
        marginBottom: "1%"
    }
});

export default AddEventForm;