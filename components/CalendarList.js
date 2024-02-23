import { useEffect, useState } from "react";
import { FlatList, Text } from "react-native";
import CalendarEntry from "./CalendarEntry";
import Loading from "./Loading";

function CalendarList({ navigation }) {
    const [dates, setDates] = useState([]);
    const [loading, setLoading] = useState(true);
    const initialNumberOfDates = 7;
    const addedNumberOfDates = 5;

    useEffect(() => {
        const initialDates = [];
        const today = new Date();
        // Populate with initial dates
        for (let i = 0; i < initialNumberOfDates; i++) {
            const date = new Date();
            date.setDate(today.getDate() + i);
            initialDates.push(date);
        }
        setDates(initialDates);
        setLoading(false);
    }, []);

    const addNextDates = () => {
        const startingDate = dates[dates.length - 1];
        const newDates = [];
        for (let i = 0; i < addedNumberOfDates; i++) {
            const date = new Date(startingDate);
            date.setDate(startingDate.getDate() + i + 1);
            newDates.push(date);
        }
        setDates(dates => dates.concat(newDates));
    };


    return (
        <>
        { !loading &&
        <FlatList 
            data={dates}
            renderItem={element => <CalendarEntry key={element.index} date={element.item} navigation={navigation} />}
            onEndReachedThreshold={2}
            onEndReached={addNextDates}
            showsVerticalScrollIndicator={false}
            scrollsToTop={false}
        />}
        { loading &&
            <Loading />
        }
        </>
    );
}

export default CalendarList;