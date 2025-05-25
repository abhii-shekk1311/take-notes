import React from 'react'
import Sidebar from '../app/Sidebar'
import NotesEditorPlayground from '../app/NotesEditorPlayground'

const Dashboard = () => {
  return (
    <div className='flex relative'>
        <Sidebar />
        <NotesEditorPlayground />
    </div>
  )
}

export default Dashboard