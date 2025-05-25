import React, { createContext, useContext, useEffect, useReducer } from 'react'
import { addNewNote, deleteNote, editNote, getNotesList } from '../service/notesService';
import { deleteOfflineNote, getAllOfflineNotes, saveNoteToDB } from '../utilities/indexedDB';

const NoteContext = createContext();
export const useNoteContext = () => useContext(NoteContext);

// Initial context state
const initialState = {
    notesList: [],
    loading: false,
    error: null,
    isOnline: navigator.onLine,
    noteEditorVisible: 0,
    selectedNote: null,
    isEditing: false,
    lastDraftData: { title: "", content: "" }
}

// Reducers to handle state
const noteReducer = (state, action) => {
    switch (action.type) {
        case "SET_NOTES":
            return { ...state, notesList: action.payload };
        case "SET_LOADING":
            return { ...state, loading: action.payload };
        case "SET_ERROR":
            return { ...state, error: action.payload };
        case "SET_ONLINE":
            return { ...state, isOnline: action.payload };
        case "SET_EDITOR":
            return { ...state, noteEditorVisible: action.payload };
        case "SET_EDIT_NOTE":
            return { ...state, selectedNote: action.payload };
        case "SET_IS_EDITING":
            return { ...state, isEditing: action.payload };
        case "SET_DRAFT":
            return { ...state, lastDraftData: action.payload };
        default:
            return state;
    }
}


// Context provider
export const NoteContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(noteReducer, initialState);
    const { notesList } = state;

    // Fetching all note
    const fetchAllNotes = async (title = "") => {
        dispatch({ type: "SET_ERROR", payload: null });
        dispatch({ type: "SET_LOADING", payload: true });

        if (!navigator.onLine) {
            try {
                const notes = await getAllOfflineNotes();
                dispatch({ type: "SET_NOTES", payload: notes });
                dispatch({ type: "SET_LOADING", payload: false });
            } catch (error) {
                dispatch({ type: "SET_ERROR", payload: error })
                dispatch({ type: "SET_LOADING", payload: false });
            }
            return;
        }

        return getNotesList({
            title,
        }).then(async (res) => {
            dispatch({ type: "SET_NOTES", payload: res?.data });
            dispatch({ type: "SET_LOADING", payload: false });
        })
            .catch((error) => {
                dispatch({ type: "SET_ERROR", payload: error?.response?.data })
                dispatch({ type: "SET_LOADING", payload: false });
            });
    }

    // Syncing offline data with online data when user is online
    const syncOfflineNotesdata = async () => {
        const offlineNotes = await getAllOfflineNotes();
        if (!offlineNotes.length) return
        try {
            for (const note of offlineNotes) {
                try {
                    if (note.synced) continue;

                    if (note.type === "add" || note.type === "add_edit") {
                        await addNewNote({ title: note.title, content: note.content });
                    } else if (note.type === "edit") {
                        await editNote(note.id, { title: note.title, content: note.content });
                    } else if (note.type === "delete") {
                        await deleteNote(note?.id)
                    }
                    await deleteOfflineNote(note.id);
                } catch (error) {
                    console.log("Sync Error for note ID", note.id, ":", error);
                }
            }
        } catch (err) {
            console.error("Failed to sync offline notes:", err);
        }
    };


    // Syncing online data with offline data when user is offline
    const syncOnlineNotesdata = async (notes) => {
        if (!notes.length) return;
        for (const note of notes) {
            try {
                await saveNoteToDB({ ...note, synced: true })
            } catch (error) {
                console.log("Sync Error: ", error)
            }
        }
    }

    // Check if user is online or offline
    useEffect(() => {
        const handleOnlineStatus = async () => {
            dispatch({ type: "SET_ONLINE", payload: true });
            await syncOfflineNotesdata();
            await fetchAllNotes();
        }
        const handleOfflineStatus = async () => {
            dispatch({ type: "SET_ONLINE", payload: false });
            await syncOnlineNotesdata(notesList);
        }

        window.addEventListener('online', handleOnlineStatus);
        window.addEventListener('offline', handleOfflineStatus);

        return () => {
            window.removeEventListener('online', handleOnlineStatus);
            window.removeEventListener('offline', handleOfflineStatus);
        };
    }, [notesList])
    return (
        <NoteContext.Provider value={{ state, dispatch, fetchAllNotes }}>
            {children}
        </NoteContext.Provider>
    )
}

export default NoteContext