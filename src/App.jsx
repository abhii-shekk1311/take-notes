import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import Dashboard from './pages/Dashboard.jsx';
import NotFound from './pages/NotFound.jsx';
import { NoteContextProvider } from './context/NoteContext.jsx';

function App() {
  return (
    <NoteContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </NoteContextProvider>
  )
}

export default App
