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

    const today = new Date();

    const loadContent = async () => {
        try {
            const groupedList = [];

            // Load holidays
            const location = settingsContext.location;
            console.log("For: " + location);
            const hd = new Holidays(location);
            const limit = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000); // Adding 30 days to today
            for (let day = new Date(today); day <= limit; day.setDate(day.getDate() + 1)) {
                const holidays = hd.isHoliday(day);
                console.log("For date: " + day.toString());
                console.log("Holidays:");
                console.log(holidays);
                if (holidays) {
                    for (const h of holidays) {
                        const e = { date: day.toISOString(), description: h.name, type: "holiday" };
                        const dateString = getDateString(day);
                        let group = groupedList.find(item => item.title === dateString);
                        if (!group) {
                            group = { title: dateString, data: [] };
                            groupedList.push(group);
                        }
                        group.data.push(e);
                    }
                }
            }

            // Load user events
            let list = await getEventsFromToday();
            list = list.map(e => ({ ...e, type: "user" }));
            for (const e of list) {
                const dateString = getDateString(new Date(e.date));
                let group = groupedList.find(item => item.title === dateString);
                if (!group) {
                    group = { title: dateString, data: [] };
                    groupedList.push(group);
                }
                group.data.push(e);
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
    }, [settingsContext.location]);

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
                    newGroupList.push({ title: getDateString(new Date(event.date)), data: [{ ...event, type: "user" }] });
                } else {
                    group.data.push({ ...event, type: "user" });
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
        setShowViewModal(true);
        setEventToEdit(event);
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
                {/* Today */}
                <CalendarDate date={today} large={true} />
                {groupedEventList.find(elem => elem.title === getDateString(today))?.data.map(
                    (item, index) =>
                        item.type === "user" ?
                            <EventEntry key={index} event={item} setGroupedEventList={setGroupedEventList} onMiddlePress={onEventView} large={true} />
                            :
                            <HolidayEventEntry key={index} event={item} large={true} />
                )}
                {/* Today + 1 to infinite */}
                <SectionList
                    sections={groupedEventList.filter(elem => elem.title !== getDateString(today))}
                    keyExtractor={(e, i) => i}
                    renderItem={({ item }) =>
                        item.type === "user" ?
                            <EventEntry event={item} setGroupedEventList={setGroupedEventList} onMiddlePress={onEventView} large={false} />
                            :
                            <HolidayEventEntry event={item} large={false} />
                    }
                    renderSectionHeader={({ section }) => section.data.length > 0 ? <CalendarDate date={new Date(section.title)} large={false} /> : null}
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