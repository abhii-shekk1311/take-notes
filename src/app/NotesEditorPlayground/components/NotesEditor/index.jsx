import React from 'react'
import useNoteEditor from './view/useNoteEditor'

const NotesEditor = () => {
  const {
    title,
    content,
    noteSaveLoading,
    noteSaveError,
    handleTitleChange,
    handleContentChange,
  } = useNoteEditor();
  return (
    <form className='flex flex-col mx-auto w-full xl:w-1/2 lg:w-2/3 md:w-[90%] gap-15 pt-15'>
      <div className='text-right'>
        {noteSaveError && <span className='text-red-400 px-3'>{noteSaveError}</span>}
        <button disabled type='submit' className='p-3 text-gray-500 cursor-not-allowed bg-gray-300 rounded-md'>
          {noteSaveLoading ? "Saving..." : "Auto Save"}
        </button>
      </div>

      <div className='flex flex-col gap-3'>
        <label htmlFor='title'>
          Title
        </label>
        <input
          className='border-b border-gray-500 focus:outline-none'
          name='title'
          value={title}
          onChange={handleTitleChange}
        />
      </div>

      <div className='flex flex-col gap-3'>
        <label htmlFor='content'>
          Content
        </label>
        <textarea
          className='border border-gray-500 rounded-2xl h-[50vh] focus:outline-none resize-none p-3'
          name='content'
          value={content}
          onChange={handleContentChange}
        />
      </div>
    </form>
  )
}

export default NotesEditor