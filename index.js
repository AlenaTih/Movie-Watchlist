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
        console.log("clicked")
        e.preventDefault()
        addToWatchList(e.target.dataset.add)
    } else if (e.target.id === "search-button") {
        handleSearchButtonClick()
    }
})

localStorage.setItem("movies", JSON.stringify(movies))

let moviesFromLocalStorage = JSON.parse( localStorage.getItem("movies") )

let watchListFromLocalStorage = JSON.parse( localStorage.getItem("watchlist") )

// watchListFromLocalStorage = [watchListFromLocalStorage]

if (watchListFromLocalStorage && watchListFromLocalStorage.length > 0) {
    renderWatchlist()
}
// else {
//     localStorage.setItem("movies", JSON.stringify(movies))
//     moviesFromLocalStorage = JSON.parse( localStorage.getItem("movies") )
// }

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

// function renderSearchResults(moviesArr) {

//     moviesArr.forEach( function(movie) {
//         let movieResultsHtml = ""

//         movieResultsHtml += `
//         <div class="movie-result">
//             <img class="movie-poster" src="${movie.Poster}">
//             <div class="movie-details">
//                 <div>
//                     <h4 class="movie-title">${movie.Title}</h4>
//                     <p class="movie-rating"></p>
//                 </div>
//                 <div>
//                     <p class="movie-year">${movie.Year}</p>
//                     <p class="duration"></p>
//                     <p class="genre"></p>
//                     <button class="add-button" id="add-button">+</button>
//                 </div>
//                 <p class="movie-plot"></p>
//             </div>
//         </div>`

//         searchResultsEl.innerHTML += movieResultsHtml

//     })
// }

function renderSearchResults(movie) {

    // let movies = []

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
                    <button class="add-button" data-add="${movie.imdbID}">+</button>
                </div>
                <p class="movie-plot">${movie.Plot}</p>
            </div>
        </div>`

    moviesFromLocalStorage.push(movie)
    localStorage.setItem("movies", JSON.stringify(moviesFromLocalStorage))
}

function addToWatchList(movieId) {
    console.log(movieId)

    const movieObject = moviesFromLocalStorage.filter( function(movie) {
        return movie.imdbID === movieId
    })[0]

    console.log(movieObject)

    const newMovies = []

    newMovies.push(movieObject)

    localStorage.setItem("watchlist", JSON.stringify(newMovies))

    renderWatchlist()
}

function renderWatchlist() {

    if (initialStateList && watchListEl && watchListFromLocalStorage && watchListFromLocalStorage.length > 0) {

        watchListFromLocalStorage = JSON.parse( localStorage.getItem("watchlist") )
        console.log(watchListFromLocalStorage)

        initialStateList.style.display = "none"

        watchListFromLocalStorage.forEach( function(movie) {
            let watchlistHtml = ""

            watchlistHtml += `
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
                            <button class="remove-button" data-remove="${movie.imdbID}">+</button>
                        </div>
                        <p class="movie-plot">${movie.Plot}</p>
                    </div>
                </div>`

                watchListEl.innerHTML += watchlistHtml
        })

        // watchListEl.innerHTML += `
        // <div class="movie-result" data-movie="${movie.imdbID}">
        //     <img class="movie-poster" src="${movie.Poster}">
        //     <div class="movie-details">
        //         <div class="title-and-rating">
        //             <h4 class="movie-title">${movie.Title}</h4>
        //             <p class="movie-rating">${movie.Ratings[0].Value}</p>
        //         </div>
        //         <div class="about-movie">
        //             <p class="movie-year">${movie.Year}</p>
        //             <p class="movie-duration">${movie.Runtime}</p>
        //             <p class="movie-genre">${movie.Genre}</p>
        //             <button class="remove-button" data-remove="${movie.imdbID}">+</button>
        //         </div>
        //         <p class="movie-plot">${movie.Plot}</p>
        //     </div>
        // </div>`
    }
}

// renderWatchlist()
