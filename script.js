// Fetch the JSON data
let books = [];

// Sample data fetch (replace with actual API call or local JSON)
fetch("data.json")
  .then((response) => response.json())
  .then((data) => {
    books = data; // Store the book data
    populateFilters(); // Populate filters dynamically
  })
  .catch((error) => console.error("Error loading data:", error));

// Populate genre and year filters dynamically
function populateFilters() {
  const genres = [...new Set(books.map((book) => book.categories))]; // Get unique genres
  const years = [...new Set(books.map((book) => book.published_year))]; // Get unique years

  const genreSelect = document.getElementById("genreFilter");
  genres.forEach((genre) => {
    const option = document.createElement("option");
    option.value = genre;
    option.textContent = genre;
    genreSelect.appendChild(option);
  });

  const yearSelect = document.getElementById("yearFilter");
  years.forEach((year) => {
    const option = document.createElement("option");
    option.value = year;
    option.textContent = year;
    yearSelect.appendChild(option);
  });
}

// Search and recommend books
document.getElementById("searchBtn").addEventListener("click", () => {
  const searchInput = document
    .getElementById("searchInput")
    .value.toLowerCase();
  const genreFilter = document.getElementById("genreFilter").value;
  const ratingFilter = parseFloat(
    document.getElementById("ratingFilter").value
  );
  const yearFilter = document.getElementById("yearFilter").value;

  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = ""; // Clear previous results

  // Filter books based on user input
  const filteredBooks = books.filter((book) => {
    const matchesSearch = book.title.toLowerCase().includes(searchInput);
    const matchesGenre = genreFilter
      ? book.categories.includes(genreFilter)
      : true;
    const matchesRating = ratingFilter
      ? book.average_rating >= ratingFilter
      : true;
    const matchesYear = yearFilter ? book.published_year == yearFilter : true;
    return matchesSearch && matchesGenre && matchesRating && matchesYear;
  });

  if (filteredBooks.length > 0) {
    filteredBooks.forEach((book) => {
      resultsDiv.innerHTML += createBookCard(book);
    });
  } else {
    resultsDiv.innerHTML = `<p>No books found based on the selected filters. Try different criteria.</p>`;
  }
});

// Function to create a book card with only required details
function createBookCard(book) {
  return `
    <div class="book" data-id="${book.isbn13}">
      <h2>${book.title} by ${book.authors}</h2>
      <img src="${book.thumbnail}" alt="${
    book.title
  } thumbnail" class="book-thumbnail"/>
      <p><strong>Category:</strong> ${book.categories}</p>
      <p><strong>Published Year:</strong> ${book.published_year}</p>
      <p><strong>Rating:</strong> ${book.average_rating}</p>
      <p><strong>Pages:</strong> ${book.num_pages}</p>
      <p><strong>Ratings Count:</strong> ${book.ratings_count}</p>
      <p class="short-description">${book.description.slice(
        0,
        100
      )}... <a href="#" class="more-link">More</a></p>
      <div class="full-details" style="display: none;">
        <p><strong>Description:</strong> ${book.description}</p>
        <p><strong>ISBN-13:</strong> ${book.isbn13}</p>
        <p><strong>ISBN-10:</strong> ${book.isbn10}</p>
      </div>
    </div>
  `;
}

// Function to toggle details
function toggleDetails(event) {
  event.preventDefault();
  const bookCard = event.target.closest(".book");
  const shortDescription = bookCard.querySelector(".short-description");
  const fullDetails = bookCard.querySelector(".full-details");

  if (fullDetails.style.display === "none") {
    fullDetails.style.display = "block";
    shortDescription.style.display = "none";
  } else {
    fullDetails.style.display = "none";
    shortDescription.style.display = "block";
  }
}
