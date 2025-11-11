// ----- SETUP -----

// --- API / API data ---
const apiURL = "https://pokeapi.co/api/v2/pokemon";
let apiData;

// loads api on entering the website
window.addEventListener("DOMContentLoaded", fetchData);

// variables
let gameMode = null;
let score = 0;

// ----- FUNCTIONS -----

// --- ON START ---

// gets data from the api
async function fetchData() {

    // trys to get the data from api
    try {

        // species data

        // get response
        const response = await fetch(`${apiURL}?limit=10000`);

        // check response
        if (!response.ok) {

            throw new Error("response status =",response.status); 

        };

        // load data
        apiData = await response.json();

        // enable the links in the header
        enableLinks();

    }

    // if there is an error getting the api
    catch(err) {

        console.error(err);

    };

};

// enables the disabled header links
const enableLinks = function() {

    // finds the links in the document
    const deactiveLinks = document.querySelectorAll(".header__link--deactive");

    deactiveLinks.forEach(link => {

        link.classList.remove("header__link--deactive");
        link.classList.add("header__link--active");

    });

    deactiveLinks[0].href = "/statsGame.html"

};

// --- MAIN CONTENT ---

// when game mode is switched, change text, reset score
document.querySelectorAll(".container__gameModes__modes__input").forEach(button => {

    // when button is clicked
    button.addEventListener("click", () => {

        // game mode is changed to corresponding button
        gameMode = button.value;

        // change gamemode text at the top
        document.getElementById("container__gameModes__title__text").innerHTML = `GameMode - ${gameMode}`

        // change text in the columns
        document.querySelectorAll(".container__gameSpace__column__stat").forEach(text => {

            text.innerHTML = `${gameMode} - ?`

        })

        // reset score
        score = 0;
        document.getElementById("container__points__score").innerHTML = `Points: ${score}`

        // chnage question at the bottom
        document.getElementById("container__bottom__text").innerHTML = `Who has a higher ${gameMode} stat?`

    });

});