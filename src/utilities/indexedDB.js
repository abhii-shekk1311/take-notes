import { openDB } from "idb";

const DB_NAME = "notes-db";
const STORE_NAME = "notes";


// Creating DB
export const initDB = async () => {
    return openDB(DB_NAME, 1, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: "id", autoIncrement: true })
            }
        }
    })
}


// Putting data into DB
export const saveNoteToDB = async (note) => {
    const db = await initDB();
    const payload = {
        ...note,
        synced: note.synced ?? false,
    };

    const id = await db.put(STORE_NAME, payload);
    const storedNote = await db.get(STORE_NAME, id);
    return storedNote;
};



// Get stored data from DB
export const getAllOfflineNotes = async () => {
    const db = await initDB();
    return await db.getAll(STORE_NAME);
}

// Deleting data from storage
export const deleteOfflineNote = async (id) => {
    const db = await initDB();
    await db.delete(STORE_NAME, id);
}
