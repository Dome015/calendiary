import React from 'react';
import { Pressable, StyleSheet, View } from "react-native";
import MCIcon from "react-native-vector-icons/MaterialIcons";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Colours } from '../common';

function Footer({ state, navigation }) {

    const currentRoute = state.routes[state.index].name;

    return (
        <View style={[styles.footerView, styles.elevation]}>
            <FooterButton navigation={navigation} route="Home" currentRoute={currentRoute} icon="calendar-month" activeColor={Colours.main} inactiveColor={Colours.inactive} />
            <FooterButton navigation={navigation} route="Settings" currentRoute={currentRoute} icon="settings" activeColor={Colours.main} inactiveColor={Colours.inactive} />
        </View>
    )
}

function FooterButton({ navigation, route, params, currentRoute, icon, activeColor, inactiveColor }) {
    return (
        <Pressable style={styles.footerPressable} onPress={() => navigation.navigate(route, params)}>
            { icon === "settings" && <MCIcon name={icon} size={40} color={currentRoute === route ? activeColor : inactiveColor} /> }
            { icon !== "settings" && <Icon name={icon} size={40} color={currentRoute === route ? activeColor : inactiveColor} /> }
        </Pressable>
    )
}

const styles = StyleSheet.create({
    footerView: {
        backgroundColor: "white",
        height: 55,
        padding: "2%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around"
    },
    elevation: {
        elevation: 10,
        shadowColor: "black",
        shadowOffset: {
            width: 0,
            height: -5,
        },
        shadowOpacity: 0.5,
        shadowRadius: 4,
        elevation: 5,
    },
    dateInputPressable: {
        backgroundColor: Colours.secondaryVariant,
        padding: "5%",
        paddingTop: "4%",
        paddingBottom: "4%",
        borderRadius: 5,
        width: "100%"
    },
    dateInputText: {
        fontSize: 20,
    }
});

export default Footer;