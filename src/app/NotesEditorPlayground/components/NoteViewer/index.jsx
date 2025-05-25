import React from 'react'
import { useNoteContext } from '../../../../context/NoteContext'
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const NoteViewer = () => {
  const { state } = useNoteContext();
  const { selectedNote } = state;

  return (
    <div className='mx-auto prose'>
      <div className="py-3">
        <Markdown remarkPlugins={remarkGfm}>{selectedNote?.title}</Markdown>
      </div>
      <div className="max-h-[80vh] overflow-x-scroll scrollbar-none">
        <Markdown remarkPlugins={remarkGfm}>{selectedNote?.content}</Markdown>
      </div>
    </div>
  )
}

export default NoteViewer