import { useContext, useEffect, useRef, useState } from "react";
import { FlatList } from "react-native";
import CalendarEntry from "./CalendarEntry";
import Loading from "./Loading";
import CalendarDateContext from "../contexts/CalendarDateContext";

function CalendarList({ route }) {
    const [dates, setDates] = useState([]);
    const [loading, setLoading] = useState(true);

    const initialNumberOfDates = 7;
    const addedNumberOfDates = 5;

    const calendarDateContext = useContext(CalendarDateContext);

    const flatListRef = useRef();

    useEffect(() => {
        const initialDates = [];
        const today = calendarDateContext.value;
        // Populate with initial dates
        for (let i = 0; i < initialNumberOfDates; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            initialDates.push(date);
        }
        setDates(initialDates);
        setLoading(false);
        flatListRef.current?.scrollToIndex({ animated: "true", index: 0 });
    }, [calendarDateContext.value]);

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
            renderItem={element => <CalendarEntry key={element.index} date={element.item} />}
            onEndReachedThreshold={2}
            onEndReached={addNextDates}
            showsVerticalScrollIndicator={false}
            scrollsToTop={false}
            ref={flatListRef}
        />}
        { loading &&
            <Loading />
        }
        </>
    );
}

export default CalendarList;