import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"
// Import the Firebase Auth module
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js"

const firebaseConfig = {
    apiKey: "AIzaSyChR30UHiZ4u-_t1mbqPfBTY0g57Smr_HA",
    authDomain: "realtime-database-67683.firebaseapp.com",
    databaseURL: "https://realtime-database-67683-default-rtdb.europe-west1.firebasedatabase.app",
  }

  // Initialize Firebase
const app = initializeApp(firebaseConfig)
const database = getDatabase(app)
const movieDatainDB = ref(database, "MovieWatchlistData")

// Initialize Firebase Auth
const auth = getAuth()

const searchButton = document.getElementById("search-button")
const inputMovie = document.getElementById("input-movie")
const searchResultsEl = document.getElementById("search-results")

const watchListEl = document.getElementById("watchlist")

const initialStateMain = document.getElementById("initial-state-main")
const initialStateList = document.getElementById("initial-state-list")

const thankYouEl = document.getElementById("thankyou-message")

const authEl = document.getElementById("auth")
const googleSignInButton = document.getElementById("google-signin-button")
const googleSignOutButton = document.getElementById("google-signout-button")

let newMoviesArray = []

document.addEventListener("click", function(e) {
    if (e.target.id === "search-button") {
        e.preventDefault()
        handleSearchButtonClick()
    } else if (e.target.dataset.remove) {
        removeFromWatchList(e.target.dataset.remove)
    } else if (e.target.id === "google-signin-button") {
        signInWithGoogle()
    } else if (e.target.id === "google-signout-button") {
        signOutFromApp()
    }
})

let newUser = {}

// Function to handle sign-in
function signInWithGoogle() {
    if (googleSignInButton) {
        const provider = new GoogleAuthProvider()
        signInWithPopup(auth, provider)
            .then((response) => {
                console.log(response)
                // User signed in successfully
                const user = response.user
                newUser = user
                console.log("User signed in:", user)

                // Store user information in session storage
                sessionStorage.setItem('user', JSON.stringify(user))

                // After user signed in, render the watchlist
                renderWatchlistFromDatabase(user.uid)
            })
            .catch((error) => {
                // Handle errors
                console.error("Error signing in:", error)
            })
    }
}

// Function to check if user is already authenticated
function checkAuthentication() {
    const user = JSON.parse(sessionStorage.getItem('user'))
    if (user) {
        // User is authenticated, render watchlist
        renderWatchlistFromDatabase(user.uid)
        googleSignInButton.style.display = "none"
        googleSignOutButton.style.display = "block"
    } else {
        // User is not authenticated, handle accordingly (e.g., redirect to login page)
        googleSignInButton.style.display = "block"
        googleSignOutButton.style.display = "none"
    }
}

// Call checkAuthentication when the page loads
window.addEventListener('load', checkAuthentication)


function renderWatchlistFromDatabase(userId) {
    // Reference to the user's watchlist node
    let userWatchlistRef = ref(database, `MovieWatchlistData/${userId}`)

    // Event listener to render the watchlist when data changes
    onValue(userWatchlistRef, function(snapshot) {
        if (snapshot.exists()) {
            if (watchListEl) {
                watchListEl.innerHTML = "" // Clear previous watchlist items
            }
            let movieObj = snapshot.val()
            console.log(movieObj)
            for (let key in movieObj) {
                renderWatchlist(movieObj[key], key)
            }
        }
    })
}

// for...in loop is a special kind of loop in JavaScript that is used
// to iterate over properties (or keys) of an object

function signOutFromApp() {
    if (googleSignOutButton) {
        signOut(auth)
        .then(() => {
            // User signed out successfully
            console.log("User signed out")
        })
        .catch((error) => {
            // Handle errors
            console.error("Error signing out:", error)
        })
    }
}


function handleSearchButtonClick() {

    if (searchButton) {
        if (!inputMovie.value.trim()) {
            alert("Please type in the title of the movie you want ❤️")
            return
        } else {
            const movieTitle = inputMovie.value

            fetch(`https://www.omdbapi.com/?apikey=5f66aad6&s=${movieTitle}`)
                .then(response => response.json())
                .then(data => {
                    // console.log(data)
                    // renderSearchResults(data)
                    renderSearchResults(data.Search)
            } )
                // .catch((error) => {
                //     console.error(error)
                //     initialStateMain.innerHTML = `
                //     <h2>Unable to find what you’re looking for. Please try another search.</h2>`
                // })
    }
        }
}

function renderSearchResults(moviesArray) {

    initialStateMain.style.display = "none"

    let searchResultsHtml = ""

    moviesArray.forEach( function(movie) {
        searchResultsHtml += `
            <div class="movie-result" data-movie="${movie.imdbID}">
                <img class="movie-poster" src="${movie.Poster}">
                <div class="movie-details">
                    <div class="title-and-rating">
                        <h4 class="movie-title">${movie.Title}</h4>
                    </div>
                    <div class="about-movie">
                        <p class="movie-year">${movie.Year}</p>
                        <image class="add-button" data-add="${movie.imdbID}"
                        src="images/add-icon.png">
                    </div>
                </div>
            </div>`

            newMoviesArray.push(movie)
    })

    searchResultsEl.innerHTML = searchResultsHtml

    document.addEventListener("click", function(e) {
        if (e.target.dataset.add) {
            e.preventDefault()

            const chosenMovie = newMoviesArray.filter( function(movieItem) {
                return movieItem.imdbID === e.target.dataset.add
            })[0]

            addToWatchList(chosenMovie)
        }
    })

}

function addToWatchList(movie) {
    const user = JSON.parse(sessionStorage.getItem('user'))

    const userId = user.uid

    // Reference to the user's watchlist node
    const userWatchlistRef = ref(database, `MovieWatchlistData/${userId}`)

    // Check if the movie already exists in the user's watchlist
    onValue(userWatchlistRef, function(snapshot) {
        if (!snapshot.exists() || !Object.values(snapshot.val()).some((item) => item.imdbID === movie.imdbID)) {
            // Push the movie to the user's watchlist node
            push(userWatchlistRef, movie)

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
        } else {
            console.log("Movie already exists in the watchlist")
        }
    })
}

// Function to render the watchlist
function renderWatchlist(movie, key) {
    if (initialStateList && watchListEl) {
        initialStateList.style.display = "none"

        let newMovie = document.createElement("li")

        newMovie.innerHTML = `
            <div class="movie-result-watchlist" data-movie="${movie.imdbID}">
                <img class="movie-poster" src="${movie.Poster}">
                <div class="movie-details">
                    <div class="title-and-rating">
                        <h4 class="movie-title">${movie.Title}</h4>
                    </div>
                    <div class="about-movie">
                        <p class="movie-year">${movie.Year}</p>
                        <image class="add-button" data-remove="${key}"
                        src="images/remove-icon.png">
                    </div>
                </div>
            </div>`

        watchListEl.prepend(newMovie)
    }
}

// Function to remove a movie from the watchlist
function removeFromWatchList(movieKey) {
    const user = JSON.parse(sessionStorage.getItem('user'))

    const userId = user.uid

    let exactLocationOfItemInDB = ref(database, `MovieWatchlistData/${userId}/${movieKey}`)
    remove(exactLocationOfItemInDB)
}
