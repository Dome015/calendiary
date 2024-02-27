import { createContext } from "react";

const SettingsContext = createContext({ location: "US", setLocation: () => {}, timeFormat: "24", setTimeFormat: () => {} });

export default SettingsContext;