import { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import EventEntry from "./EventEntry";
import EmptyEntry from "./EmptyEntry";
import { getEventsByDate, deleteEventById } from "../db/database";
import AddEventModal from "./AddEventModal";
import AddEventButton from "./AddEventButton";
import { unscheduleEventNotification } from "../common";


function EventList({ navigation, date }) {
    const [eventList, setEventList] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    
    useFocusEffect(useCallback(() => {
        const fetchEvents = async () => {
            try {
                const list = await getEventsByDate(date.toISOString());
                setEventList(list);
            } catch (e) {
                console.log(e);
            }
        }
        fetchEvents();
    }, [date]));

    const onDeleteConfirm = async (event) => {
        try {
            await deleteEventById(event.id);
            // Unschedule notification
            unscheduleEventNotification(event);
            setEventList(oldEventList => {
                let eventList = [...oldEventList];
                eventList = eventList.filter(e => e.id !== event.id);
                return eventList;
            });
        } catch (e) {
            console.log(e);
        }
    }

    return ( 
        <>
            { eventList.length === 0 && <EmptyEntry /> }
            { eventList.map(event => <EventEntry key={event.id} event={event} setEventList={setEventList} navigation={navigation} onDelete={onDeleteConfirm}/>) }
            <AddEventButton setShowModal={setShowAddModal} />
            <AddEventModal inDate={date} show={showAddModal} setShow={setShowAddModal} />
        </>
    );
}

export default EventList;