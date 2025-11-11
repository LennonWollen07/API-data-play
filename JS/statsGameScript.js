// ----- SETUP -----

// --- API / API data ---
const apiURL = "https://pokeapi.co/api/v2/pokemon";
let apiData;

// loads api on entering the website
window.addEventListener("DOMContentLoaded", fetchData);

// variables
gameMode = null;

// ----- FUNCTIONS -----

// ON START

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
    // ADD THE OTHER GAME LATER OKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK

};

// ----- MAIN CONTENT -----
document.querySelectorAll(".container__gameModes__modes__input").forEach(button => {
    button.addEventListener("click", () => {
        gameMode = button.value;
        console.log(gameMode);
    });
});