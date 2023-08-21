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

// Function to save notes to individual text files
function saveNotesToSeparateFiles() {
    const notes = JSON.parse(localStorage.getItem('notes')) || [];

    notes.forEach((note, index) => {
        const noteText = `Title: ${note.title}\nContent:\n${note.content}\n\n`;
        const blob = new Blob([noteText], { type: 'text/plain' });
        const fileName = `${note.title.replace(/[^a-z0-9]/gi, '_')}.txt`; // Generate a unique file name

        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = fileName;
        a.textContent = note.title; // Display the note title as a link
        a.classList.add('note-link'); // Add a class for styling

        a.addEventListener('click', (e) => {
            // Prevent default behavior to avoid navigation
            e.preventDefault();
            // Open the note file in a new tab
            window.open(a.href, '_blank');
        });

        // Append the link to a container element (e.g., a notes list)
        const notesContainer = document.getElementById('notes');
        notesContainer.appendChild(a);
    });
}


function loadNotesFromFile() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'text/plain';

    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const notesText = e.target.result;
                const notesArray = notesText.split('\n\n');
                const notes = notesArray.map((noteText) => {
                    const lines = noteText.split('\n');
                    const title = lines[0].replace('Title: ', '');
                    const content = lines.slice(2).join('\n'); // Skip the 'Content:' line
                    return {
                        title,
                        content,
                        createdAt: new Date().toLocaleString(),
                        updatedAt: new Date().toLocaleString(),
                    };
                });

                localStorage.setItem('notes', JSON.stringify(notes));
                displayNotes();
            };
            reader.readAsText(file);
        }
    });

    fileInput.click();
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

// Add event listeners for the new buttons
const saveNotesButton = document.getElementById('saveNotes');
saveNotesButton.addEventListener('click', saveNotesToTextFile);

const loadNotesButton = document.getElementById('loadNotes');
loadNotesButton.addEventListener('click', loadNotesFromTextFile);

// Function to save notes to a text file
function saveNotesToTextFile() {
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    let combinedNotes = '';

    notes.forEach((note) => {
        const noteText = `Title: ${note.title}\nContent:\n${note.content}\n\n`;
        combinedNotes += noteText;
    });

    const now = new Date();
    const timestamp = `${now.getFullYear()}-${(now.getMonth() + 1)
    .toString()
    .padStart(2, '0')}-${now
    .getDate()
    .toString()
    .padStart(2, '0')}_${now
    .getHours()
    .toString()
    .padStart(2, '0')}-${now
    .getMinutes()
    .toString()
    .padStart(2, '0')}-${now
    .getSeconds()
    .toString()
    .padStart(2, '0')}`;

    const blob = new Blob([combinedNotes], { type: 'text/plain' });
    const fileName = `Notes_${timestamp}.txt`;

    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = fileName;
    a.style.display = 'none';
    document.body.appendChild(a);

    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(a.href);
}

// Function to load notes from a text file
function loadNotesFromTextFile() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.txt';

    input.addEventListener('change', (e) => {
        const files = e.target.files;

        if (files.length > 0) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const fileContent = event.target.result;
                const fileName = files[0].name; // Get the file name

                const loadedNote = {
                    title: fileName.split('.txt')[0], // Use file name as title (remove .txt extension)
                    content: fileContent, // Set note content from file content
                    createdAt: new Date(files[0].lastModified).toLocaleString(), // Use file creation date
                    updatedAt: new Date(files[0].lastModified).toLocaleString(), // Use file last modification date
                };

                const existingNotes = JSON.parse(localStorage.getItem('notes')) || [];
                const updatedNotes = [...existingNotes, loadedNote];

                localStorage.setItem('notes', JSON.stringify(updatedNotes));
                displayNotes();
            };

            reader.readAsText(files[0]);
        }
    });

    input.click();
}


init();
