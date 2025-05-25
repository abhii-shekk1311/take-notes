## Take Notes Web Application

A notes taking application with offline save support.

## Node version: 22

## Features 
1. Note Creation & Editing
     - Users can create new notes.
    - Notes have a title and content (Markdown supported).
    - Editing updates notes instantly and autosaves changes.
2. Offline Persistence
    - Notes are stored in IndexedDB to enable full offline usage.
    - Users can create/edit/delete notes while offline.
    - Data persists across browser refreshes and restarts.
3. Syncing
    - When the app detects that it’s online, it automatically syncs local changes with the
    mock backend.
    - Syncing of all the new notes and updates/deletions will be done.
    - Implemented a basic conflict resolution strategy (e.g., client-wins or
    last-write-wins).
4. Connectivity Awareness
    - Detected online/offline status using the browser’s API.
    - UI clearly indicates the connection status and sync progress.
5. Note Searching
    - Provided a search bar to filter notes by title.
6. User Experience
    - Autosaved note content during editing/creation with debounce (e.g., 500ms).
    - Responsive and accessible UI.

## How to access and run this app in you system?
1. Clone the github repository:
    - git clone git@github.com:abhii-shekk1311/take-notes.git
    - cd take-notes
    - npm install
2. Create a .env file, same as the .env.example and put your mockapi key instead of **your_mockapi_key**
3. Run dev server
    - For local build, run: **npm run dev**
    - For checking offline support with preview, run: **npm run start-offline**

## Folder structure
Each component is wrapped inside a folder with corresponding name which contains a **index.jsx** file and the **view** folder. The JSX file will only return the JSX for the component while JS file(inside view folder) is a custom hook that contain all logics for that particular component.
- component_folder
    - view_folder
        - custom_hook.js
    - index.jsx

## Technologies Used
1. React, Context API + useReducer
2. Vite, as app bundler
3. Tailwind CSS, to design the application UI.
4. IndexedDB (for offline support)
5. Mockapi, to generate mock endpoints.
6. Vite PWA
7. react-markdown (for markdown support)
8. Axios (for api calling)