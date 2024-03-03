import { useContext, useEffect, useState } from "react";
import AddEventModal from "./AddEventModal";
import { deleteEventById, getEventsFromToday, insertEvent, updateEvent } from "../db/database";
import { getDateString, getHolidays, scheduleEventNotification, unscheduleEventNotification } from "../common";
import { SectionList, StyleSheet, ToastAndroid, View } from "react-native";
import EventEntry from "./EventEntry";
import CalendarDate from "./CalendarDate";
import AddEventButton from "./AddEventButton";
import ViewEventModal from "./ViewEventModal";
import SettingsContext from "../contexts/SettingsContext";
import HolidayEventEntry from "./HolidayEventEntry";
import EmptyEntry from "./EmptyEntry";

function CalendarList() {
    const [groupedEventList, setGroupedEventList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [eventToEdit, setEventToEdit] = useState(null);
    const [showViewModal, setShowViewModal] = useState(false);

    const settingsContext = useContext(SettingsContext);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = getDateString(today);
    const holidayLimit = new Date(today.getTime() + 90 * 24 * 60 * 60 * 1000); // Adding 90 days to today

    const loadContent = async () => {
        try {
            const groupedList = [];

            // Load holidays
            for (let day = new Date(today); day <= holidayLimit; day.setDate(day.getDate() + 1)) {
                const holidays = getHolidays(day, settingsContext.location);
                if (holidays) {
                    const e = { date: day.toISOString(), description: holidays, type: "holiday" };
                    const dateString = getDateString(day);
                    let group = groupedList.find(item => item.title === dateString);
                    if (!group) {
                        group = { title: dateString, data: [] };
                        groupedList.push(group);
                    }
                    group.data.push(e);
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
                    // Check if there is an holiday and is beyond the limit
                    const groupDate = new Date(group.title);
                    const groupHolidays = getHolidays(groupDate, settingsContext.location);
                    if (groupDate > holidayLimit && groupHolidays) {
                        group.data.push({ date: groupDate.toISOString(), description: groupHolidays, type: "holiday" });
                    }
                    groupedList.push(group);
                }
                group.data.push(e);
            }

            if (!groupedList.find(e => e.title === todayStr)) {
                groupedList.push({ title: todayStr, data: [] });
            }

            groupedList.sort((a, b) => a.title.localeCompare(b.title));
            setGroupedEventList(groupedList);
        } catch (e) {
            console.log(e);
            ToastAndroid.showWithGravity(e, ToastAndroid.LONG, ToastAndroid.TOP);
        }
    }


    useEffect(() => {
        setLoading(true);
        loadContent();
        setLoading(false);
    }, [settingsContext.location]);

    const onDelete = async (event) => {
        setLoading(true);
        try {
            setEventToEdit(null);
            // Update state
            setGroupedEventList(oldGroupList => {
                let newGroupList = [...oldGroupList];
                const targetTitle = getDateString(new Date(event.date));
                const targetId = event.id;
                let targetGroup = newGroupList.find(elem => elem.title === targetTitle);
                targetGroup.data = targetGroup.data.filter(e => e.id !== targetId);
                return newGroupList;
            });
            // Update database
            deleteEventById(event.id);
            // Unschedule notification
            unscheduleEventNotification(event, settingsContext.timeFormat);
            ToastAndroid.showWithGravity("Event deleted", ToastAndroid.SHORT, ToastAndroid.TOP);
        } catch (e) {
            console.log(e);
            ToastAndroid.showWithGravity(e, ToastAndroid.LONG, ToastAndroid.TOP);
        }
        setLoading(false);
    }


    const onAdd = async (event) => {
        setLoading(true);
        try {
            const newEvent = {
                description: event.description,
                date: event.date.toISOString(),
                notification: event.notification,
                notificationMinOffset: event.notificationMinOffset,
            };
            const idFlag = Date.now();
            // Update state
            setGroupedEventList(oldGroupList => {
                let newGroupList = [...oldGroupList];
                const targetTitle = getDateString(event.date);
                // If group doesn't exist, create it
                let group = newGroupList.find(elem => elem.title === targetTitle);
                if (!group) {
                    group = { title: targetTitle, data: [] };
                    // Check for holidays
                    if (event.date > holidayLimit) {
                        const holidays = getHolidays(event.date, settingsContext.location);
                        if (holidays) {
                            group.data.push({ description: holidays, date: today.toISOString(), type: "holiday" });
                        }
                    }
                    newGroupList.push(group);
                }
                const eventToPush = { ...newEvent, type: "user" };
                eventToPush.id = -idFlag;
                group.data.push(eventToPush);
                return newGroupList;
            });
            // Add event to db, and update id on the state when done
            insertEvent(newEvent).then(eventId => {
                setGroupedEventList(oldGroupList => {
                    let newGroupList = [...oldGroupList];
                    let group = newGroupList.find(elem => elem.title === getDateString(event.date));
                    let oldEvent = group.data.find(e => e.id === -idFlag);
                    oldEvent.id = eventId;
                    return newGroupList;
                });
                setLoading(false);
            });
            // Schedule notification if necessary
            if (newEvent.notification) {
                scheduleEventNotification(newEvent, settingsContext.timeFormat);
            }
            // Toast
            ToastAndroid.showWithGravity("Event added", ToastAndroid.SHORT, ToastAndroid.TOP);
        } catch (e) {
            console.log(e);
            setLoading(false);
            ToastAndroid.showWithGravity(e, ToastAndroid.LONG, ToastAndroid.TOP);
        }
    }

    const onEventView = (event) => {
        setShowViewModal(true);
        setEventToEdit(event);
    }

    const onEdit = async (event) => {
        setLoading(true);
        try {
            // Update state
            setGroupedEventList(oldGroupList => {
                const newGroupList = [...oldGroupList];
                const originalTitle = getDateString(new Date(eventToEdit.date));
                const newTitle = getDateString(event.date);
                const originalGroup = newGroupList.find(elem => elem.title === originalTitle);
                const originalEvent = originalGroup.data.find(e => e.id === event.id);
                const newEvent = {...event};
                newEvent.date = newEvent.date.toISOString();
                if (newTitle === originalTitle) {
                    // Event is in the same group, just reassign values
                    Object.assign(originalEvent, newEvent);
                } else {
                    // Event is in another group
                    // First, remove event from old group
                    originalGroup.data = originalGroup.data.filter(e => e.id === event.id);
                    // Then, add the event to the new one
                    const newGroup = { title: newTitle, data: [] };
                    newGroupList.push(newGroup);
                    // Check for holidays
                    if (event.date > holidayLimit) {
                        const holidays = getHolidays(event.date, settingsContext.location);
                        if (holidays) {
                            newGroup.data.push({ description: holidays, date: today.toISOString(), type: "holiday" });
                        }
                    }
                    newGroup.data.push(newEvent);
                }
                return newGroupList;
            });
            // Reset event to edit
            setEventToEdit(null);
            // Update on db
            const updatedEvent = {...event};
            updatedEvent.date = updatedEvent.date.toISOString();
            updateEvent(updatedEvent);
            // Schedule notification if necessary
            if (event.notification)
                scheduleEventNotification(event, settingsContext.timeFormat);
            ToastAndroid.showWithGravity("Event edited", ToastAndroid.SHORT, ToastAndroid.TOP);
        } catch (e) {
            console.log(e);
            ToastAndroid.showWithGravity(e, ToastAndroid.LONG, ToastAndroid.TOP);
        }
        setLoading(false);
    }

    return (
        <>
            <View style={styles.listView}>
                <SectionList
                    ListFooterComponent={<View style={{ height: 70 }} />}
                    sections={groupedEventList}
                    keyExtractor={(e, i) => i}
                    renderItem={({ item, section }) =>
                        item.type === "user" ?
                            <EventEntry event={item} setGroupedEventList={setGroupedEventList} onMiddlePress={onEventView} large={section.title === todayStr} loading={loading}/>
                            :
                            <HolidayEventEntry event={item} large={section.title === todayStr} />
                    }
                    renderSectionHeader={({ section }) => section.data.length > 0 || section.title === todayStr ? 
                        <>
                            <CalendarDate date={new Date(section.title)} large={section.title === todayStr} />
                            { section.data.length === 0 && <EmptyEntry /> }
                        </>
                        : null
                    }
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
        paddingTop: "1%"
    }
});

export default CalendarList;