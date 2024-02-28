import { StyleSheet, Text, ToastAndroid, View } from "react-native";
import { Colours, Countries, getFormattedTime } from "../common";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useContext, useState } from "react";
import { updateSetting } from "../db/database";
import { Picker } from "@react-native-picker/picker";
import SettingsContext from "../contexts/SettingsContext";

function Settings() {
    const [location, setLocation] = useState("US");
    const [timeFormat, setTimeFormat] = useState("12");

    const settingsContext = useContext(SettingsContext);

    useFocusEffect(useCallback(() => {
        setLocation(settingsContext.location);
        setTimeFormat(settingsContext.timeFormat);
    }, [settingsContext.location, settingsContext.timeFormat]));

    const onLocationChange = (newLocation) => {
        try {
            // Update context
            settingsContext.setLocation(newLocation);
            // Update state
            setLocation(newLocation);
            // Change location on db
            updateSetting({ name: "location", value: newLocation });
        } catch (e) {
            console.log(e);
            ToastAndroid.showWithGravity(e, ToastAndroid.LONG, ToastAndroid.TOP);
        }
    }

    const onTimeFormatChange = newTimeFormat => {
        try {
            // Update context
            settingsContext.setTimeFormat(newTimeFormat);
            // Update state
            setTimeFormat(newTimeFormat);
            // Change location on db
            updateSetting({ name: "timeFormat", value: newTimeFormat });
        } catch (e) {
            console.log(e);
            ToastAndroid.showWithGravity(e, ToastAndroid.LONG, ToastAndroid.TOP);
        }
    }

    return (
        <View style={styles.formView}>
            {/* Location */}
            <View style={styles.formRowView}>
                <Icon name="place" style={{ marginRight: "2%" }} color={Colours.main} size={25} />
                <Text style={styles.formTextLabelText}>
                    Location
                </Text>
            </View>
            <View style={styles.formRowView}>
                <View style={styles.formPicker}>
                    <Picker selectedValue={location} onValueChange={newLocation => onLocationChange(newLocation)}>
                        {Countries.list.map((c, i) => <Picker.Item style={styles.formPickerItem} key={i} label={c.name} value={c.code} />)}
                    </Picker>
                </View>
            </View>
            <View style={styles.formRowView}>
                <Text style={styles.formTextSublabelText}>
                    Location is used to keep track of national holidays.
                </Text>
            </View>
            {/* Time format */}
            <View style={styles.formRowView}>
                <Icon name="access-time" style={{ marginRight: "2%" }} color={Colours.main} size={25} />
                <Text style={styles.formTextLabelText}>
                    Time format
                </Text>
            </View>
            <View style={styles.formRowView}>
                <View style={styles.formPicker}>
                    <Picker selectedValue={timeFormat} onValueChange={newTimeFormat => onTimeFormatChange(newTimeFormat)}>
                        <Picker.Item style={styles.formPickerItem} label="12 hours" value="12" />
                        <Picker.Item style={styles.formPickerItem} label="24 hours" value="24" />
                    </Picker>
                </View>

            </View>
            <View style={styles.formRowView}>
                <Text style={styles.formTextSublabelText}>
                    Example: {getFormattedTime(new Date(), timeFormat)}
                </Text>
            </View>

            <View style={styles.formSeparator} />

            <View style={styles.formRowView}>
                <Text style={styles.formDisclaimerText}>
                    Calendario is a free application to keep track of upcoming events; all the data is stored locally on your device, and shared with no one.
                </Text>
            </View>
            <View style={styles.formRowView}>
                <Text style={styles.formDisclaimerText}>
                    To report bugs or suggest new features, write to manuardi.domenico.00@gmail.com.
                </Text>
            </View>
            <View style={styles.formRowView}>
                <Text style={styles.formDisclaimerText}>
                    This software by Domenico Manuardi is licensed under CC BY-NC-ND 4.0.
                </Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    formView: {
        margin: "3%",
    },
    formRowView: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        marginBottom: "2%"
    },
    formTitleText: {
        fontSize: 25,
        fontWeight: "bold",
        color: Colours.dark
    },
    formTextLabelText: {
        fontSize: 18,
        fontWeight: "bold",
        color: Colours.main
    },
    formTextSublabelText: {
        fontSize: 18,
        color: Colours.dark
    },
    formDisclaimerText: {
        fontSize: 16,
        color: Colours.inactive
    },
    formPicker: {
        backgroundColor: Colours.secondary,
        elevation: 20,
        borderRadius: 5,
        shadowColor: "black",
        shadowOpacity: 1,
        shadowRadius: 4,
        elevation: 5,
        shadowOffset: {
            width: 0,
            height: 0,
        },
        flex: 1
    },
    formPickerItem: {
        fontSize: 18,
        color: Colours.dark
    },
    formSeparator: {
        height: 1,
        backgroundColor: Colours.inactive,
        width: "100%",
        marginBottom: "2%"
    }
})

export default Settings;