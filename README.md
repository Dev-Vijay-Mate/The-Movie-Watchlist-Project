# Movie Watchlist

## About the Project

This is a web application where you can search for movies and add them to a personal watchlist. It uses the OMDb API to fetch real movie data based on what the user searches. The idea is to have a simple movie tracker where you can save movies you want to watch later.

## API Used

- **OMDb API** - https://www.omdbapi.com/
  - Used to search movies and get details like title, year, poster, and type.

## Features

- Search movies by name using the OMDb API
- Add or remove movies from a personal watchlist
- Filter results by type (Movie or Series)
- Sort results alphabetically (A to Z or Z to A)
- Shows a message when no results are found or when the watchlist is empty
- Random Movie Night button that picks a random movie from your watchlist
- Responsive design that works on mobile, tablet, and desktop
- Dark theme UI

## Technologies Used

- HTML
- CSS
- JavaScript (Fetch API, Array HOFs)

## How to Run

1. Clone or download this repository
2. Get a free API key from https://www.omdbapi.com/apikey.aspx
3. Open `script.js` and replace `YOUR_API_KEY` with your actual API key
4. Open `index.html` in any browser

## Project Structure

```
movie-watchlist/
├── index.html
├── style.css
├── script.js
└── README.md
```
