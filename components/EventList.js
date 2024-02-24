import { useState, useEffect } from "react";
import EventEntry from "./EventEntry";
import EmptyEntry from "./EmptyEntry";
import { getEventsByDate, deleteEventById } from "../db/database";
import AddEventButton from "./AddEventButton";
import { unscheduleEventNotification } from "../common";
import Loading from "./Loading";
import AddEventModal from "./AddEventModal";


function EventList({ date }) {
    const [eventList, setEventList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const list = await getEventsByDate(date.toISOString());
                setEventList(list);
                setIsLoading(false);
            } catch (e) {
                console.log(e);
            }
        }
        fetchEvents();
    }, [date]);

    const onDeleteConfirm = async (event) => {
        try {
            // Update database
            await deleteEventById(event.id);
            // Unschedule notification
            unscheduleEventNotification(event);
            // Update event list state
            setEventList(oldEventList => {
                let eventList = [...oldEventList];
                eventList = eventList.filter(e => e.id !== event.id);
                return eventList;
            });
        } catch (e) {
            console.log(e);
        }
    }

    const onAdd = (event) => {
        // Update event list state
        setEventList(oldEventList => {
            let eventList = [...oldEventList];
            eventList.push(event);
            eventList.sort((a, b) => a.date.localeCompare(b.date));
            return eventList;
        });
    }

    return ( 
        <>
            { isLoading && <Loading />}
            { !isLoading && eventList.length === 0 && <EmptyEntry /> }
            { !isLoading && eventList.length !== 0 && eventList.map(event => <EventEntry key={event.id} event={event} setEventList={setEventList} onDelete={onDeleteConfirm}/>) }
            <AddEventButton setShowModal={setShowModal} />
            <AddEventModal inDate={date} show={showModal} setShow={setShowModal} onAdd={onAdd} />
        </>
    );
}

export default EventList;