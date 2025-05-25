import React from 'react';
import notesIcon from '/sticky-notes.png';
import NotesEditor from './components/NotesEditor';
import NoteViewer from './components/NoteViewer';
import { useNoteContext } from '../../context/NoteContext';

const NotesEditorPlayground = () => {
  const { state } = useNoteContext();
  const {
    isOnline,
    noteEditorVisible,
  } = state;

  const renderContent = () => {
    switch (noteEditorVisible) {
      case 1:
        return (
          <div className="py-3 px-5 bg-gray-200 w-full xl:w-[80%] lg:w-[70%] md:w-[65%]">
            <div className="flex justify-between items-center w-full xl:w-1/2 lg:w-2/3 md:w-[90%] mx-auto">
              <h2 className="font-bold text-3xl">Note Editor</h2>
              <span>{isOnline ? "Online" : "Offline"}</span>
            </div>
            <NotesEditor />
          </div>
        );

      case 2:
        return (
          <div className="py-3 px-5 h-[100vh] bg-gray-200 w-full xl:w-[80%] lg:w-[70%] md:w-[60%]">
            <span>{isOnline ? "Online" : "Offline"}</span>
            <NoteViewer />
          </div>
        );

      default:
        return (
          <div className="h-[100vh] w-full xl:w-[80%] lg:w-[70%] md:w-[60%] bg-gray-200 flex flex-col items-center justify-center">
            <img className="h-50 w-50" src={notesIcon} alt="Notes Image" />
            <div className="text-center px-3 sm:px-0 mt-5">
              <h2 className="font-semibold text-2xl">Welcome to the Take Notes</h2>
              <p>Create your notes with offline save support</p>
            </div>
          </div>
        );
    }
  };

  return <>{renderContent()}</>;
}

export default NotesEditorPlayground