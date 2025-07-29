// Code Review - FIXED VERSION
// URL https://notes-api.dicoding.dev/v2 bukan merupakan endpoint langsung untuk API catatan.
// Untuk mengakses data catatan, perlu menambahkan endpoint /notes sehingga menjadi https://notes-api.dicoding.dev/v2/notes

const API_URL = "https://notes-api.dicoding.dev/v2/notes"; // Ganti dengan URL API yang sebenarnya

// Menampilkan feedback ke pengguna dengan pesan kustom
const showUserFeedback = (message, isError = false) => {
  const feedbackElement = document.createElement("div");
  feedbackElement.textContent = message;
  feedbackElement.style.padding = "15px";
  feedbackElement.style.margin = "15px 0";
  feedbackElement.style.borderRadius = "5px";
  feedbackElement.style.backgroundColor = isError ? "#f8d7da" : "#d4edda";
  feedbackElement.style.color = isError ? "#721c24" : "#155724";
  feedbackElement.style.border = isError
    ? "1px solid #f5c6cb"
    : "1px solid #c3e6cb";
  feedbackElement.style.fontSize = "16px";
  feedbackElement.style.fontWeight = "bold";
  feedbackElement.style.textAlign = "center";

  document.body.insertBefore(feedbackElement, document.body.firstChild);

  setTimeout(() => {
    feedbackElement.remove();
  }, 5000);
};

// Fungsi untuk menangani respons dari API
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json();
    console.error("API Error:", errorData);
    showUserFeedback(errorData.message || "Request failed", true);
    throw new Error(errorData.message || "Request failed");
  }

  return await response.json();
};

// Fungsi umum untuk melakukan request dengan fetch
const apiRequest = async (url, options = {}) => {
  try {
    const response = await fetch(url, options);
    const result = await handleResponse(response);
    console.log("API Response:", result);
    return result;
  } catch (error) {
    console.error("Error during fetch request:", error);
    showUserFeedback("An error occurred. Please try again later.", true);
    throw error;
  }
};

// Fungsi untuk mendapatkan semua notes
const getNotes = async () => {
  const response = await apiRequest(API_URL);
  return response.data;
};

// Fungsi untuk menambahkan note baru
const addNote = async (note) => {
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(note),
  };
  const newNote = await apiRequest(API_URL, options);
  showUserFeedback("Note added successfully!");
  return newNote;
};

// Fungsi untuk mengarsipkan note (mengubah status menjadi archived)
const archiveNote = async (noteId) => {
  const options = {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ archived: true }),
  };
  const updatedNote = await apiRequest(`${API_URL}/${noteId}`, options);
  showUserFeedback("Note archived successfully!");
  return updatedNote;
};

// Fungsi untuk menghapus note
const deleteNote = async (noteId) => {
  const options = { method: "DELETE" };
  await apiRequest(`${API_URL}/${noteId}`, options);
  showUserFeedback("Note deleted successfully!");
  return true;
};

// Fungsi untuk menyegarkan tampilan catatan
// const refreshNotes = async () => {
//   const notes = await getNotes();
//   displayNotes(notes);
// };

// Fungsi untuk menampilkan notes secara dinamis
const displayNotes = (notes) => {
  const notesContainer = document.getElementById("notes-grid");
  if (!notesContainer) {
    console.error("Notes container not found");
    return;
  }

  notesContainer.innerHTML = ""; // Clear previous notes

  if (notes.length === 0) {
    const noNotesMessage = document.createElement("div");
    noNotesMessage.textContent = "No notes available";
    noNotesMessage.style.textAlign = "center";
    noNotesMessage.style.padding = "20px";
    notesContainer.appendChild(noNotesMessage);
  } else {
    notes.forEach((note) => {
      const noteElement = document.createElement("div");
      noteElement.className = "note-item";
      noteElement.innerHTML = `
        <h3>${note.title}</h3>
        <p>${note.content}</p>
        <small>Created at: ${new Date(note.createdAt).toLocaleString()}</small>
        <div class="note-actions">
          <button onclick="archiveNote('${note.id}')">Archive</button>
          <button onclick="deleteNote('${note.id}')">Delete</button>
        </div>
      `;
      notesContainer.appendChild(noteElement);
    });

    setupNoteEventListeners();
  }
};

// Setup event listeners for note actions
const setupNoteEventListeners = () => {
  const notesContainer = document.getElementById("notes-grid");
  if (!notesContainer) return;

  // Remove existing listeners
  notesContainer.replaceWith(notesContainer.cloneNode(true));
  const newContainer = document.getElementById("notes-grid");

  newContainer.addEventListener("click", async (e) => {
    const noteId = e.target.dataset.noteId;
    if (!noteId) return;

    if (e.target.classList.contains("delete-btn")) {
      try {
        await deleteNote(noteId);
        refreshNotes();
      } catch (error) {
        console.error("Error deleting note:", error);
      }
    } else if (e.target.classList.contains("archive-btn")) {
      try {
        await archiveNote(noteId);
        refreshNotes();
      } catch (error) {
        console.error("Error archiving note:", error);
      }
    }
  });
};

// Fungsi untuk menyegarkan tampilan catatan
const refreshNotes = async () => {
  try {
    const notes = await getNotes();
    displayNotes(notes);
  } catch (error) {
    console.error("Error refreshing notes:", error);
    showUserFeedback("Failed to refresh notes", true);
  }
};

// Ambil catatan dan tampilkan saat halaman dimuat
document.addEventListener("DOMContentLoaded", async () => {
  try {
    await refreshNotes();
  } catch (error) {
    console.error("Error loading notes:", error);
  }
});

// Ekspor fungsi untuk digunakan di bagian lain dari aplikasi
export {
  getNotes,
  addNote,
  archiveNote,
  deleteNote,
  refreshNotes,
  displayNotes,
};
