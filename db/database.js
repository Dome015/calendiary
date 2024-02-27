import SQLite from "react-native-sqlite-storage";

const RESET_DATABASE = false;

const openDatabase = () => {
    return SQLite.openDatabase({ name: "calendario.db", location: "default" },
        () => console.log("Database successfully open"),
        e => console.log(e)
    );
};

const db = openDatabase();
console.log(db);

export const initDatabase = async () => {
    try {
        if (RESET_DATABASE) {
            await dropSettingsTable();
            await dropEventTable();
        }
        await createEventTable();
        await createSettingsTable();
        // Initialize location, default to US
        let setting = await getSettingByName("location");
        if (!setting) {
            setting = { name: "location", value: "US" };
            await insertSetting(setting);
        }
        // Initialize time format, default to 24
        setting = await getSettingByName("timeFormat");
        if (!setting) {
            setting = { name: "timeFormat", value: "12" };
            await insertSetting(setting);
        }
    } catch (e) {
        console.log(e);
    }
    
};

// Events

const createEventTable = async () => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                `CREATE TABLE IF NOT EXISTS Event (
                    id INTEGER PRIMARY KEY,
                    description TEXT NOT NULL,
                    date TEXT NOT NULL,
                    notification BOOLEAN NOT NULL DEFAULT FALSE,
                    notificationMinOffset INT NOT NULL DEFAULT 60
                );`,
                [],
                (tx, res) => resolve(),
                (tx, err) => reject(err.message)
            );
        });
    });
}

const dropEventTable = async () => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                `DROP TABLE Event;`,
                [],
                (tx, res) => resolve(),
                (tx, err) => reject(err.message)
            );
        });
    });
}

/**
 * Insert a new event in the
 * @param {{description: string, date: string, notification: boolean, notificationMinOffset: number|null}} event The event to add
 * @return {Promise<number>} The id of the newly created event
 */
export const insertEvent = async (event) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                `INSERT INTO Event (description, date, notification)
                VALUES (?, ?, ?);`,
                [event.description, event.date, event.notification],
                (tx, res) => resolve(res.insertId),
                (tx, err) => reject(err)
            );
        });
    });
}

/**
 * Updates the event based on its id. 
 * @param {{id: number, description: string, date: string, notification: boolean, notificationMinOffset: number|null}} event 
 */
export const updateEvent = async (event) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                `UPDATE Event SET description=?, date=?, notification=? WHERE id = ?`,
                [event.description, event.date, event.notification, event.id],
                (tx, res) => resolve(res.rowsAffected),
                (tx, err) => reject(err)
            );
        });
    });
}

export const deleteEventById = async (id) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                `DELETE FROM Event WHERE id = ?`,
                [id],
                (tx, res) => resolve(res.rowsAffected),
                (tx, err) => reject(err)
            );
        });
    });
}

/**
 * Get all the events for a given date
 * @param {string} date 
 * @returns {Promise<{id: number, description: string, date: string, notification: boolean, notificationMinOffset: number|null}[]>}
 */
export const getEventsByDate = async (date) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                "SELECT * FROM Event where DATE(date, 'localtime') = DATE(?, 'localtime') ORDER BY date",
                [date],
                (tx, res) => {
                    const result = [];
                    for (let i = 0; i < res.rows.length; i++) {
                        const item = {...res.rows.item(i)};
                        item.notification = Boolean(item.notification);
                        result.push(item);
                    }
                    resolve(result);
                },
                (tx, err) => reject(err)
            );
        });
    });
}

/**
 * Returns all events starting from today.
 * @returns {Promise<{id: number, description: string, date: string, notification: boolean, notificationMinOffset: number|null}[]>}
 */
export const getEventsFromToday = async () => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                "SELECT * FROM Event WHERE DATE(date, 'localtime') >= DATE(CURRENT_TIMESTAMP, 'localtime') ORDER BY date",
                [],
                (tx, res) => {
                    const result = [];
                    for (let i = 0; i < res.rows.length; i++) {
                        const item = {...res.rows.item(i)};
                        item.notification = Boolean(item.notification);
                        result.push(item);
                    }
                    resolve(result);
                },
                (tx, err) => reject(err)
            );
        });
    });
}

// Settings

const createSettingsTable = async () => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                `CREATE TABLE IF NOT EXISTS Settings (
                    name TEXT PRIMARY KEY,
                    value TEXT NOT NULL
                );`,
                [],
                (tx, res) => resolve(),
                (tx, err) => reject(err.message)
            );
        });
    });
}

const dropSettingsTable = async () => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                `DROP TABLE Settings;`,
                [],
                (tx, res) => resolve(),
                (tx, err) => reject(err.message)
            );
        });
    });
}

/**
 * Saves a new setting in the db
 * @param {{name: string, value: string}} setting 
 * @returns {Promise<boolean|*>} True in case of success, or an error in case of failure.  
 */
export const insertSetting = setting => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                `INSERT INTO Settings (name, value)
                VALUES (?, ?);`,
                [setting.name, setting.value],
                (tx, res) => resolve(true),
                (tx, err) => reject(err)
            );
        });
    });
}

/**
 * Updates the setting with the given name with the new value.
 * @param {{name: string, value: string}} setting 
 * @returns {Promise<number|*>} Number of rows affected or error.
 */
export const updateSetting = setting => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                `UPDATE Settings SET value=? WHERE name=?`,
                [setting.value, setting.name],
                (tx, res) => resolve(res.rowsAffected),
                (tx, err) => reject(err)
            );
        });
    });
}

/**
 * Retrieves a setting by its name.
 * @param {string} name - The name of the setting to retrieve.
 * @returns {Promise<{name: string, value: string}|null|*>} The setting object if found, or null if not found, or an error.
 */
export const getSettingByName = name => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                `SELECT * FROM Settings WHERE name=?;`,
                [name],
                (tx, res) => {
                    if (res.rows.length > 0) {
                        // Extract the setting object from the result
                        const setting = res.rows.item(0);
                        resolve(setting);
                    } else {
                        resolve(null); // Setting not found
                    }
                },
                (tx, err) => reject(err)
            );
        });
    });
}


