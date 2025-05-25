import { useEffect, useState } from 'react';
import { useNoteContext } from '../../../../../context/NoteContext';
import { addNewNote, editNote } from '../../../../../service/notesService';
import useDebounce from '../../../../../utilities/useDebounce';
import { saveNoteToDB } from '../../../../../utilities/indexedDB';

const useNoteEditor = () => {
    const { state, dispatch, fetchAllNotes } = useNoteContext();
    const { selectedNote, isEditing, isOnline, lastDraftData } = state;
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [noteSaveLoading, setNoteSaveLoading] = useState(false);
    const [noteSaveError, setNoteSaveError] = useState(null);


    // setting default values of both fields if user editing the note
    useEffect(() => {
        if (selectedNote) {
            setTitle(selectedNote?.title);
            setContent(selectedNote?.content);
            dispatch({ type: "SET_DRAFT", payload: { title: selectedNote?.title, content: selectedNote?.content } })
        }
        else {
            setTitle("")
            setContent("");
            dispatch({ type: "SET_DRAFT", payload: { title: "", content: "" } })
        }
    }, [selectedNote])

    const debouncedTitle = useDebounce(title, 1000);
    const debouncedContent = useDebounce(content, 1000);

    // handle title change
    const handleTitleChange = (e) => {
        const { value } = e.target;
        setTitle(value);
    }

    // handle content change
    const handleContentChange = (e) => {
        const { value } = e.target;
        setContent(value);
    }

    // Edit Note API call function
    const updateNote = async () => {
        setNoteSaveLoading(true);
        setNoteSaveError(null)
        if (!isOnline) {
            if(selectedNote?.type === "add") {
                await saveNoteToDB({ id: selectedNote?.id, title, content, type: 'add_edit', synced: false });
            } else {
                await saveNoteToDB({ id: selectedNote?.id, title, content, type: 'edit', synced: false });
            }
            fetchAllNotes();
            setNoteSaveLoading(false);
            return;
        }

        return editNote(selectedNote?.id, {
            title,
            content,
            synced: true
        }).then(async (res) => {
            const note = res?.data;
            setNoteSaveLoading(false);
            await saveNoteToDB({...note, synced: true, type: "edit"});
            fetchAllNotes();
        })
            .catch((error) => {
                setNoteSaveError(error?.response?.data)
                setNoteSaveLoading(false);
            });
    }

    // Add Note API call function
    const createNewNote = async () => {
        setNoteSaveLoading(true);
        setNoteSaveError(null)

        if (!isOnline) {
            const savedOfflineNote = await saveNoteToDB({ title, content, type: 'add', synced: false });
            dispatch({ type: "SET_EDIT_NOTE", payload: savedOfflineNote })
            dispatch({ type: "SET_IS_EDITING", payload: true });
            fetchAllNotes();
            setNoteSaveLoading(false);
            return;
        }

        return addNewNote({
            title,
            content,
            synced: true
        }).then(async (res) => {
            const note = res?.data;
            setNoteSaveLoading(false);
            await saveNoteToDB({...note, type: "add"});
            dispatch({ type: "SET_EDIT_NOTE", payload: note })
            dispatch({ type: "SET_IS_EDITING", payload: true });
            fetchAllNotes();
        })
            .catch((error) => {
                setNoteSaveError(error?.response?.data)
                setNoteSaveLoading(false);
            });

    }

    // Handling auto save
    useEffect(() => {
        const hasChanges =
            debouncedTitle !== lastDraftData.title ||
            debouncedContent !== lastDraftData.content;

        const isInvalidInitialState =
            selectedNote && isEditing && debouncedTitle === "" && debouncedContent === "";

        if (hasChanges && !isInvalidInitialState) {
            if (selectedNote && isEditing) {
                updateNote();
            } else {
                createNewNote();
            }
        }
    }, [debouncedTitle, debouncedContent])


    return {
        title,
        content,
        noteSaveLoading,
        noteSaveError,
        handleTitleChange,
        handleContentChange,
    }
}

export default useNoteEditor