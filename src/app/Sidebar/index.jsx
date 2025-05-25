import React from 'react'
import searchIcon from '/search.png'
import deleteIcon from '/delete2.png'
import editIcon from '/write.png'
import rightArrow from '/right-arrow.png'
import useSidebar from './view/useSidebar'
import remarkGfm from 'remark-gfm'
import Markdown from 'react-markdown'

const Sidebar = () => {
  const {
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
    handleSidebarToggle
  } = useSidebar();
  return (
    <>
      <section
        ref={sidebarRef}
        className={`fixed sm:static top-0 left-0 transition-transform duration-300 ease-in-out 
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} z-40 
          sm:translate-x-0 xl:w-[20%] lg:w-[30%] md:w-[40%] py-3 px-5 bg-gray-300 border-r border-gray-500 h-[100vh]`}
      >
        {/* Mobile sidebar toggle button */}
        <button
          onClick={handleSidebarToggle}
          className="absolute top-5 -right-5 z-50 bg-gray-500 text-white p-2 rounded-full sm:hidden"
        >
          <img
            className={`w-3 h-3 transition-transform duration-300 ${isSidebarOpen ? "rotate-180" : "rotate-0"}`}
            src={rightArrow}
            alt="Toggle Sidebar"
          />
        </button>
        {/* App Title */}
        <h1 className='mb-5 font-bold text-2xl'>Take Notes</h1>

        {/* Add new note buttons */}
        <div className='w-full flex mb-5 justify-between items-center'>
          <button onClick={() => handleAddNoteClick(null)} className='text-white p-2 bg-blue-500 w-full cursor-pointer text-center rounded-md border border-blue-500 transition-all duration-300 hover:bg-blue-400'>
            + Add New Note
          </button>
        </div>

        {/* All Notes list and search filter */}
        <div className='w-full flex flex-col items-center gap-5 py-5 border-t border-gray-500'>
          {/* Search filter */}
          <div className='w-full py-2 px-5 flex justify-between items-center rounded-4xl shadow-2xl bg-white'>
            <input value={searchVal} onChange={handleSearchChange} className='focus:outline-none' placeholder='Search for Note' type="text" />
            <img className='w-5 h-5' src={searchIcon} alt="search icon" />
          </div>

          {/* Notes List container */}
          <ul className='w-full flex flex-col items-center gap-3 max-h-[70vh] overflow-y-scroll scrollbar-none'>
            {
              error ?
                <li className='text-red-500'>{error}</li> :
                loading ?
                  <li>Loading Notes...</li> :
                  notesList?.map((note) => {
                    return (
                      <li key={note?.id} className='w-full p-2 cursor-pointer flex justify-between items-center rounded-md bg-white hover:shadow-gray-900'>
                        <button onClick={() => handleNoteClick(note)} className='h-full truncate text-center w-[65%] cursor-pointer'>
                          {
                            deletingNoteId === note?.id ?
                              "Deleting..." :
                              <Markdown remarkPlugins={remarkGfm}>{note?.title}</Markdown>
                          }
                        </button>
                        <button onClick={() => handleAddNoteClick(note)} className='px-2 cursor-pointer'>
                          <img className='w-5 h-5' src={editIcon} alt="edit icon" />
                        </button>
                        <button disabled={deletingNoteId === note?.id} onClick={() => handleDelete(note)} className={`px-2 cursor-pointer`}>
                          <img className={`w-5 h-5`} src={deleteIcon} alt="delete icon" />
                        </button>
                      </li>
                    )
                  })
            }
          </ul>
        </div>

      </section>
    </>
  )
}

export default Sidebar