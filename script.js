const addBtn = document.querySelector(".add-btn");
const popupBox = document.querySelector(".popup-box");
const popup_close_btn = document.querySelector(".popup-close-btn");
const form = document.querySelector("form");
const titleInput = document.getElementById("titleInput");
const textarea = document.querySelector("textarea");
const container = document.querySelector(".container");
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
let editFlag = false;
let index;
let selectedNote = {};
let notes = JSON.parse(localStorage.getItem("my-notes")) || [];
notes.forEach(renderNote);

addBtn.addEventListener("click", () => {
  popupBox.style.display = "grid";
  popupBox.querySelector("header h3").innerText = editFlag
    ? "Update a Note"
    : "Add a new Note";
  popupBox.querySelector(".note-add-btn").innerText = editFlag
    ? "Update Note"
    : "Add Note";
});

popup_close_btn.addEventListener("click", () => {
  resetForm();
  popupBox.style.display = "none";
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const note = getNote();
  if (editFlag) {
    updateNote(note);
  } else {
    renderNote(note);
    notes.push(note);
  }
  savesNotes();
  popup_close_btn.click();
});

function getNote() {
  let currentDate = new Date(),
    month = months[currentDate.getMonth()],
    day = currentDate.getDate(),
    year = currentDate.getFullYear();
  return {
    title: titleInput.value,
    descr: textarea.value,
    id: selectedNote.id || new Date().valueOf().toString(),
    date: `${month} ${day}, ${year}`,
  };
}

function renderNote(note) {
  const article = document.createElement("article");
  article.classList.add("note");
  article.id = note.id;
  article.innerHTML = `
  <div class="detail">
      <h3 class="title">${note.title}</h3>
      <p class="descr">${note.descr}</p>
  </div>
    <div class="footer">
      <p>${note.date}</p>
      <div class="btns">
        <button id="edit" 
          onclick="editNote(this)"
          class="fa-solid fa-pen-to-square"
        ></button>
        <button id="delete" 
          onclick="deleteNote(this)"
          class="fa-solid fa-trash-can"
        ></button>
      </div>
    </div>
  `;
  container.appendChild(article);
}

function updateNote(note) {
  selectedNote.querySelector(".title").innerText = note.title;
  selectedNote.querySelector(".descr").innerText = note.descr;
  notes[index] = note;
}

function savesNotes() {
  localStorage.setItem("my-notes", JSON.stringify(notes));
}

function resetForm() {
  editFlag = false;
  selectedNote = {};
  titleInput.value = "";
  textarea.value = "";
  popupBox.querySelector("header h3").innerText = "Add a new Note";
  popupBox.querySelector(".note-add-btn").innerText = "Add Note";
}

function deleteNote(delBtn) {
  const article = delBtn.closest("article");
  article.classList.add('remove')
  setTimeout(() => {
    article.remove()
  }, 200)
  notes.forEach((note, index) => {
    if (article.id == note.id) notes.splice(index, 1);
    savesNotes();
  });
}

function editNote(editBtn) {
  editFlag = true;
  selectedNote = editBtn.closest("article");
  addBtn.click();
  titleInput.value = selectedNote.querySelector(".title").innerText;
  textarea.value = selectedNote.querySelector(".descr").innerText;
  index = notes.findIndex((note) => note.id == selectedNote.id);
}
