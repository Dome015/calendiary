import { useEffect, useState } from "react";
import Loading from "./Loading";
import AddEventModal from "./AddEventModal";
import { deleteEventById, getEventsFromToday } from "../db/database";
import { getDateString, unscheduleEventNotification } from "../common";
import { SectionList } from "react-native";
import EventEntry from "./EventEntry";
import CalendarDate from "./CalendarDate";
import AddEventButton from "./AddEventButton";

function CalendarList() {
    const [groupedEventList, setGroupedEventList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);

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
                entry.data = entry.data.filter(el => el.date !== getDateString(new Date(event.date)));
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
                    newGroupList.push({ title: getDateString(new Date(event.date)), data: [event] });
                } else {
                    group.data.push(event);
                }
                return newGroupList;
            });
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <>
        <SectionList
            sections={groupedEventList}
            keyExtractor={(e, i) => i}
            renderItem={({ item }) => <EventEntry event={item} onDelete={onDelete} />}
            renderSectionHeader={({section: {title}}) => <CalendarDate date={new Date(title)} />}
            refreshing={loading}
        />
        <AddEventButton onPress={() => {setShowAddModal(true); console.log("hi")}} />
        <AddEventModal show={showAddModal} setShow={setShowAddModal} onAdd={onAdd} />
        </>
    );
}

export default CalendarList;