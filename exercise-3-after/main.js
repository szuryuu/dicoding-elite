let notDoneYet = [];

document.addEventListener("DOMContentLoaded", () => {
  // const submitForm = document.getElementById("bookForm");
  // submitForm.addEventListener("submit", function (event) {
  //   event.preventDefault();
  //   addTodo();
  // });

  const submitForm = document.getElementById("bookForm");
  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addTodo();
  });

  const searchBookForm = document.getElementById("searchBook");
  searchBookForm.addEventListener("submit", function (event) {
    event.preventDefault();
    matchBook();
  });

  showBooks();
});

function addTodo() {
  const id = new Date().getTime();
  const title = document.getElementById("bookFormTitle").value;
  const author = document.getElementById("bookFormAuthor").value;
  const year = Number(document.getElementById("bookFormYear").value);
  const isComplete = document.getElementById("bookFormIsComplete").checked;

  const dataBook = { id, title, author, year, isComplete };

  localStorage.setItem(`${id}`, JSON.stringify(dataBook));
  console.log("data ditambahkan");
  alert(`Buku berjudul "${title}" telah berhasil ditambahkan.`);

  document.getElementById("bookForm").reset();

  showBooks();
}

function showBooks() {
  clearBookLists();
  notDoneYet = [];

  for (let i = 0; i < localStorage.length; i++) {
    // bookKey = localStorage.key(i);
    // bookInfo = JSON.parse(localStorage.getItem(`${bookKey}`));
    let bookKey = localStorage.key(i);
    let bookInfo = JSON.parse(localStorage.getItem(`${bookKey}`));

    let bookItemTitle = document.createElement("h3");
    bookItemTitle.textContent = bookInfo.title;
    // bookItemTitle.setAttribute("data-testid", `${bookInfo.title}`);
    bookItemTitle.setAttribute("data-testid", "bookItemTitle");

    let bookItemAuthor = document.createElement("p");
    bookItemAuthor.textContent = `Penulis: ${bookInfo.author}`;
    // bookItemAuthor.setAttribute("data-testid", `${bookInfo.author}`);
    bookItemAuthor.setAttribute("data-testid", "bookItemAuthor");

    let bookItemYear = document.createElement("p");
    bookItemYear.textContent = `Tahun: ${bookInfo.year}`;
    // bookItemYear.setAttribute("data-testid", `${bookInfo.year}`);
    bookItemYear.setAttribute("data-testid", "bookItemYear");

    let bookItemIsCompleteButton = document.createElement("button");
    // bookItemIsCompleteButton.textContent = "Selesai dibaca";

    if (bookInfo.isComplete) {
      bookItemIsCompleteButton.textContent = "Belum selesai dibaca";
    } else {
      bookItemIsCompleteButton.textContent = "Selesai dibaca";
    }

    bookItemIsCompleteButton.setAttribute("id", `${bookInfo.id}1`);
    bookItemIsCompleteButton.setAttribute(
      "data-testid",
      "bookItemIsCompleteButton",
    );
    // bookItemIsCompleteButton.setAttribute("onclick", `itemIsComplete(id)`);
    bookItemIsCompleteButton.setAttribute(
      "onclick",
      `itemIsComplete(${bookInfo.id})`,
    );

    let bookItemDeleteButton = document.createElement("button");
    bookItemDeleteButton.textContent = "Hapus Buku";
    bookItemDeleteButton.setAttribute("id", `${bookInfo.id}2`);
    bookItemDeleteButton.setAttribute("data-testid", "bookItemDeleteButton");
    // bookItemDeleteButton.setAttribute("onclick", "deleteMe(id)");
    bookItemDeleteButton.setAttribute("onclick", `deleteMe(${bookInfo.id})`);

    let bookItemEditButton = document.createElement("button");
    bookItemEditButton.textContent = "Edit Buku";
    bookItemEditButton.setAttribute("id", `${bookInfo.id}3`);
    bookItemEditButton.setAttribute("data-testid", "bookItemEditButton");

    let buttonContainer = document.createElement("div");
    buttonContainer.style.display = "flex";
    buttonContainer.style.flexDirection = "row";
    buttonContainer.style.gap = "0.5rem";
    buttonContainer.appendChild(bookItemIsCompleteButton);
    buttonContainer.appendChild(bookItemDeleteButton);
    buttonContainer.appendChild(bookItemEditButton);

    const bookItem = document.createElement("div");
    bookItem.style.display = "flex";
    bookItem.style.flexDirection = "column";
    bookItem.style.gap = "0.5rem";
    bookItem.appendChild(bookItemTitle);
    bookItem.appendChild(bookItemAuthor);
    bookItem.appendChild(bookItemYear);
    bookItem.appendChild(buttonContainer);
    bookItem.setAttribute("data-bookid", `${bookInfo.id}`);
    bookItem.setAttribute("data-testid", "bookItem");

    if (bookInfo.isComplete == true) {
      let completeBooks = document.getElementById("completeBookList");
      completeBooks.appendChild(bookItem);
    } else if (bookInfo.isComplete == false) {
      let incompleteBooks = document.getElementById("incompleteBookList");
      incompleteBooks.appendChild(bookItem);
      notDoneYet.push(bookInfo);
    }
  }
}

let itemIsComplete = (id) => {
  // const idButton = Number(id.slice(0, -1));
  console.log(id);
  let bookChanged = JSON.parse(localStorage.getItem(id));

  if (bookChanged.isComplete == false) {
    let objBookChanged = { ...bookChanged, isComplete: true };

    localStorage.setItem(`${id}`, JSON.stringify(objBookChanged));
    alert(`Buku berjudul "${bookChanged.title}" telah selesai dibaca.`);
    // location.reload();
  } else {
    let objBookChanged = { ...bookChanged, isComplete: false };

    localStorage.setItem(`${id}`, JSON.stringify(objBookChanged));
    alert(`Buku berjudul "${bookChanged.title}" rupanya belum selesai dibaca.`);
    // location.reload();
  }

  showBooks();
};

let deleteMe = (id) => {
  // const idButton = Number(id.slice(0, -1));
  console.log(id);
  let bookChanged = JSON.parse(localStorage.getItem(id));

  localStorage.removeItem(`${id}`);

  alert(`Buku berjudul "${bookChanged.title}" telah dihapus dari rak.`);
  // location.reload();

  showBooks();
};

let myLibrary = [];

function matchBook() {
  const valueSearchBook = document.getElementById("searchBookTitle").value;
  const searchBookForm = document.getElementById("searchBook");
  const searchResult = document.getElementById("searchResult");

  searchResult.innerHTML = "";

  myLibrary = [];

  for (let i = 0; i < localStorage.length; i++) {
    let bookKey = localStorage.key(i);
    let bookInfo = JSON.parse(localStorage.getItem(`${bookKey}`));
    myLibrary.push(bookInfo);
    console.log(myLibrary);

    let bookItemTitle = document.createElement("h3");
    bookItemTitle.textContent = bookInfo.title;

    let bookItemAuthor = document.createElement("p");
    bookItemAuthor.textContent = `Penulis: ${bookInfo.author}`;

    let bookItemYear = document.createElement("p");
    bookItemYear.textContent = `Tahun: ${bookInfo.year}`;

    let bookItemIsCompleteButton = document.createElement("button");
    // bookItemIsCompleteButton.textContent = "Selesai dibaca";

    if (bookInfo.isComplete) {
      bookItemIsCompleteButton.textContent = "Belum selesai dibaca";
    } else {
      bookItemIsCompleteButton.textContent = "Selesai dibaca";
    }

    bookItemIsCompleteButton.setAttribute("id", `${bookInfo.id}1`);
    bookItemIsCompleteButton.setAttribute(
      "data-testid",
      "bookItemIsCompleteButton",
    );
    // bookItemIsCompleteButton.setAttribute("onclick", `itemIsComplete(id)`);
    bookItemIsCompleteButton.setAttribute(
      "onclick",
      `itemIsComplete(${bookInfo.id})`,
    );

    let bookItemDeleteButton = document.createElement("button");
    bookItemDeleteButton.textContent = "Hapus Buku";
    bookItemDeleteButton.setAttribute("id", `${bookInfo.id}2`);
    bookItemDeleteButton.setAttribute("data-testid", "bookItemDeleteButton");
    // bookItemDeleteButton.setAttribute("onclick", "deleteMe(id)");
    bookItemDeleteButton.setAttribute("onclick", `deleteMe(${bookInfo.id})`);

    let bookItemEditButton = document.createElement("button");
    bookItemEditButton.textContent = "Edit Buku";
    bookItemEditButton.setAttribute("id", `${bookInfo.id}3`);
    bookItemEditButton.setAttribute("data-testid", "bookItemEditButton");

    let buttonContainer = document.createElement("div");
    buttonContainer.style.display = "flex";
    buttonContainer.style.flexDirection = "row";
    buttonContainer.style.gap = "0.5rem";
    buttonContainer.appendChild(bookItemIsCompleteButton);
    buttonContainer.appendChild(bookItemDeleteButton);
    buttonContainer.appendChild(bookItemEditButton);

    const bookItem = document.createElement("div");
    bookItem.style.display = "flex";
    bookItem.style.flexDirection = "column";
    bookItem.style.gap = "0.5rem";
    bookItem.style.border = "solid 0.1rem #213555";
    bookItem.style.borderRadius = "1rem";
    bookItem.style.padding = "1rem";
    bookItem.style.marginTop = "2rem";
    bookItem.appendChild(bookItemTitle);
    bookItem.appendChild(bookItemAuthor);
    bookItem.appendChild(bookItemYear);
    bookItem.appendChild(buttonContainer);

    if (bookInfo.title.toLowerCase().includes(valueSearchBook.toLowerCase())) {
      searchResult.appendChild(bookItem);
    }
  }
  searchBookForm.reset();
}

function clearBookLists() {
  document.getElementById("incompleteBookList").innerHTML = "";
  document.getElementById("completeBookList").innerHTML = "";
}
