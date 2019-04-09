"use strict";

window.onload = function() {
    hideCreateNoteTextarea();
    hideSaveButton();
    toggleEditTitle();
    loadEventListenerForToggleHideShowTextArea();
    loadEventListenerForShowSaveButtonOfCreateNote();
    loadEventListenerForShowSaveButtonOfCreateNoteForTitle();
    loadEventListenerForAppendNote();
    addNotesFromLocalStorage();
};

// Event Listeners

function loadEventListenerForToggleHideShowTextArea() {
    let showTextArea = document.getElementById("create-note-button-container");
    showTextArea.addEventListener("click", toggleHideShowTextarea);
}

function loadEventListenerForShowSaveButtonOfCreateNote() {
    let showSaveButton = document.getElementById("new-note");
    showSaveButton.addEventListener("focus", showSaveButtonOfCreateNote);
}

function loadEventListenerForShowSaveButtonOfCreateNoteForTitle() {
    let showSaveButtonWhenTitleIsClicked = document.getElementById("textarea-title-container");
    showSaveButtonWhenTitleIsClicked.addEventListener("focus", showSaveButtonOfCreateNote);
}

function loadEventListenerForAppendNote() {
    let saveCustomNote = document.getElementById("save-note");
    saveCustomNote.addEventListener("click", appendNote);
}

// Show and Hide functions

function hideCreateNoteTextarea() {
    document.getElementById("textarea-container").style.visibility = "hidden";
}

function showCreateNoteTextarea() {
    document.getElementById("textarea-container").style.visibility = "visible";
}

function toggleHideShowTextarea() {
    let createNote = document.getElementById("textarea-container");

    if (createNote.style.visibility === "hidden") {
        showCreateNoteTextarea();
    } else {
        hideCreateNoteTextarea();
        hideSaveButton();
    }
}

function hideSaveButton() {
    document.getElementById("save-note").style.visibility = "hidden";
}

function toggleEditTitle() {
    document.getElementById("textarea-title-container").contentEditable = "true";
    let titleArray = document.getElementsByClassName("custom-note");

    for (let i = 0; i < titleArray.length; i ++) {
        titleArray[i].contentEditable = "true";
    }
}

function showSaveButtonOfCreateNote() {
    document.getElementById("save-note").style.visibility = "visible";
}

// Appending a note

function appendNote() {
    let myNotesSection = document.getElementById("notes-list");
    let inputTitle = document.getElementById("textarea-title-container").innerText;
    let inputText = document.getElementById("new-note").value;
    let note = new Note(inputTitle, inputText);
    let noteId = note.getId();

    let customNoteContainer = createCustomNoteContainer(noteId);
    let noteTitle = createCustomNoteTitle(inputTitle);
    let text = createCustomNoteTextarea(inputText);
    let deleteButtonContainer = createCustomNoteDeleteButtonContainer();
    let deleteButton = createCustomNoteDeleteButton();

    myNotesSection.appendChild(customNoteContainer);
    customNoteContainer.appendChild(noteTitle);
    customNoteContainer.appendChild(text);
    customNoteContainer.appendChild(deleteButtonContainer);
    deleteButtonContainer.appendChild(deleteButton);

    resetCreateNoteFields();
    notes[noteId] = note;
    updateLocalStorage();
}

// Creating elements of a custom note

function createCustomNoteContainer(noteId) {
    let customNoteContainer = document.createElement("div");
    customNoteContainer.setAttribute("class", "custom-note-container");
    customNoteContainer.setAttribute("id", noteId);
    return customNoteContainer;
}

function createCustomNoteTitle(inputTitle) {
    let noteTitle = document.createElement("div");
    noteTitle.setAttribute("class", "custom-note-title");
    noteTitle.setAttribute("contentEditable", "true");
    noteTitle.innerText = inputTitle;
    noteTitle.addEventListener("input", updateEditedTitle);
    return noteTitle;
}

function createCustomNoteTextarea(inputText) {
    let text = document.createElement("textarea");
    text.setAttribute("class", "custom-note-text");
    text.setAttribute("name", "note");
    text.setAttribute("rows", "10");
    text.setAttribute("cols", "50");
    text.textContent = inputText;
    text.addEventListener("input", updateEditedText);
    return text;
}

function createCustomNoteDeleteButtonContainer() {
    let deleteButtonContainer = document.createElement("div");
    deleteButtonContainer.setAttribute("class", "custom-note-delete-button-container");
    return deleteButtonContainer;
}

function createCustomNoteDeleteButton() {
    let deleteButton = document.createElement("button");
    deleteButton.setAttribute("class", "delete-button");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", deleteNote);
    return deleteButton;
}

function resetCreateNoteFields() {
    document.getElementById("textarea-title-container").innerText = "Title";
    document.getElementById("new-note").value = "";
}

// Delete note :(

function deleteNote() {
    let key = this.closest("div.custom-note-container").getAttribute("id");
    delete notes[key];
    this.closest("div.custom-note-container").remove();
    updateLocalStorage();
}

// Update note

function updateEditedTitle() {
    let key = this.closest("div.custom-note-container").getAttribute("id");
    notes[key].title = this.closest("div.custom-note-title").innerText;
    updateLocalStorage();
}

function updateEditedText() {
    let key = this.closest("div.custom-note-container").getAttribute("id");
    notes[key].text = this.closest("textarea.custom-note-text").value;
    updateLocalStorage();
}

// Local Storage

let notes = getLocalStorage();

class Note {
    constructor(title, text) {
        this.title = title;
        this.text = text;

        if (Object.keys(notes).length === 0) {
            this.id = 0;
        } else {
            this.id = Math.max.apply(null, Object.keys(notes)) + 1;
        }
    }

    getId() {
        return this.id;
    }
}

function getLocalStorage() {
    let notes = {};
    if (localStorage.getItem("notes")) {
        notes = JSON.parse(localStorage.getItem("notes"));
    }
    return notes;
}

function updateLocalStorage() {
    localStorage.setItem("notes", JSON.stringify(notes));
}

function addNotesFromLocalStorage() {

    let notesSize = Object.keys(notes).length;

    if (notesSize > 0) {
        let myNotesSection = document.getElementById("notes-list");
        let customNoteContainer;
        let inputTitle;
        let noteTitle;
        let inputText;
        let text;
        let deleteButtonContainer;
        let deleteButton;
        let noteId;

        for (let i = 0; i < notesSize; i++) {
            noteId = notes[i].id;
            customNoteContainer = createCustomNoteContainer(noteId);
            inputTitle = notes[i].title;
            noteTitle = createCustomNoteTitle(inputTitle);
            inputText = notes[i].text;
            text = createCustomNoteTextarea(inputText);
            deleteButtonContainer = createCustomNoteDeleteButtonContainer();
            deleteButton = createCustomNoteDeleteButton();

            myNotesSection.appendChild(customNoteContainer);
            customNoteContainer.appendChild(noteTitle);
            customNoteContainer.appendChild(text);
            customNoteContainer.appendChild(deleteButtonContainer);
            deleteButtonContainer.appendChild(deleteButton);
        }
    }
}