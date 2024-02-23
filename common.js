import Holidays from "date-holidays";
import dayjs from "dayjs";

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
export const getFormattedDate = date => getMonthName(date) + " " + getDay(date) + ", " + getYear(date);

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