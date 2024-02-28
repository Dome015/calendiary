import Holidays from "date-holidays";
import PushNotification, { Importance } from "react-native-push-notification";

const today = new Date();
const dayStr = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const monthStr = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/**
 * Check if the given date is either a national holiday or a weekend day based on
 * the given location.
 * @param {Date} date 
 * @param {string} location
 * @returns {boolean}
 */
export const isRed = (date, location) => {
    const hd = new Holidays();
    hd.init(location);
    return hd.isHoliday(date) || [0, 6].includes(date.getDay());
}

/**
 * Check if the given date is today.
 * @param {Date} date 
 * @returns {boolean}
 */
export const isToday = date => date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();

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
export const getFormattedDate = date => `${monthStr[date.getMonth()]} ${date.getDate()}, ${1900 + date.getYear()}`;

/**
 * Returns the formatted time, according to the given time format.
 * @param {Date} date 
 * @param {"12"|"24"} timeFormat 
 * @returns {string}
 */
export const getFormattedTime = (date, timeFormat) => date.toLocaleTimeString("en-UK", { hour: '2-digit', minute: '2-digit', hour12: (timeFormat === "12") });

/**
 * Returns the formatted date and time, according to the specified
 * time format, as "MMM D, YYYY HH:MM".
 * @param {Date} date 
 * @param {"12"|"24"} timeFormat 
 * @returns {string}
 */
export const getFormattedDateTime = (date, timeFormat) => `${getFormattedDate(date)} ${getFormattedTime(date, timeFormat)}`;

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
 * Returns a list of holiday names associated to the give date, or false if there are none,
 * based on the given location.
 * @param {Date} date 
 * @param {string} location
 * @returns {string}
 */
export const getHolidays = (date, location) => {
    const hd = new Holidays();
    hd.init(location);
    const holidays = hd.isHoliday(date);
    if (holidays)
        return holidays.map(h => h.name).join(", ");
    return false;
}

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
 * @param {{id: number, description: string, date: string, notification: boolean, notificationMinOffset: number|null}} event 
 * @param {string} timeFormat The used time format in the notification title.
 * @return {boolean}
 */
export const scheduleEventNotification = (event, timeFormat) => {
    if (!event.notification)
        return false;
    const scheduleDate = new Date(event.date);
    scheduleDate.setMinutes(scheduleDate.getMinutes() - event.notificationMinOffset);
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
            title: `⏰ Upcoming event at ${getFormattedTime(new Date(event.date), timeFormat)}!`,
            message: event.description,
            date: scheduleDate,
            allowWhileIdle: true, 
            importance: Importance.HIGH,
            priority: "high",
            playSound: true,
            soundName: "default"
        });
        return true;
    }
    return false;
}

/**
 * Converts a number of minutes into an object that contains the corresponding days, hours and minutes.
 * @param {number} minutes 
 * @returns {{days: number, hours: number, minutes: number}}
 */
export const getDhm = minutes => {
    let m = minutes;
    // Compute days
    const days = Math.floor(m / (24*60));
    m -= days * 24*60;
    // Compute hours
    const hours = Math.floor(m / 60);
    m -= hours * 60;
    // Return 
    return {
        days: days,
        hours: hours,
        minutes: m
    };
}

/**
 * Returns the total number of minutes for the given d/h/m.
 * @param {number} days 
 * @param {number} hours 
 * @param {number} minutes 
 * @returns {number}
 */
export const getMinutes = (days, hours, minutes) => days*24*60 + hours*60 + minutes;


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
        throw new Error('colors must be provided as hexes');

    if (color2.length != 4 && color2.length != 7)
        throw new Error('colors must be provided as hexes');    

    if (percentage > 1 || percentage < 0)
        throw new Error('percentage must be between 0 and 1');

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
    secondary: "#ffffff",
    secondaryVariant: "#ededed",
    inactive: "#999999",
    dark: "#404040",
    danger: "#cc0000"
};

export const Countries = {
    // CREDIT: Louis Lazaris
    list: [
        {"name": "Albania", "code": "AL"},
        {"name": "Åland Islands", "code": "AX"},
        {"name": "Algeria", "code": "DZ"},
        {"name": "American Samoa", "code": "AS"},
        {"name": "Andorra", "code": "AD"},
        {"name": "Angola", "code": "AO"},
        {"name": "Anguilla", "code": "AI"},
        {"name": "Antarctica", "code": "AQ"},
        {"name": "Antigua and Barbuda", "code": "AG"},
        {"name": "Argentina", "code": "AR"},
        {"name": "Armenia", "code": "AM"},
        {"name": "Aruba", "code": "AW"},
        {"name": "Australia", "code": "AU"},
        {"name": "Austria", "code": "AT"},
        {"name": "Azerbaijan", "code": "AZ"},
        {"name": "Bahamas", "code": "BS"},
        {"name": "Bahrain", "code": "BH"},
        {"name": "Bangladesh", "code": "BD"},
        {"name": "Barbados", "code": "BB"},
        {"name": "Belarus", "code": "BY"},
        {"name": "Belgium", "code": "BE"},
        {"name": "Belize", "code": "BZ"},
        {"name": "Benin", "code": "BJ"},
        {"name": "Bermuda", "code": "BM"},
        {"name": "Bhutan", "code": "BT"},
        {"name": "Bolivia", "code": "BO"},
        {"name": "Bonaire, Sint Eustatius and Saba", "code": "BQ"},
        {"name": "Bosnia and Herzegovina", "code": "BA"},
        {"name": "Botswana", "code": "BW"},
        {"name": "Bouvet Island", "code": "BV"},
        {"name": "Brazil", "code": "BR"},
        {"name": "British Indian Ocean Territory", "code": "IO"},
        {"name": "Brunei Darussalam", "code": "BN"},
        {"name": "Bulgaria", "code": "BG"},
        {"name": "Burkina Faso", "code": "BF"},
        {"name": "Burundi", "code": "BI"},
        {"name": "Cabo Verde", "code": "CV"},
        {"name": "Cambodia", "code": "KH"},
        {"name": "Cameroon", "code": "CM"},
        {"name": "Canada", "code": "CA"},
        {"name": "Cayman Islands", "code": "KY"},
        {"name": "Central African Republic", "code": "CF"},
        {"name": "Chad", "code": "TD"},
        {"name": "Chile", "code": "CL"},
        {"name": "China", "code": "CN"},
        {"name": "Christmas Island", "code": "CX"},
        {"name": "Cocos (Keeling) Islands", "code": "CC"},
        {"name": "Colombia", "code": "CO"},
        {"name": "Comoros", "code": "KM"},
        {"name": "Congo (the Democratic Republic of the)", "code": "CD"},
        {"name": "Congo", "code": "CG"},
        {"name": "Cook Islands", "code": "CK"},
        {"name": "Costa Rica", "code": "CR"},
        {"name": "Croatia", "code": "HR"},
        {"name": "Cuba", "code": "CU"},
        {"name": "Curaçao", "code": "CW"},
        {"name": "Cyprus", "code": "CY"},
        {"name": "Czechia", "code": "CZ"},
        {"name": "Côte d'Ivoire", "code": "CI"},
        {"name": "Denmark", "code": "DK"},
        {"name": "Djibouti", "code": "DJ"},
        {"name": "Dominica", "code": "DM"},
        {"name": "Dominican Republic", "code": "DO"},
        {"name": "Ecuador", "code": "EC"},
        {"name": "Egypt", "code": "EG"},
        {"name": "El Salvador", "code": "SV"},
        {"name": "Equatorial Guinea", "code": "GQ"},
        {"name": "Eritrea", "code": "ER"},
        {"name": "Estonia", "code": "EE"},
        {"name": "Eswatini", "code": "SZ"},
        {"name": "Ethiopia", "code": "ET"},
        {"name": "Falkland Islands [Malvinas]", "code": "FK"},
        {"name": "Faroe Islands", "code": "FO"},
        {"name": "Fiji", "code": "FJ"},
        {"name": "Finland", "code": "FI"},
        {"name": "France", "code": "FR"},
        {"name": "French Guiana", "code": "GF"},
        {"name": "French Polynesia", "code": "PF"},
        {"name": "French Southern Territories", "code": "TF"},
        {"name": "Gabon", "code": "GA"},
        {"name": "Gambia", "code": "GM"},
        {"name": "Georgia", "code": "GE"},
        {"name": "Germany", "code": "DE"},
        {"name": "Ghana", "code": "GH"},
        {"name": "Gibraltar", "code": "GI"},
        {"name": "Greece", "code": "GR"},
        {"name": "Greenland", "code": "GL"},
        {"name": "Grenada", "code": "GD"},
        {"name": "Guadeloupe", "code": "GP"},
        {"name": "Guam", "code": "GU"},
        {"name": "Guatemala", "code": "GT"},
        {"name": "Guernsey", "code": "GG"},
        {"name": "Guinea", "code": "GN"},
        {"name": "Guinea-Bissau", "code": "GW"},
        {"name": "Guyana", "code": "GY"},
        {"name": "Haiti", "code": "HT"},
        {"name": "Heard Island and McDonald Islands", "code": "HM"},
        {"name": "Holy See", "code": "VA"},
        {"name": "Honduras", "code": "HN"},
        {"name": "Hong Kong", "code": "HK"},
        {"name": "Hungary", "code": "HU"},
        {"name": "Iceland", "code": "IS"},
        {"name": "India", "code": "IN"},
        {"name": "Indonesia", "code": "ID"},
        {"name": "Iran", "code": "IR"},
        {"name": "Iraq", "code": "IQ"},
        {"name": "Ireland", "code": "IE"},
        {"name": "Isle of Man", "code": "IM"},
        {"name": "Israel", "code": "IL"},
        {"name": "Italy", "code": "IT"},
        {"name": "Jamaica", "code": "JM"},
        {"name": "Japan", "code": "JP"},
        {"name": "Jersey", "code": "JE"},
        {"name": "Jordan", "code": "JO"},
        {"name": "Kazakhstan", "code": "KZ"},
        {"name": "Kenya", "code": "KE"},
        {"name": "Kiribati", "code": "KI"},
        {"name": "Korea", "code": "KP"},
        {"name": "Korea", "code": "KR"},
        {"name": "Kuwait", "code": "KW"},
        {"name": "Kyrgyzstan", "code": "KG"},
        {"name": "Lao People's Democratic Republic", "code": "LA"},
        {"name": "Latvia", "code": "LV"},
        {"name": "Lebanon", "code": "LB"},
        {"name": "Lesotho", "code": "LS"},
        {"name": "Liberia", "code": "LR"},
        {"name": "Libya", "code": "LY"},
        {"name": "Liechtenstein", "code": "LI"},
        {"name": "Lithuania", "code": "LT"},
        {"name": "Luxembourg", "code": "LU"},
        {"name": "Macao", "code": "MO"},
        {"name": "Madagascar", "code": "MG"},
        {"name": "Malawi", "code": "MW"},
        {"name": "Malaysia", "code": "MY"},
        {"name": "Maldives", "code": "MV"},
        {"name": "Mali", "code": "ML"},
        {"name": "Malta", "code": "MT"},
        {"name": "Marshall Islands", "code": "MH"},
        {"name": "Martinique", "code": "MQ"},
        {"name": "Mauritania", "code": "MR"},
        {"name": "Mauritius", "code": "MU"},
        {"name": "Mayotte", "code": "YT"},
        {"name": "Mexico", "code": "MX"},
        {"name": "Micronesia", "code": "FM"},
        {"name": "Moldova", "code": "MD"},
        {"name": "Monaco", "code": "MC"},
        {"name": "Mongolia", "code": "MN"},
        {"name": "Montenegro", "code": "ME"},
        {"name": "Montserrat", "code": "MS"},
        {"name": "Morocco", "code": "MA"},
        {"name": "Mozambique", "code": "MZ"},
        {"name": "Myanmar", "code": "MM"},
        {"name": "Namibia", "code": "NA"},
        {"name": "Nauru", "code": "NR"},
        {"name": "Nepal", "code": "NP"},
        {"name": "Netherlands", "code": "NL"},
        {"name": "New Caledonia", "code": "NC"},
        {"name": "New Zealand", "code": "NZ"},
        {"name": "Nicaragua", "code": "NI"},
        {"name": "Niger", "code": "NE"},
        {"name": "Nigeria", "code": "NG"},
        {"name": "Niue", "code": "NU"},
        {"name": "Norfolk Island", "code": "NF"},
        {"name": "Northern Mariana Islands", "code": "MP"},
        {"name": "Norway", "code": "NO"},
        {"name": "Oman", "code": "OM"},
        {"name": "Pakistan", "code": "PK"},
        {"name": "Palau", "code": "PW"},
        {"name": "Palestine, State of", "code": "PS"},
        {"name": "Panama", "code": "PA"},
        {"name": "Papua New Guinea", "code": "PG"},
        {"name": "Paraguay", "code": "PY"},
        {"name": "Peru", "code": "PE"},
        {"name": "Philippines", "code": "PH"},
        {"name": "Pitcairn", "code": "PN"},
        {"name": "Poland", "code": "PL"},
        {"name": "Portugal", "code": "PT"},
        {"name": "Puerto Rico", "code": "PR"},
        {"name": "Qatar", "code": "QA"},
        {"name": "Republic of North Macedonia", "code": "MK"},
        {"name": "Romania", "code": "RO"},
        {"name": "Russian Federation", "code": "RU"},
        {"name": "Rwanda", "code": "RW"},
        {"name": "Réunion", "code": "RE"},
        {"name": "Saint Barthélemy", "code": "BL"},
        {"name": "Saint Helena, Ascension and Tristan da Cunha", "code": "SH"},
        {"name": "Saint Kitts and Nevis", "code": "KN"},
        {"name": "Saint Lucia", "code": "LC"},
        {"name": "Saint Martin (French part)", "code": "MF"},
        {"name": "Saint Pierre and Miquelon", "code": "PM"},
        {"name": "Saint Vincent and the Grenadines", "code": "VC"},
        {"name": "Samoa", "code": "WS"},
        {"name": "San Marino", "code": "SM"},
        {"name": "Sao Tome and Principe", "code": "ST"},
        {"name": "Saudi Arabia", "code": "SA"},
        {"name": "Senegal", "code": "SN"},
        {"name": "Serbia", "code": "RS"},
        {"name": "Seychelles", "code": "SC"},
        {"name": "Sierra Leone", "code": "SL"},
        {"name": "Singapore", "code": "SG"},
        {"name": "Sint Maarten (Dutch part)", "code": "SX"},
        {"name": "Slovakia", "code": "SK"},
        {"name": "Slovenia", "code": "SI"},
        {"name": "Solomon Islands", "code": "SB"},
        {"name": "Somalia", "code": "SO"},
        {"name": "South Africa", "code": "ZA"},
        {"name": "South Georgia and the South Sandwich Islands", "code": "GS"},
        {"name": "South Sudan", "code": "SS"},
        {"name": "Spain", "code": "ES"},
        {"name": "Sri Lanka", "code": "LK"},
        {"name": "Sudan", "code": "SD"},
        {"name": "Suriname", "code": "SR"},
        {"name": "Svalbard and Jan Mayen", "code": "SJ"},
        {"name": "Sweden", "code": "SE"},
        {"name": "Switzerland", "code": "CH"},
        {"name": "Syrian Arab Republic", "code": "SY"},
        {"name": "Taiwan", "code": "TW"},
        {"name": "Tajikistan", "code": "TJ"},
        {"name": "Tanzania", "code": "TZ"},
        {"name": "Thailand", "code": "TH"},
        {"name": "Timor-Leste", "code": "TL"},
        {"name": "Togo", "code": "TG"},
        {"name": "Tokelau", "code": "TK"},
        {"name": "Tonga", "code": "TO"},
        {"name": "Trinidad and Tobago", "code": "TT"},
        {"name": "Tunisia", "code": "TN"},
        {"name": "Turkey", "code": "TR"},
        {"name": "Turkmenistan", "code": "TM"},
        {"name": "Turks and Caicos Islands", "code": "TC"},
        {"name": "Tuvalu", "code": "TV"},
        {"name": "Uganda", "code": "UG"},
        {"name": "Ukraine", "code": "UA"},
        {"name": "United Arab Emirates", "code": "AE"},
        {"name": "UK", "code": "GB"},
        {"name": "United States Minor Outlying Islands", "code": "UM"},
        {"name": "USA", "code": "US"},
        {"name": "Uruguay", "code": "UY"},
        {"name": "Uzbekistan", "code": "UZ"},
        {"name": "Vanuatu", "code": "VU"},
        {"name": "Venezuela", "code": "VE"},
        {"name": "Viet Nam", "code": "VN"},
        {"name": "Virgin Islands (British)", "code": "VG"},
        {"name": "Virgin Islands (U.S.)", "code": "VI"},
        {"name": "Wallis and Futuna", "code": "WF"},
        {"name": "Western Sahara", "code": "EH"},
        {"name": "Yemen", "code": "YE"},
        {"name": "Zambia", "code": "ZM"},
        {"name": "Zimbabwe", "code": "ZW"}
    ]
};