import { StyleSheet } from "react-native";
import { View, Text } from "react-native";

function Loading() {
    return (
        <View style={styles.loadingView}>
            <Text style={styles.loadingText}>Loading...</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    loadingView: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#cccccc",
        opacity: 1,
        padding: "5%",
        borderRadius: 10,
        margin: "2%",
        marginBottom: "auto",
        marginTop: "auto",
        alignSelf: "center"
    },
    loadingText: {
        color: "#8c8c8c",
        fontSize: 20,
    }
});

export default Loading;