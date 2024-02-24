import React, { useState } from 'react';
import { useContext } from "react";
import { Pressable, StyleSheet, View, Text } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import CalendarDateContext from "../contexts/CalendarDateContext";
import DatePicker from "react-native-date-picker";
import { getFormattedDate } from '../common';

function Footer({ state, navigation }) {
    const [openDatePicker, setOpenDatePicker] = useState(false);

    const currentRoute = state.routes[state.index].name;

    const calendarDateContext = useContext(CalendarDateContext)

    const onConfirmDatePick = pickedDate => {
        calendarDateContext.setValue(pickedDate);
        setOpenDatePicker(false);
        navigation.navigate("Home");
    }

    return (
        <View style={[styles.footerView, styles.elevation]}>
            <View style={[styles.footerLeftView]}>
            <Pressable style={styles.dateInputPressable} onPress={() => setOpenDatePicker(true)}>
                            <Text style={styles.dateInputText}>{getFormattedDate(calendarDateContext.value)}</Text>
                        </Pressable>
            </View>
            <View style={styles.footerRightView}>
                <FooterButton navigation={navigation} route="AddEvent" params={{ date: new Date().toISOString() }} currentRoute={currentRoute} icon="settings" activeColor="#0066ff" inactiveColor="#8c8c8c" />
            </View>
            <DatePicker modal mode="date" open={openDatePicker} date={calendarDateContext.value} onConfirm={onConfirmDatePick} onCancel={() => setOpenDatePicker(false)} />
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
        height: 80,
        padding: "4%",
        display: "flex",
        flexDirection: "row"
    },
    elevation: {
        elevation: 10,
        shadowColor: "black"
    },
    footerLeftView: {
        flex: 0.7,
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center"
    },
    footerRightView: {
        flex: 0.3,
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center"
    },
    footerPressable: {
        marginRight: "10%",
        marginLeft: "10%"
    },
    dateInputPressable: {
        backgroundColor: "#ededed",
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