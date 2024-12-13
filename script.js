// Function to fetch books from Google Books API
async function fetchBooks(query) {
  const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=20`;
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error("Failed to fetch books.");
    const data = await response.json();
    return data.items || [];
  } catch (error) {
    console.error("Error fetching books:", error);
    return [];
  }
}

// Populate filters dynamically
async function populateFilters(books) {
  const genres = new Set();
  const years = new Set();

  books.forEach((book) => {
    const bookInfo = book.volumeInfo;
    if (bookInfo.categories) genres.add(...bookInfo.categories);
    if (bookInfo.publishedDate) years.add(bookInfo.publishedDate.split("-")[0]);
  });

  // Populate genre filter
  const genreFilter = document.getElementById("genreFilter");
  genres.forEach((genre) => {
    const option = document.createElement("option");
    option.value = genre;
    option.textContent = genre;
    genreFilter.appendChild(option);
  });

  // Populate year filter
  const yearFilter = document.getElementById("yearFilter");
  [...years].sort().forEach((year) => {
    const option = document.createElement("option");
    option.value = year;
    option.textContent = year;
    yearFilter.appendChild(option);
  });
}

// Search and recommend books
document.getElementById("searchBtn").addEventListener("click", async () => {
  const searchInput = document.getElementById("searchInput").value.trim();
  const genreFilter = document.getElementById("genreFilter").value;
  const ratingFilter = parseFloat(
    document.getElementById("ratingFilter").value
  );
  const yearFilter = document.getElementById("yearFilter").value;

  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = ""; // Clear previous results

  if (!searchInput) {
    resultsDiv.innerHTML = `<p>Please enter a search term.</p>`;
    return;
  }

  const books = await fetchBooks(searchInput);
  await populateFilters(books);

  const filteredBooks = books.filter((book) => {
    const bookInfo = book.volumeInfo;
    const matchesGenre = genreFilter
      ? bookInfo.categories?.includes(genreFilter)
      : true;
    const matchesRating = ratingFilter
      ? bookInfo.averageRating >= ratingFilter
      : true;
    const matchesYear = yearFilter
      ? bookInfo.publishedDate?.startsWith(yearFilter)
      : true;
    return matchesGenre && matchesRating && matchesYear;
  });

  if (filteredBooks.length > 0) {
    filteredBooks.forEach((book) => {
      resultsDiv.innerHTML += createBookCard(book);
    });
  } else {
    resultsDiv.innerHTML = `<p>No books found. Try different filters.</p>`;
  }
});

// Function to create a book card
function createBookCard(bookInfo) {
  const book = bookInfo?.volumeInfo;
  const bookId = bookInfo?.id;
  const thumbnail =
    book?.imageLinks?.thumbnail ||
    "https://via.placeholder.com/128x192?text=No+Image";
  const authors = book?.authors ? book?.authors?.join(", ") : "Unknown Author";
  const categories = book.categories
    ? book.categories.join(", ")
    : "Uncategorized";
  return `
    <div class="book">
      <h2><a href="book-detail.html?id=${bookId}">${book.title}</a></h2>
      <img src="${thumbnail}" alt="${book.title} thumbnail"/>
      <p><strong>Authors:</strong> ${authors}</p>
      <p><strong>Categories:</strong> ${categories}</p>
      <p><strong>Published:</strong> ${book.publishedDate || "Unknown"}</p>
      <p><strong>Rating:</strong> ${book.averageRating || "Not Rated"}</p>
    </div>
  `;
}
