const searchButton = document.getElementById("search-button")
const inputMovie = document.getElementById("input-movie")
const searchResultsEl = document.getElementById("search-results")
const addButton = document.getElementById("add-button")
const watchListEl = document.getElementById("watchlist")

const initialStateMain = document.getElementById("initial-state-main")
const initialStateList = document.getElementById("initial-state-list")

let movies = []

document.addEventListener("click", function(e) {
    if (e.target.dataset.add) {
        e.preventDefault()
        addToWatchList(e.target.dataset.add)
    } else if (e.target.id === "search-button") {
        handleSearchButtonClick()
    } else if (e.target.dataset.remove) {
        removeFromWatchList(e.target.dataset.remove)
    }
})

localStorage.setItem("movies", JSON.stringify(movies))

let moviesFromLocalStorage = JSON.parse( localStorage.getItem("movies") )

let watchListFromLocalStorage = JSON.parse( localStorage.getItem("watchlist") )

if (watchListFromLocalStorage && watchListFromLocalStorage.length > 0) {
    renderWatchlist()
}

function handleSearchButtonClick() {

    if (searchButton) {
        const movieTitle = inputMovie.value

        fetch(`http://www.omdbapi.com/?apikey=5f66aad6&t=${movieTitle}`)
            .then(response => response.json())
            .then(data => {

                console.log(data)

                // renderSearchResults(data.Search)

                renderSearchResults(data)
        } )
    }
}

function renderSearchResults(movie) {

    initialStateMain.style.display = "none"

    searchResultsEl.innerHTML = `
        <div class="movie-result" data-movie="${movie.imdbID}">
            <img class="movie-poster" src="${movie.Poster}">
            <div class="movie-details">
                <div class="title-and-rating">
                    <h4 class="movie-title">${movie.Title}</h4>
                    <p class="movie-rating">${movie.Ratings[0].Value}</p>
                </div>
                <div class="about-movie">
                    <p class="movie-year">${movie.Year}</p>
                    <p class="movie-duration">${movie.Runtime}</p>
                    <p class="movie-genre">${movie.Genre}</p>
                    <image class="add-button" data-add="${movie.imdbID}"
                    src="images/add-icon.png">
                </div>
                <p class="movie-plot">${movie.Plot}</p>
            </div>
        </div>`

    moviesFromLocalStorage.push(movie)
    localStorage.setItem("movies", JSON.stringify(moviesFromLocalStorage))
}

function addToWatchList(movieId) {
    
    const movieObject = moviesFromLocalStorage.filter( function(movie) {
        return movie.imdbID === movieId
    })[0]

    let watchList = JSON.parse(localStorage.getItem("watchlist")) || []
    watchList.unshift(movieObject)
    localStorage.setItem("watchlist", JSON.stringify(watchList))

    alert("Movie added to your watchlist!")

    renderWatchlist()
}

function renderWatchlist() {

    if (watchListEl) {
        watchListEl.textContent = ""
    }

    if (initialStateList && watchListEl && watchListFromLocalStorage && watchListFromLocalStorage.length > 0) {

        watchListFromLocalStorage = JSON.parse( localStorage.getItem("watchlist") )
        console.log(watchListFromLocalStorage)

        initialStateList.style.display = "none"

        watchListFromLocalStorage.forEach( function(movie) {
            let watchlistHtml = ""

            watchlistHtml += `
                <div class="movie-result-watchlist" data-movie="${movie.imdbID}">
                    <img class="movie-poster" src="${movie.Poster}">
                    <div class="movie-details">
                        <div class="title-and-rating">
                            <h4 class="movie-title">${movie.Title}</h4>
                            <p class="movie-rating">${movie.Ratings[0].Value}</p>
                        </div>
                        <div class="about-movie">
                            <p class="movie-year">${movie.Year}</p>
                            <p class="movie-duration">${movie.Runtime}</p>
                            <p class="movie-genre">${movie.Genre}</p>
                            <image class="remove-button" data-remove="${movie.imdbID}"
                            src="images/remove-icon.png">
                        </div>
                        <p class="movie-plot">${movie.Plot}</p>
                    </div>
                </div>`

                watchListEl.innerHTML += watchlistHtml
        })
    }
}

function removeFromWatchList(movieId) {
    
    const movieObject = watchListFromLocalStorage.filter( function(movie) {
        return movie.imdbID === movieId
    })[0]

    let watchList = JSON.parse(localStorage.getItem("watchlist")) || []
    console.log(watchList)
    watchList = watchList.filter(
        (movieItem) => !(movieItem.imdbID === movieObject.imdbID)
    )
    localStorage.setItem("watchlist", JSON.stringify(watchList))

    renderWatchlist()
}
