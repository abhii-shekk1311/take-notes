import * as APIs from '../constants/apiConstants';
import { axiosInstance } from '../utilities/configureAxios';

// Get all notes list service
export const getNotesList = (payload) => {
    const payloadValues = Object.values(payload);
    let myParam = "";
    if (payloadValues.length !== 0) {
        let count = 0;
        Object.entries(payload).map(([key, val]) => {
            if (count == 0) {
                myParam += `?${key}=${val}`;
            } else {
                myParam += `&${key}=${val}`;
            }
            count++;
        });
    }
    let url = APIs.GET_NOTES_LIST + myParam;
    return axiosInstance.get(url);
}

// Add new note service
export const addNewNote = (data) => {
    return axiosInstance.post(APIs.ADD_NEW_NOTE, data);
}

// Edit a note service
export const editNote = (id, data) => {
    let url = APIs.EDIT_NOTE.replace(":id", id);
    return axiosInstance.put(url, data);
}

// Delete a note service
export const deleteNote = (id) => {
    let url = APIs.DELETE_NOTE.replace(":id", id);
    return axiosInstance.delete(url);
}