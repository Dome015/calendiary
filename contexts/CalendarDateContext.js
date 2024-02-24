import { createContext } from "react";

const CalendarDateContext = createContext({ value: new Date(), setValue: () => { } });

export default CalendarDateContext;