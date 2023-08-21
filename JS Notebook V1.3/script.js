// Display notes with titles
function displayNotes() {
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    const notesContainer = document.getElementById('notes');

    notesContainer.innerHTML = '';

    notes.forEach((note, index) => {
        const noteElement = document.createElement('div');
        noteElement.className = 'note';
        noteElement.innerHTML = `
            <h3>${note.title}</h3>
            <div class="note-content">${note.content}</div>
            <p>Created: ${note.createdAt}</p>
            <p>Last Edited: ${note.updatedAt}</p>
            <button onclick="editNote(${index})">Edit</button>
            <button onclick="deleteNoteConfirmation(${index})">Delete</button>
        `;
        notesContainer.appendChild(noteElement);
    });
}

function editNote(index) {
    editedNoteIndex = index;
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    const editedNoteModal = document.getElementById('editNoteModal');
    const editedTitleInput = document.getElementById('editedTitleInput');
    const editedNoteContent = document.getElementById('editedNoteContent');

    editedTitleInput.value = notes[index].title;
    editedNoteContent.value = notes[index].content;
    editedNoteModal.style.display = 'block';

    // Add event listeners for live preview here
    editedTitleInput.addEventListener('input', () => {
        titlePreview.textContent = editedTitleInput.value; // Rendering live preview for title
    });

    editedNoteContent.addEventListener('input', () => {
        notePreview.textContent = editedNoteContent.value; // Rendering live preview for note content
    });
}


function saveEditedNote() {
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    const editedTitleInput = document.getElementById('editedTitleInput').value;
    const editedNoteContent = document.getElementById('editedNoteContent').value;

    if (editedNoteContent.trim() !== '') {
        const noteToEdit = notes[editedNoteIndex];
        noteToEdit.title = editedTitleInput.trim();
        noteToEdit.content = editedNoteContent;
        noteToEdit.updatedAt = new Date().toLocaleString();
        localStorage.setItem('notes', JSON.stringify(notes));
        displayNotes();
        closeEditModal();
    }
}

function closeEditModal() {
    const editedNoteModal = document.getElementById('editNoteModal');
    editedNoteModal.style.display = 'none';
}

// Delete a note
let noteToDeleteIndex;

function deleteNoteConfirmation(index) {
    noteToDeleteIndex = index;
    openDeleteModal();
}

function confirmDeleteNote() {
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    notes.splice(noteToDeleteIndex, 1);
    localStorage.setItem('notes', JSON.stringify(notes));
    displayNotes();
    closeDeleteModal();
}

function openDeleteModal() {
    const modal = document.getElementById('deleteNoteModal');
    modal.style.display = 'block';
}

function closeDeleteModal() {
    const modal = document.getElementById('deleteNoteModal');
    modal.style.display = 'none';
}

// Add a new note
function addNote() {
    const titleInput = document.getElementById('titleInput');
    const noteInput = document.getElementById('noteInput');
    const title = titleInput.value.trim();
    const content = noteInput.value.trim();

    if (!content) return;

    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    const now = new Date();

    notes.push({
        title: title || 'Untitled',
        content,
        createdAt: now.toLocaleString(),
        updatedAt: now.toLocaleString(),
    });

    localStorage.setItem('notes', JSON.stringify(notes));
    titleInput.value = '';
    noteInput.value = '';
    displayNotes();
}

// Initialize the app
function init() {
  displayNotes();

      const titleInput = document.getElementById('titleInput');
      const noteInput = document.getElementById('noteInput');
      const titlePreview = document.getElementById('titlePreview');
      const notePreview = document.getElementById('notePreview');

      titleInput.addEventListener('input', () => {
          titlePreview.textContent = titleInput.value; //rendering live preview
      });

      noteInput.addEventListener('input', () => {
          //const content = noteInput.value;
        //  notePreview.innerHTML = marked(content); // Render Markdown content
          notePreview.textContent = noteInput.value; //rendering live preview
      });

    const addNoteButton = document.getElementById('addNote');
    addNoteButton.addEventListener('click', addNote);

    const saveEditedNoteButton = document.getElementById('saveEditedNote');
    saveEditedNoteButton.addEventListener('click', saveEditedNote);

    const cancelEditButton = document.getElementById('cancelEdit');
    cancelEditButton.addEventListener('click', closeEditModal);

    const confirmDeleteButton = document.getElementById('confirmDelete');
    confirmDeleteButton.addEventListener('click', confirmDeleteNote);

    const cancelDeleteButton = document.getElementById('cancelDelete');
    cancelDeleteButton.addEventListener('click', closeDeleteModal);
}

init();
