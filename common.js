import Holidays from "date-holidays";
import PushNotification, { Importance } from "react-native-push-notification";

const hd = new Holidays();
hd.init("IT");
const dayStr = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const monthStr = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/**
 * Check if the given date is either a nationa holiday or a weekend day.
 * @param {Date} date 
 * @returns {boolean}
 */
export const isRed = date => hd.isHoliday(date) || [0, 6].includes(date.getDay());

/**
 * Check if the given date is today.
 * @param {Date} date 
 * @returns {boolean}
 */
export const isToday = date => {
    const today = new Date();
    return (date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear());
}

/**
 * Returns the name of the weekday for the given date.
 * @param {Date} date 
 * @returns {string}
 */
export const getDayOfWeekName = date => dayStr[date.getDay()];

/**
 * Returns a string for the date in the format "MMM D, YYYY".
 * @param {Date} date 
 * @returns {string}
 */
export const getFormattedDate = date => date.toLocaleDateString("en-UK", { year: "numeric", month: "short", day: "numeric"});

export const getFormattedTime = date => date.toLocaleTimeString("en-UK", { hour: '2-digit', minute: '2-digit', hour12: true });

export const getFormattedDateTime = date => `${getFormattedDate(date)} ${date.toLocaleTimeString("en-UK", { hour: '2-digit', minute: '2-digit', hour12: true })}`;

/**
 * Returns a string for the date in the format "YYYY-MM-DD".
 * @param {Date} date 
 * @returns {string}
 */
export const getDateString = date => getYear(date) + "-" + ("0" + date.getMonth()).slice(-2) + "-" + ("0" + date.getDate()).slice(-2);

/**
 * Returns the first 3 letters of the month of the given date.
 * @param {Date} date 
 * @returns {string}
 */
export const getMonthName = date => monthStr[date.getMonth()];

export const getDay = date => date.getDate();

export const getYear = date => 1900 + date.getYear();

/**
 * Returns a list of holiday names associated to the give date, or false if there are none.
 * @param {Date} date 
 * @returns {string[]|false}
 */
export const getHolidays = date => {
    const holidays = hd.isHoliday(date);
    if (holidays)
        return holidays.map(h => h.name).join(", ");
    return false;
}

export const notificationHourOffset = 1;
export const notificationMinuteOffset = 0;

// Notifications

/**
 * Unschedules the notification for the given event, if there is one.
 * @param {{id: number, description: string, date: string, notification: boolean}} event 
 */
export const unscheduleEventNotification = event => {
    console.log("Unscheduling notification for event:");
    console.log(event);
    PushNotification.cancelLocalNotification(`${event.id}`);
}

/**
 * Schedules a notification for the given event, with the given hour/minute offset
 * in respect to its time. It doesn't schedule the notification if the computed
 * notification time is before the current time. It returns true or false depending
 * on whether the notification has been scheduled or not.
 * It also checks if event.notification is true.
 * @param {{id: number, description: string, date: string, notification: boolean}} event 
 * @param {number} hourOffset
 * @param {number} minuteOffset
 * @return {boolean}
 */
export const scheduleEventNotification = (event, hourOffset, minuteOffset) => {
    if (!event.notification)
        return false;
    const scheduleDate = new Date(event.date);
    scheduleDate.setHours(scheduleDate.getHours() - hourOffset);
    scheduleDate.setMinutes(scheduleDate.getMinutes() - minuteOffset);
    if (scheduleDate.getTime() > new Date().getTime()) {
        // Unschedule previous notification if there was one
        unscheduleEventNotification(event);
        // Schedule new one
        console.log("Scheduling notification for event:");
        console.log(event);
        console.log("For date:");
        console.log(scheduleDate);
        PushNotification.localNotificationSchedule({
            id: `${event.id}`,
            channelId: "calendiary",
            title: "⏰ Upcoming Event!",
            message: event.description,
            date: scheduleDate,
            allowWhileIdle: true, 
            importance: Importance.HIGH,
            priority: "high"
        });
        return true;
    }
    return false;
}

export const Colours = {
    main: "#0066ff",
    secondary: "white",
    secondaryVariant: "#ededed",
    inactive: "#cccccc"
};