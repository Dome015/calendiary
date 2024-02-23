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
 */
export const insertEvent = async (event) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                `INSERT INTO Event (description, date, notification)
                VALUES (?, ?, ?);`,
                [event.description, event.date, event.notification],
                (tx, res) => resolve(),
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
                `SELECT * FROM Event WHERE date = ?;`,
                [date],
                (tx, res) => resolve(res.rows.raw()),
                (tx, err) => reject(err.message)
            );
        });
    });
}