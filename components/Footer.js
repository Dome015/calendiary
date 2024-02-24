import { Pressable, StyleSheet, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

function Footer({ state, navigation }) {
    const currentRoute = state.routes[state.index].name;
    console.log(currentRoute);

    return (
        <View style={[styles.footerView, styles.elevation]}>
            <View style={[styles.footerLeftView]}>
                <FooterButton navigation={navigation} route="Home" params={{ date: new Date().toISOString() }} currentRoute={currentRoute} icon="calendar-today" activeColor="#0066ff" inactiveColor="#8c8c8c" />
                <FooterButton navigation={navigation} route="AddEvent" params={{ date: new Date().toISOString() }} currentRoute={currentRoute} icon="add-circle-outline" activeColor="#0066ff" inactiveColor="#8c8c8c" />
            </View>
            <View style={styles.footerRightView}>
                <FooterButton navigation={navigation} route="AddEvent" params={{ date: new Date().toISOString() }} currentRoute={currentRoute} icon="settings" activeColor="#0066ff" inactiveColor="#8c8c8c" />
            </View>
        </View>
    )
}

function FooterButton({ navigation, route, params, currentRoute, icon, activeColor, inactiveColor }) {

    return (
        <Pressable style={styles.footerPressable} onPress={() => navigation.navigate(route, params)}>
            <Icon name={icon} size={40} color={ currentRoute === route ? activeColor : inactiveColor } />
        </Pressable>
    )
}

const styles = StyleSheet.create({
    footerView: {
        backgroundColor: "white",
        height: 70,
        padding: "4%",
        display: "flex",
        flexDirection: "row"
    },
    elevation: {
        elevation: 10,
        shadowColor: "black"
    },
    footerLeftView: {
        flex: 0.5,
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center"
    },
    footerRightView: {
        flex: 0.5,
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center"
    },
    footerPressable: {
        marginRight: "10%",
        marginLeft: "10%"
    }
});

export default Footer;