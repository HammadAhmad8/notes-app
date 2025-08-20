// App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

// Use env variable (set REACT_APP_API_URL in .env). Fallback to localhost if not set.
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3003/api';

function App() {

  const [notes, setNotes] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [editNote, setEditNote] = useState(null);
  const [noteForm, setNoteForm] = useState({
    author: '',
    title: '',
    description: ''
  });

  useEffect(() => {
    // Fetch notes from backend (MongoDB Atlas)
    axios.get(`${API_URL}/notes`)
      .then(res => setNotes(res.data))
      .catch(err => console.error('❌ Error fetching notes:', err));

    // If using PostgreSQL before, comment out that code:
    // axios.get('http://localhost:3003/postgres-notes') ...
  }, []);

  const openPopup = (note = null) => {
    if (note) {
      setNoteForm({
        author: note.author,
        title: note.title,
        description: note.description
      });
      setEditNote(note);
    } else {
      setNoteForm({ author: '', title: '', description: '' });
      setEditNote(null);
    }
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setNoteForm({ author: '', title: '', description: '' });
    setEditNote(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNoteForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (editNote) {
      // Update note in MongoDB Atlas
      axios.put(`${API_URL}/notes/${editNote._id}`, noteForm) // <- fixed _id
        .then(res => {
          const updated = res.data;
          setNotes(prev =>
            prev.map(note => (note._id === updated._id ? updated : note)) // <- fixed _id
          );
          closePopup();
        })
        .catch(err => console.error('❌ Error updating note:', err));

      // Comment out PostgreSQL update if you had it:
      // axios.put(`http://localhost:3003/postgres-notes/${editNote.id}`, ...)
    } else {
      // Add new note in MongoDB Atlas
      axios.post(`${API_URL}/notes`, noteForm)
        .then(res => {
          setNotes(prev => [res.data, ...prev]); // prepend new note
          closePopup();
        })
        .catch(err => console.error('❌ Error adding note:', err));

      // Comment out PostgreSQL add if you had it:
      // axios.post('http://localhost:3003/postgres-notes', noteForm)
    }
  };

  const handleDelete = (id) => {
    axios.delete(`${API_URL}/notes/${id}`)
      .then(() => {
        setNotes(prev => prev.filter(note => note._id !== id)); // <- fixed _id
      })
      .catch(err => console.error('❌ Error deleting note:', err));

    // Comment out PostgreSQL delete if you had it:
    // axios.delete(`http://localhost:3003/postgres-notes/${id}`)
  };

  return (
    <div className="app">
      <h1>My Notes</h1>
      <button className="add-button" onClick={() => openPopup()}>Add Note</button>

      <div className="notes-list">
        {notes.map(note => (
          <div key={note._id} className="note-card"> {/* <- fixed _id */}
            <h3>{note.title}</h3>
            <p><strong>ID:</strong> {note._id}</p> {/* <- fixed _id */}
            <p><strong>Author:</strong> {note.author}</p>
            <p>{note.description}</p>
            <div className="actions">
              <button onClick={() => openPopup(note)}>Edit</button>
              <button onClick={() => handleDelete(note._id)}>Delete</button> {/* <- fixed _id */}
            </div>
          </div>
        ))}
      </div>

      {showPopup && (
        <div className="popup">
          <div className="popup-inner">
            <h2>{editNote ? 'Update Note' : 'Add Note'}</h2>

            <input
              type="text"
              name="author"
              placeholder="Author"
              value={noteForm.author}
              onChange={handleChange}
            />
            <input
              type="text"
              name="title"
              placeholder="Title"
              value={noteForm.title}
              onChange={handleChange}
            />
            <textarea
              name="description"
              placeholder="Description"
              value={noteForm.description}
              onChange={handleChange}
            />
            <button onClick={handleSave}>Save</button>
            <button className="close-btn" onClick={closePopup}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
