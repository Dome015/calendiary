import { StyleSheet, Text, View } from "react-native";
import { Colours, Countries } from "../common";
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
        }
    }

    const onTimeFormatChange = newTimeFormat => {
        try {
            // Change location on db
            updateSetting({ name: "timeFormat", value: newTimeFormat });
            // Update state
            setTimeFormat(newTimeFormat);
            // Update context
            settingsContext.setTimeFormat(newTimeFormat);
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <View style={styles.formView}>
            <View style={styles.formRowView}>
                <Text style={styles.formTitleText}>
                    Settings
                </Text>
            </View>
            {/* Location */}
            <View style={styles.formRowView}>
                <Icon name="place" style={{ marginRight: "2%" }} color={Colours.inactive} size={25} />
                <Text style={styles.formTextLabelText}>
                    Location
                </Text>
            </View>
            <View style={styles.formRowView}>
                <Picker style={styles.formPicker} selectedValue={location} onValueChange={newLocation => onLocationChange(newLocation)}>
                    {Countries.list.map((c, i) => <Picker.Item style={styles.formPickerItem} key={i} label={c.name} value={c.code} />)}
                </Picker>
            </View>
            {/* Time format */}
            <View style={styles.formRowView}>
                <View style={{ flex: 0.3, display: "flex", flexDirection: "row", paddingEnd: "2%", alignItems: "center" }}>
                    <Icon name="access-time" style={{ marginRight: "2%" }} color={Colours.inactive} size={25} />
                    <Text style={styles.formTextLabelText}>
                        Time format
                    </Text>
                </View>
                <View style={{ flex: 0.7 }}>
                    <Picker style={styles.formPicker} selectedValue={timeFormat} onValueChange={newTimeFormat => onTimeFormatChange(newTimeFormat)}>
                        <Picker.Item style={styles.formPickerItem} label="12 hours" value="12" />
                        <Picker.Item style={styles.formPickerItem} label="24 hours" value="24" />
                    </Picker>
                </View>
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
        color: Colours.inactive
    },
    formPicker: {
        backgroundColor: Colours.secondary,
        borderRadius: 10,
        elevation: 20,
        shadowColor: "black",
        shadowOpacity: 1,
        shadowRadius: 4,
        elevation: 5,
        shadowOffset: {
            width: 0,
            height: 0,
        }
    },
    formPickerItem: {
        fontSize: 15,
        color: Colours.dark
    }
})

export default Settings;