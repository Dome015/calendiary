import { Text, View } from "react-native";
import { getDayOfWeekName, getFormattedDate } from "../common";

function CalendarDate({ date }) {
    return ( 
        <View>
            <Text>{getFormattedDate(date)}</Text>
            <Text>{getDayOfWeekName(date)}</Text>
        </View>
     );
}

export default CalendarDate;