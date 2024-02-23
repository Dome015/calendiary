import { View, Text } from "react-native";
import { StyleSheet } from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

function EventEntry({ event, onDelete }) {
    return (
        <View style={styles.emptyView}>
            <View style={{ flex: 0.8 }}><Text style={styles.emptyText}>{event.description}</Text></View>
            <View style={[{ flex: 0.2 }, styles.deleteView]}>
                <Icon.Button
                    name="trash-can" iconStyle={styles.deleteIcon} backgroundColor="white"
                    color="#0066ff" borderRadius={100} size={25} onPress={() => onDelete(event)}/>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    emptyView: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        backgroundColor: "#0066ff",
        padding: "5%",
        borderRadius: 10,
        marginBottom: "2%"
    },
    emptyText: {
        color: "#ffffff",
        fontSize: 20,
    },
    deleteView: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-end"
    },
    deleteIcon: {
        marginRight: 0
    },
});

export default EventEntry;

