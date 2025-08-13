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
    axios.get(`${API_URL}/notes`)
      .then(res => setNotes(res.data))
      .catch(err => console.error('❌ Error fetching notes:', err));
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
      axios.put(`${API_URL}/notes/${editNote.id}`, noteForm)
        .then(res => {
          const updated = res.data;
          setNotes(prev =>
            prev.map(note => (note.id === updated.id ? updated : note))
          );
          closePopup();
        })
        .catch(err => console.error('❌ Error updating note:', err));
    } else {
      axios.post(`${API_URL}/notes`, noteForm)
        .then(res => {
          setNotes(prev => [res.data, ...prev]); // prepend new note
          closePopup();
        })
        .catch(err => console.error('❌ Error adding note:', err));
    }
  };

  const handleDelete = (id) => {
    axios.delete(`${API_URL}/notes/${id}`)
      .then(() => {
        setNotes(prev => prev.filter(note => note.id !== id));
      })
      .catch(err => console.error('❌ Error deleting note:', err));
  };

  return (
    <div className="app">
      <h1>My Notes</h1>
      <button className="add-button" onClick={() => openPopup()}>Add Note</button>

      <div className="notes-list">
        {notes.map(note => (
          <div key={note.id} className="note-card">
            <h3>{note.title}</h3>
            <p><strong>ID:</strong> {note.id}</p>
            <p><strong>Author:</strong> {note.author}</p>
            <p>{note.description}</p>
            <div className="actions">
              <button onClick={() => openPopup(note)}>Edit</button>
              <button onClick={() => handleDelete(note.id)}>Delete</button>
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
