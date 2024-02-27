import { StyleSheet, Text, View } from "react-native";
import { Colours, getDayOfWeekName, getFormattedDate, getHolidays, isRed } from "../common";
import { useContext } from "react";
import SettingsContext from "../contexts/SettingsContext";

function CalendarDate({ date }) {
    const settingsContext = useContext(SettingsContext);
    const holidays = getHolidays(date, settingsContext.location);

    return (
        <View style={styles.dateView}>
            <Text style={[styles.dateText, { color: isRed(date, settingsContext.location) ? Colours.danger : Colours.main }]}>{getFormattedDate(date)}</Text>
            <Text style={[styles.dateTextSmall, { color: isRed(date, settingsContext.location) ? Colours.danger : Colours.main }]}>{getDayOfWeekName(date)}</Text>
            {holidays !== false &&
                <Text style={[styles.dateTextSmall, { color: isRed(date, settingsContext.location) ? Colours.danger : Colours.main }]}>{holidays}</Text>}
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
        fontSize: 20,
        fontWeight: "bold"
    },
    dateTextSmall: {
        fontSize: 15,
    }
})

export default CalendarDate;