import { useEffect, useState } from "react";
import AddEventModal from "./AddEventModal";
import { deleteEventById, getEventsFromToday } from "../db/database";
import { getDateString, unscheduleEventNotification } from "../common";
import { SectionList } from "react-native";
import EventEntry from "./EventEntry";
import CalendarDate from "./CalendarDate";
import AddEventButton from "./AddEventButton";
import ViewEventModal from "./ViewEventModal";

function CalendarList() {
    const [groupedEventList, setGroupedEventList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [eventToEdit, setEventToEdit] = useState(null);
    const [showViewModal, setShowViewModal] = useState(false);

    const loadContent = async () => {
        try {
            const list = await getEventsFromToday();
            const groupedList = [];
            for (const e of list) {
                const group = groupedList.find(item => item.title === getDateString(new Date(e.date)));
                if (!group) {
                    groupedList.push(
                        { title: getDateString(new Date(e.date)), data: [e] }
                    );
                } else {
                    group.data.push(e);
                }
            }
            setGroupedEventList(groupedList);
            setLoading(false);
        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        loadContent();
    }, []);

    const onDelete = async (event) => {
        try {
            // Update database
            await deleteEventById(event.id);
            // Unschedule notification
            unscheduleEventNotification(event);
            // Update state
            setGroupedEventList(oldGroupList => {
                const newGroupList = [...oldGroupList];
                const entry = newGroupList.find(el => el.title === getDateString(new Date(event.date)));
                entry.data = entry.data.filter(el => el.id !== event.id);
                return newGroupList;
            });
            setShowViewModal(false);
            setEventToEdit(null);
        } catch (e) {
            console.log(e);
        }
    }

    
    const onAdd = (event) => {
        try {
            // Update state
            setGroupedEventList(oldGroupList => {
                const newGroupList = [...oldGroupList];
                const group = newGroupList.find(elem => elem.title === getDateString(new Date(event.date)));
                if (!group) {
                    newGroupList.push({ title: getDateString(new Date(event.date)), data: [event] });
                } else {
                    group.data.push(event);
                    group.data.sort((a, b) => a.date.localeCompare(b.date));
                }
                return newGroupList;
            });
        } catch (e) {
            console.log(e);
        }
    }

    const onEventView = (event) => {
        setEventToEdit(event);
        setShowViewModal(true);
    }

    const onEdit = (event) => {
        try {
            // Update state
            setGroupedEventList(oldGroupList => {
                const newGroupList = [...oldGroupList];
                if (eventToEdit.date === event.date) {
                    const group = newGroupList.find(elem => elem.title === getDateString(new Date(eventToEdit.date)));
                    let oldEvent = group.data.find(elem => elem.id === eventToEdit.id);
                    Object.assign(oldEvent, event);
                } else {
                    let group = newGroupList.find(elem => elem.title === getDateString(new Date(eventToEdit.date)));
                    group.data = group.data.filter(elem => elem.id !== eventToEdit.id);
                    console.log(group.data);
                    let newGroup = newGroupList.find(elem => elem.title === getDateString(new Date(event.date)));
                    if (!newGroup) {
                        // The group for this date doesn't currently exist - create it with the new event
                        newGroup = { title: getDateString(new Date(event.date)), data: [event] };
                        newGroupList.push(newGroup);
                    } else {
                        // The group for this date already exists - add the new event
                        newGroup.data.push(event);
                        newGroup.data.sort((a, b) => a.date.localeCompare(b.date));
                    }
                }
                return newGroupList;
            });
            // Reset event to edit
            setEventToEdit(null);
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <>
        <SectionList
            sections={groupedEventList}
            keyExtractor={(e, i) => i}
            renderItem={({ item }) => <EventEntry event={item} setGroupedEventList={setGroupedEventList} onMiddlePress={onEventView} />}
            renderSectionHeader={({ section }) => section.data.length > 0 ? <CalendarDate date={new Date(section.title)} /> : null}
            refreshing={loading}
        />
        <AddEventButton onPress={() => setShowAddModal(true)} />
        <ViewEventModal event={eventToEdit} setEvent={setEventToEdit} show={showViewModal} setShow={setShowViewModal} setShowEdit={setShowAddModal} onDelete={onDelete} />
        <AddEventModal show={showAddModal} setShow={setShowAddModal} onAdd={onAdd} eventToEdit={eventToEdit} onEdit={onEdit} setEventToEdit={setEventToEdit} setShowView={setShowViewModal} />
        </>
    );
}

export default CalendarList;