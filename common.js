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
export const getDateString = date => getYear(date) + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2);

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
 * It also checks if event.notification is true, and removes the previously scheduled
 * notification if there is one already.
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

/**
    CREDIT: Teddy Garland
    Blend two colors to create the color that is at the percentage away from the first color
    this is a 5 step process
        1: validate input
        2: convert input to 6 char hex
        3: convert hex to rgb
        4: take the percentage to create a ratio between the two colors
        5: convert blend to hex
    @param: color1      => the first color, hex (ie: #000000)
    @param: color2      => the second color, hex (ie: #ffffff)
    @param: percentage  => the distance from the first color, as a decimal between 0 and 1 (ie: 0.5)
    @returns: string    => the third color, hex, represenatation of the blend between color1 and color2 at the given percentage
*/
export function blendColors(color1, color2, percentage)
{
    // check input
    color1 = color1 || '#000000';
    color2 = color2 || '#ffffff';
    percentage = percentage || 0.5;

    // 1: validate input, make sure we have provided a valid hex
    if (color1.length != 4 && color1.length != 7)
        throw new error('colors must be provided as hexes');

    if (color2.length != 4 && color2.length != 7)
        throw new error('colors must be provided as hexes');    

    if (percentage > 1 || percentage < 0)
        throw new error('percentage must be between 0 and 1');

    // 2: check to see if we need to convert 3 char hex to 6 char hex, else slice off hash
    //      the three character hex is just a representation of the 6 hex where each character is repeated
    //      ie: #060 => #006600 (green)
    if (color1.length == 4)
        color1 = color1[1] + color1[1] + color1[2] + color1[2] + color1[3] + color1[3];
    else
        color1 = color1.substring(1);
    if (color2.length == 4)
        color2 = color2[1] + color2[1] + color2[2] + color2[2] + color2[3] + color2[3];
    else
        color2 = color2.substring(1);   

    // 3: we have valid input, convert colors to rgb
    color1 = [parseInt(color1[0] + color1[1], 16), parseInt(color1[2] + color1[3], 16), parseInt(color1[4] + color1[5], 16)];
    color2 = [parseInt(color2[0] + color2[1], 16), parseInt(color2[2] + color2[3], 16), parseInt(color2[4] + color2[5], 16)];

    // 4: blend
    var color3 = [ 
        (1 - percentage) * color1[0] + percentage * color2[0], 
        (1 - percentage) * color1[1] + percentage * color2[1], 
        (1 - percentage) * color1[2] + percentage * color2[2]
    ];

    // 5: convert to hex
    color3 = '#' + int_to_hex(color3[0]) + int_to_hex(color3[1]) + int_to_hex(color3[2]);

    // return hex
    return color3;
}

/*
    convert a Number to a two character hex string
    must round, or we will end up with more digits than expected (2)
    note: can also result in single digit, which will need to be padded with a 0 to the left
    @param: num         => the number to conver to hex
    @returns: string    => the hex representation of the provided number
*/
function int_to_hex(num)
{
    var hex = Math.round(num).toString(16);
    if (hex.length == 1)
        hex = '0' + hex;
    return hex;
}

export const Colours = {
    main: "#0066ff",
    secondary: "white",
    secondaryVariant: "#ededed",
    inactive: "#cccccc",
    dark: "#262626",
    danger: "#cc0000"
};