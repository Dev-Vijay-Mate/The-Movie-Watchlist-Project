const API_KEY = "bb3140db";
const API_URL = "https://www.omdbapi.com/";

let movies = [];
let watchlist = [];

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const movieGrid = document.getElementById("movieGrid");
const loadingMsg = document.getElementById("loadingMsg");
const noResults = document.getElementById("noResults");
const watchlistContainer = document.getElementById("watchlistContainer");
const emptyMsg = document.getElementById("emptyMsg");
const randomBtn = document.getElementById("randomBtn");
const filterType = document.getElementById("filterType");
const sortOrder = document.getElementById("sortOrder");
const themeToggle = document.getElementById("themeToggle");
const detailsModal = document.getElementById("detailsModal");
const closeModal = document.getElementById("closeModal");
const modalBody = document.getElementById("modalBody");
const startPrompt = document.getElementById("startPrompt");
const header = document.querySelector("header");
let searchTimeout = null;

searchBtn.addEventListener("click", function () {
    let query = searchInput.value.trim();
    if (query === "") return;
    hideStartPrompt();
    fetchMovies(query);
});

searchInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        let query = searchInput.value.trim();
        if (query === "") return;
        hideStartPrompt();
        fetchMovies(query);
    }
});

searchInput.addEventListener("input", function () {
    let query = searchInput.value.trim();
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(function () {
        if (query === "") {
            movies = [];
            movieGrid.innerHTML = "";
            noResults.classList.add("hidden");
            showStartPrompt();
            return;
        }
        hideStartPrompt();
        fetchMovies(query);
    }, 300);
});

function fetchMovies(query) {
    hideStartPrompt();
    loadingMsg.classList.remove("hidden");
    noResults.classList.add("hidden");
    movieGrid.innerHTML = "";

    fetch(API_URL + "?s=" + query + "&apikey=" + API_KEY)
        .then(function (res) {
            return res.json();
        })
        .then(function (data) {
            loadingMsg.classList.add("hidden");
            if (data.Response === "False") {
                noResults.classList.remove("hidden");
                movies = [];
            } else {
                movies = data.Search;
                showMovies();
            }
        })
        .catch(function () {
            loadingMsg.classList.add("hidden");
            noResults.classList.remove("hidden");
        });
}

function showMovies() {
    let filtered = movies.filter(function (movie) {
        let type = filterType.value;
        if (type === "all") return true;
        return movie.Type === type;
    });

    let sorted = filtered.sort(function (a, b) {
        let order = sortOrder.value;
        if (order === "az") return a.Title.localeCompare(b.Title);
        if (order === "za") return b.Title.localeCompare(a.Title);
        return 0;
    });

    if (sorted.length === 0) {
        hideStartPrompt();
        noResults.classList.remove("hidden");
        movieGrid.innerHTML = "";
        return;
    }

    noResults.classList.add("hidden");

    movieGrid.innerHTML = sorted.map(function (movie) {
        let alreadyAdded = watchlist.find(function (w) {
            return w.imdbID === movie.imdbID;
        });

        let poster = movie.Poster !== "N/A"
            ? movie.Poster
            : "https://placehold.co/200x300?text=No+Image";

        let btnClass = alreadyAdded ? "btn-added" : "btn-add";
        let btnText = alreadyAdded ? "✓ In Watchlist" : "+ Watchlist";

        return `<div class="card">
            <img src="${poster}" alt="${movie.Title}">
            <div class="card-info">
                <h3>${movie.Title}</h3>
                <p>${movie.Year} • ${movie.Type}</p>
                <div class="button-group">
                    <button class="${btnClass}" onclick="toggleWatchlist('${movie.imdbID}', \`${movie.Title}\`, '${poster}', '${movie.Year}')">
                        ${btnText}
                    </button>
                    <button class="btn-secondary" onclick="fetchMovieDetails('${movie.imdbID}')">
                        View Details
                    </button>
                </div>
            </div>
        </div>`;
    }).join("");
}

function fetchMovieDetails(id) {
    modalBody.innerHTML = "<p>Loading details...</p>";
    detailsModal.classList.remove("hidden");

    fetch(API_URL + "?i=" + id + "&apikey=" + API_KEY)
        .then(function (res) {
            return res.json();
        })
        .then(function (data) {
            if (data.Response === "True") {
                modalBody.innerHTML = `
                    <h3>${data.Title} (${data.Year})</h3>
                    <p>${data.Plot}</p>
                    <div class="detail-grid">
                        <span><strong>Type:</strong> ${data.Type}</span>
                        <span><strong>Genre:</strong> ${data.Genre}</span>
                        <span><strong>Director:</strong> ${data.Director}</span>
                        <span><strong>IMDB Rating:</strong> ${data.imdbRating}</span>
                    </div>
                `;
            } else {
                modalBody.innerHTML = "<p>Movie details are not available.</p>";
            }
        })
        .catch(function () {
            modalBody.innerHTML = "<p>Unable to load details. Please try again.</p>";
        });
}

function showStartPrompt() {
    startPrompt.classList.remove("hidden");
    noResults.classList.add("hidden");
    movieGrid.innerHTML = "";
}

function hideStartPrompt() {
    startPrompt.classList.add("hidden");
}

function closeDetailModal() {
    detailsModal.classList.add("hidden");
}

closeModal.addEventListener("click", closeDetailModal);
detailsModal.addEventListener("click", function (e) {
    if (e.target === detailsModal) {
        closeDetailModal();
    }
});

document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
        closeDetailModal();
    }
});

function initTheme() {
    const savedTheme = localStorage.getItem("movieAppTheme") || "dark";
    const isLight = savedTheme === "light";
    document.documentElement.classList.toggle("theme-light", isLight);
    themeToggle.textContent = isLight ? "🌙 Dark Mode" : "☀️ Light Mode";
}

function toggleTheme() {
    const isLight = document.documentElement.classList.toggle("theme-light");
    themeToggle.textContent = isLight ? "🌙 Dark Mode" : "☀️ Light Mode";
    localStorage.setItem("movieAppTheme", isLight ? "light" : "dark");
}

function toggleWatchlist(id, title, poster, year) {
    let exists = watchlist.find(function (w) {
        return w.imdbID === id;
    });

    if (exists) {
        watchlist = watchlist.filter(function (w) {
            return w.imdbID !== id;
        });
    } else {
        watchlist.push({ imdbID: id, Title: title, Poster: poster, Year: year });
    }

    showWatchlist();
    showMovies();
}

function showWatchlist() {
    if (watchlist.length === 0) {
        emptyMsg.classList.remove("hidden");
        watchlistContainer.innerHTML = "";
        return;
    }

    emptyMsg.classList.add("hidden");

    watchlistContainer.innerHTML = watchlist.map(function (movie) {
        return `<div class="watchlist-item">
            <img src="${movie.Poster}" alt="${movie.Title}">
            <div>
                <p>${movie.Title}</p>
                <small>${movie.Year}</small>
            </div>
            <button onclick="toggleWatchlist('${movie.imdbID}', \`${movie.Title}\`, '${movie.Poster}', '${movie.Year}')">✕</button>
        </div>`;
    }).join("");
}

randomBtn.addEventListener("click", function () {
    if (watchlist.length === 0) {
        alert("Add some movies to your watchlist first!");
        return;
    }
    showRandomPick();
});

function showRandomPick() {
    let randomIndex = Math.floor(Math.random() * watchlist.length);
    let picked = watchlist[randomIndex];

    modalBody.innerHTML = `
        <div class="random-pick-card">
            <div class="random-pick-header">
                <span class="dice-icon">🎲</span>
                TONIGHT'S PICK
            </div>
            <img src="${picked.Poster}" alt="${picked.Title}" class="random-poster">
            <div class="random-pick-info">
                <h3>${picked.Title}</h3>
                <small>${picked.Year}</small>
            </div>
            <button class="random-close-btn" onclick="closeDetailModal()">Close</button>
        </div>
    `;

    detailsModal.classList.remove("hidden");
}

filterType.addEventListener("change", function () {
    showMovies();
});

sortOrder.addEventListener("change", function () {
    showMovies();
});

themeToggle.addEventListener("click", toggleTheme);

window.addEventListener("scroll", function () {
    if (window.scrollY > 100) {
        header.classList.add("header-scrolled");
    } else {
        header.classList.remove("header-scrolled");
    }
});

initTheme();
showStartPrompt();
