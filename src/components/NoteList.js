import React from 'react';
import NoteItem from './NoteItem';

function NoteList({ notes, onDelete, onEdit }) {
  if (notes.length === 0) return <p>No notes yet.</p>;

  return (
    <ul>
      {notes.map((note) => (
        <NoteItem
          key={note.id}
          note={note}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </ul>
  );
}

export default NoteList;
