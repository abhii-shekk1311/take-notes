import { useEffect, useRef, useState } from 'react'
import { useNoteContext } from '../../../context/NoteContext';
import useDebounce from '../../../utilities/useDebounce';
import { deleteNote } from '../../../service/notesService';
import { deleteOfflineNote, saveNoteToDB } from '../../../utilities/indexedDB';

const useSidebar = () => {
    const { state, dispatch, fetchAllNotes } = useNoteContext();
    const { notesList, loading, isOnline, error } = state;
    const [searchVal, setSearchVal] = useState("");
    const [deletingNoteId, setDeletingNoteId] = useState(null)
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const debouncedValue = useDebounce(searchVal, 500);
    const sidebarRef = useRef(null)

    useEffect(() => {
        fetchAllNotes(debouncedValue);
    }, [debouncedValue])

    // Handle search change
    const handleSearchChange = (e) => {
        const { value } = e.target;
        setSearchVal(value)
    }

    // Handle Add Note button click
    const handleAddNoteClick = (selectedNote) => {
        dispatch({ type: "SET_EDITOR", payload: 1 });
        dispatch({ type: "SET_EDIT_NOTE", payload: selectedNote });
        if (selectedNote) {
            dispatch({ type: "SET_IS_EDITING", payload: true });
            dispatch({ type: "SET_DRAFT", payload: { title: selectedNote?.title, content: selectedNote?.content } })
        } else {
            dispatch({ type: "SET_IS_EDITING", payload: false })
            dispatch({ type: "SET_DRAFT", payload: { title: "", content: "" } })
        }
    }

    // Handle Delete Note confirm click button
    const handleDeleteNoteClick = async (note) => {
        setDeletingNoteId(note?.id);
        dispatch({ type: "SET_EDITOR", payload: 0 })

        if (!isOnline) {
            await saveNoteToDB({ ...note, id: note?.id, synced: false, type: "delete" });
            setDeletingNoteId(null);
            return;
        }
        return deleteNote(note?.id).then(async () => {
            fetchAllNotes(debouncedValue);
            await deleteOfflineNote(note?.id)
            setDeletingNoteId(null);
        })
            .catch((error) => {
                alert(`${error?.response?.data}`);
                setDeletingNoteId(null);
            });
    }

    // Handle delete note button click
    const handleDelete = (note_id) => {
        if (confirm("Are you sure?")) {
            handleDeleteNoteClick(note_id)
        }
        return;
    }

    // Handle Nopte Title click
    const handleNoteClick = (selectedNote) => {
        dispatch({ type: "SET_EDITOR", payload: 2 });
        dispatch({ type: "SET_EDIT_NOTE", payload: selectedNote });
    }

    // Toggle sidebar in mobile devices
    const handleSidebarToggle = () => {
        setIsSidebarOpen(!isSidebarOpen)
    }

    // Close the sidebar if clicked anywhere outside of it in mobile
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                isSidebarOpen &&
                sidebarRef.current &&
                !sidebarRef.current.contains(event.target)
            ) {
                setIsSidebarOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isSidebarOpen]);

    return {
        sidebarRef,
        notesList,
        searchVal,
        deletingNoteId,
        loading,
        error,
        isSidebarOpen,
        handleNoteClick,
        handleDelete,
        handleAddNoteClick,
        handleSearchChange,
        handleSidebarToggle,
    }
}

export default useSidebar