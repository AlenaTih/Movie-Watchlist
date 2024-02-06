import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const firebaseConfig = {
    apiKey: "AIzaSyChR30UHiZ4u-_t1mbqPfBTY0g57Smr_HA",
    authDomain: "realtime-database-67683.firebaseapp.com",
    databaseURL: "https://realtime-database-67683-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "realtime-database-67683",
    storageBucket: "realtime-database-67683.appspot.com",
    messagingSenderId: "372372469204",
    appId: "1:372372469204:web:f348e41f2bb53d7aaa9241"
  }

  // Initialize Firebase
const app = initializeApp(firebaseConfig)
const database = getDatabase(app)
const movieDatainDB = ref(database, "MovieWatchlistData")

const searchButton = document.getElementById("search-button")
const inputMovie = document.getElementById("input-movie")
const searchResultsEl = document.getElementById("search-results")

const watchListEl = document.getElementById("watchlist")

const initialStateMain = document.getElementById("initial-state-main")
const initialStateList = document.getElementById("initial-state-list")

const thankYouEl = document.getElementById("thankyou-message")

let movies = []

document.addEventListener("click", function(e) {
    if (e.target.id === "search-button") {
        handleSearchButtonClick()
    } else if (e.target.dataset.add) {
        e.preventDefault()
        addToWatchList(e.target.dataset.add)
    } else if (e.target.dataset.remove) {
        removeFromWatchList(e.target.dataset.remove)
    }
})

localStorage.setItem("movies", JSON.stringify(movies))

let moviesFromLocalStorage = JSON.parse( localStorage.getItem("movies") )


function handleSearchButtonClick() {

    if (searchButton) {
        const movieTitle = inputMovie.value

        fetch(`https://www.omdbapi.com/?apikey=5f66aad6&t=${movieTitle}`)
            .then(response => response.json())
            .then(data => {

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

    moviesFromLocalStorage = JSON.parse( localStorage.getItem("movies") )
    
    const movieObject = moviesFromLocalStorage.filter( function(movie) {
        return movie.imdbID === movieId
    })[0]

    // Push the watchlist data item to the database
    push(movieDatainDB, movieObject)

    // Show thank you message
    thankYouEl.style.display = "flex"
    setTimeout( function() {
        thankYouEl.style.opacity = "1"
    }, 10)  // Slight delay to ensure the fade-in effect plays

    // Hide the thank you message after 3 seconds
    setTimeout( function() {
        thankYouEl.style.opacity = "0"
        setTimeout( function() {
            thankYouEl.style.display = "none"
        }, 1000)  // Hide after the fade-out effect completes
    }, 3000)
}

onValue(movieDatainDB, function(snapshot) {
    if (snapshot.exists()) {

        let movieObj = snapshot.val()

        // let moviesArray = Object.entries(snapshot.val())

        // renderWatchlist(moviesArray)
        
        for (let key in movieObj) {
            renderWatchlist(movieObj[key], key)
        }
    }
})

// for...in loop is a special kind of loop in JavaScript that is used
// to iterate over properties (or keys) of an object

function renderWatchlist(movie, key) {

    if (initialStateList && watchListEl) {
        initialStateList.style.display = "none"

        let newMovie = document.createElement("li")
    
            for (let i = 0; i < 1; i++) {
                newMovie.innerHTML = `
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
                            <image class="remove-button" data-remove="${key}"
                            src="images/remove-icon.png">
                        </div>
                        <p class="movie-plot">${movie.Plot}</p>
                    </div>
                </div>`

                watchListEl.prepend(newMovie)
            }
        }
}


// function renderWatchlist(moviesArray) {


//     if (initialStateList && watchListEl) {
//         initialStateList.style.display = "none"    

//         moviesArray.forEach( function(movie) {
            
//             let watchlistHtml = ""
    
//                 watchlistHtml += `
//                 <div class="movie-result-watchlist" data-movie="${movie.imdbID}">
//                     <img class="movie-poster" src="${movie.Poster}">
//                     <div class="movie-details">
//                         <div class="title-and-rating">
//                             <h4 class="movie-title">${movie.Title}</h4>
//                             <p class="movie-rating">${movie.Ratings[0].Value}</p>
//                         </div>
//                         <div class="about-movie">
//                             <p class="movie-year">${movie.Year}</p>
//                             <p class="movie-duration">${movie.Runtime}</p>
//                             <p class="movie-genre">${movie.Genre}</p>
//                             <image class="remove-button" data-remove="${movie.imdbID}"
//                             src="images/remove-icon.png">
//                         </div>
//                         <p class="movie-plot">${movie.Plot}</p>
//                     </div>
//                 </div>`

//                 watchListEl.innerHTML += watchlistHtml
//             })
//     }
// }

function removeFromWatchList(movieKey) {

        let exactLocationOfItemInDB = ref(database, `MovieWatchlistData/${movieKey}`)
        
        remove(exactLocationOfItemInDB)

}
