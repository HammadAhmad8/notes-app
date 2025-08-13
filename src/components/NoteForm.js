import React, { useState, useEffect } from 'react';
import './NoteForm.css'; // (create this file for popup styles)

function NoteForm({ addNote, editNote, updateNote }) {
  const [showPopup, setShowPopup] = useState(false);
  const [noteData, setNoteData] = useState({
    id: '',
    author: '',
    title: '',
    description: ''
  });

  useEffect(() => {
    if (editNote) {
      setNoteData(editNote);
      setShowPopup(true); // open popup if editing
    }
  }, [editNote]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNoteData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!noteData.title || !noteData.description) return;

    if (editNote) {
      updateNote(noteData);
    } else {
      addNote(noteData);
    }

    setNoteData({ id: '', author: '', title: '', description: '' });
    setShowPopup(false);
  };

  return (
    <div>
      <button onClick={() => setShowPopup(true)}>Add Note</button>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <h2>{editNote ? 'Update Note' : 'Add Note'}</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="id"
                placeholder="ID"
                value={noteData.id}
                onChange={handleChange}
              />
              <input
                type="text"
                name="author"
                placeholder="Author"
                value={noteData.author}
                onChange={handleChange}
              />
              <input
                type="text"
                name="title"
                placeholder="Title"
                value={noteData.title}
                onChange={handleChange}
              />
              <textarea
                name="description"
                placeholder="Description"
                value={noteData.description}
                onChange={handleChange}
              />
              <button type="submit">{editNote ? 'Update' : 'Save'}</button>
              <button type="button" onClick={() => setShowPopup(false)}>Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default NoteForm;
