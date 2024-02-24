import SQLite from "react-native-sqlite-storage";

const openDatabase = () => {
    return SQLite.openDatabase({ name: "calendario.db", location: "default" },
        () => console.log("Database successfully open"),
        e => console.log(e)
    );
};

const db = openDatabase();
console.log(db);

export const initDatabase = async () => {
    await createEventTable();
};

const createEventTable = async () => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                `CREATE TABLE IF NOT EXISTS Event (
                    id INTEGER PRIMARY KEY,
                    description TEXT NOT NULL,
                    date TEXT NOT NULL,
                    notification BOOLEAN NOT NULL DEFAULT FALSE
                );`,
                [],
                (tx, res) => resolve(),
                (tx, err) => reject(err.message)
            );
        });
    });
}

/**
 * Insert a new event in the
 * @param {{description: string, date: string, notification: boolean}} event The event to add
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
 * @param {{id:number, description: string, date: string, notification: boolean}} event 
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
 * @returns {Promise<{id: number, description: string, date: string, notification: boolean}[]>}
 */
export const getEventsByDate = async (date) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                "SELECT * FROM Event where DATE(date, 'localtime') = DATE(?, 'localtime')",
                [date],
                (tx, res) => {
                    const result = [];
                    for (let i = 0; i < res.rows.length; i++) {
                        result.push(res.rows.item(i));
                    }
                    resolve(result);
                },
                (tx, err) => reject(err)
            );
        });
    });
}