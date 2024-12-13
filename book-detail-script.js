async function fetchBookDetails(bookId) {
  const apiUrl = `https://www.googleapis.com/books/v1/volumes/${bookId}`;
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error("Failed to fetch book details.");
    const data = await response.json();
    return data.volumeInfo || {};
  } catch (error) {
    console.error("Error fetching book details:", error);
    return {};
  }
}

function displayBookDetails(book) {
  const bookDetailDiv = document.getElementById("bookDetail");
  const thumbnail =
    book.imageLinks?.thumbnail ||
    "https://via.placeholder.com/300x450?text=No+Image";
  const authors = book.authors ? book.authors.join(", ") : "Unknown Author";
  const categories = book.categories
    ? book.categories.join(", ")
    : "Uncategorized";

  bookDetailDiv.innerHTML = `
      <img src="${thumbnail}" alt="${book.title} thumbnail"/>
      <h1>${book.title}</h1>
      <div class="book-meta">
        <p><strong>Authors:</strong> ${authors}</p>
        <p><strong>Categories:</strong> ${categories}</p>
        <p><strong>Published:</strong> ${book.publishedDate || "Unknown"}</p>
        <p><strong>Rating:</strong> ${book.averageRating || "Not Rated"}</p>
      </div>
      <div class="description">
        <strong>Description:</strong>
        <p>${book.description || "No description available."}</p>
      </div>
      <a href="index.html">Back to Search</a>
    `;
}

// Get the book ID from the URL query parameter
const urlParams = new URLSearchParams(window.location.search);
const bookId = urlParams.get("id");

if (bookId) {
  fetchBookDetails(bookId).then(displayBookDetails);
} else {
  document.getElementById("bookDetail").innerHTML = "<h1>No book found.</h1>";
}
