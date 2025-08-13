import React from 'react';
function NoteItem({ note, onDelete, onEdit }) {

  console.log(note);
  return (
    <li>
      {note.title}
      {" "+note.description}
      {" "+note.author}
      <button onClick={() => onEdit(note)}>Edit 1</button>
      <button onClick={() => onDelete(note.id)}>Delete 1</button>
    </li>
  );
}

export default NoteItem;
