import { StyleSheet, Text, View } from "react-native";
import { Colours, getDayOfWeekName, getFormattedDate, isRed } from "../common";
import { useContext } from "react";
import SettingsContext from "../contexts/SettingsContext";

function CalendarDate({ date, large }) {
    const settingsContext = useContext(SettingsContext);

    return (
        <View style={styles.dateView}>
            <Text style={[styles.dateText, { color: isRed(date, settingsContext.location) ? Colours.danger : Colours.main }, large ? { fontSize: 22 } : { fontSize: 18 }]}>{getFormattedDate(date)}</Text>
            <Text style={[styles.dateTextSmall, { color: isRed(date, settingsContext.location) ? Colours.danger : Colours.main }, large ? { fontSize: 15 } : { fontSize: 15 }]}>{getDayOfWeekName(date)}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    dateView: {
        marginBottom: "2%",
        marginLeft: "3%",
        marginRight: "3%"
    },
    dateText: {
        fontWeight: "bold",
        fontFamily: "consolas"
    },
    dateTextSmall: {
    }
})

export default CalendarDate;