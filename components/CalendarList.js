import { useContext, useEffect, useState } from "react";
import AddEventModal from "./AddEventModal";
import { deleteEventById, getEventsFromToday } from "../db/database";
import { getDateString, unscheduleEventNotification } from "../common";
import { SectionList, StyleSheet, View } from "react-native";
import EventEntry from "./EventEntry";
import CalendarDate from "./CalendarDate";
import AddEventButton from "./AddEventButton";
import ViewEventModal from "./ViewEventModal";
import SettingsContext from "../contexts/SettingsContext";
import Holidays from "date-holidays";
import HolidayEventEntry from "./HolidayEventEntry";

function CalendarList() {
    const [groupedEventList, setGroupedEventList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [eventToEdit, setEventToEdit] = useState(null);
    const [showViewModal, setShowViewModal] = useState(false);

    const settingsContext = useContext(SettingsContext);

    const loadContent = async () => {
        try {
            const groupedList = [];
            // Load holidays
            const hd = new Holidays(settingsContext.location);
            const day = new Date();
            const limit = new Date();
            limit.setDate(limit.getDate() + 60);
            while (day.getTime() <= limit.getTime()) {
                const holidays = hd.isHoliday(day);
                if (holidays) {
                    console.log(day);
                    console.log(holidays);
                    for (const h of holidays) {
                        const e = { date: day.toISOString(), description: h.name, type: "holiday" };
                        console.log(e);
                        const group = groupedList.find(item => item.title === getDateString(day));
                        if (!group) {
                            groupedList.push(
                                { title: getDateString(day), data: [e] }
                            );
                        } else {
                            group.data.push(e);
                        }
                    }
                }
                day.setDate(day.getDate() + 1);
            }
            // Load user events
            let list = await getEventsFromToday();
            list = list.map(e => ({...e, type: "user"}));
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
            groupedList.sort((a, b) => a.title.localeCompare(b.title));
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
            setEventToEdit(null);
            // Update database
            deleteEventById(event.id);
            // Unschedule notification
            unscheduleEventNotification(event, settingsContext.timeFormat);
            // Update state
            setGroupedEventList(oldGroupList => {
                const newGroupList = [...oldGroupList];
                const entry = newGroupList.find(el => el.title === getDateString(new Date(event.date)));
                entry.data = entry.data.filter(el => el.id !== event.id);
                return newGroupList;
            });
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
                    newGroupList.push({ title: getDateString(new Date(event.date)), data: [{ ...event, type: "normal" }] });
                } else {
                    group.data.push({ ...event, type: "normal" });
                    group.data.sort((a, b) => a.date.localeCompare(b.date));
                }
                newGroupList.sort((a, b) => a.title.localeCompare(b.title));
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
                    let newGroup = newGroupList.find(elem => elem.title === getDateString(new Date(event.date)));
                    if (!newGroup) {
                        // The group for this date doesn't currently exist - create it with the new event
                        newGroup = { title: getDateString(new Date(event.date)), data: [{ ...event, type: "normal" }] };
                        newGroupList.push(newGroup);
                    } else {
                        // The group for this date already exists - add the new event
                        newGroup.data.push({ ...event, type: "normal" });
                        newGroup.data.sort((a, b) => a.date.localeCompare(b.date));
                    }
                }
                newGroupList.sort((a, b) => a.title.localeCompare(b.title));
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
            <View style={styles.listView}>
                <SectionList
                    sections={groupedEventList}
                    keyExtractor={(e, i) => i}
                    renderItem={({ item }) =>
                        item.type === "user" ?
                        <EventEntry event={item} setGroupedEventList={setGroupedEventList} onMiddlePress={onEventView} />
                        :
                        <HolidayEventEntry event={item}/>
                    }
                    renderSectionHeader={({ section }) => section.data.length > 0 ? <CalendarDate date={new Date(section.title)} /> : null}
                    refreshing={loading}
                />
            </View>
            <AddEventButton onPress={() => setShowAddModal(true)} />
            <ViewEventModal event={eventToEdit} setEvent={setEventToEdit} show={showViewModal} setShow={setShowViewModal} setShowEdit={setShowAddModal} onDelete={onDelete} />
            <AddEventModal show={showAddModal} setShow={setShowAddModal} onAdd={onAdd} eventToEdit={eventToEdit} onEdit={onEdit} setEventToEdit={setEventToEdit} setShowView={setShowViewModal} />
        </>
    );
}

const styles = StyleSheet.create({
    listView: {
        marginTop: "3%"
    }
});

export default CalendarList;