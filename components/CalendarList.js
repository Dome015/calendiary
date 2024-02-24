import { useContext, useEffect, useRef, useState } from "react";
import { FlatList } from "react-native";
import CalendarEntry from "./CalendarEntry";
import Loading from "./Loading";
import CalendarDateContext from "../contexts/CalendarDateContext";

function CalendarList() {
    const [dates, setDates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dirty, setDirty] = useState(false);

    

    const initialNumberOfDates = 7;
    const addedNumberOfDates = 5;

    const calendarDateContext = useContext(CalendarDateContext);

    const flatListRef = useRef();

    const loadContent = () => {
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
    }

    useEffect(() => {
        loadContent();
        flatListRef.current?.scrollToIndex({ animated: "true", index: 0 });
    }, [calendarDateContext.value]);

    useEffect(() => {
        if (dirty) {
            loadContent();
            setDirty(false);
        }
    }, [dirty]);

    // To force refresh after event add
    useEffect(() => {
        console.log("Dirty detected");
        if (dirty)
            setDirty(false);
    }, [dirty])

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
            renderItem={element => <CalendarEntry key={element.index} date={element.item} setDirty={setDirty} />}
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