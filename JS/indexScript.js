// ----- SETUP -----

// --- API / API data ---
const apiURL = "https://pokeapi.co/api/v2/pokemon";
let apiData;

// variables
let currentPokemon;

// loads api on entering the website
window.addEventListener("DOMContentLoaded", fetchData);

// ----- FUNCTIONS -----

// --- ON START ---

// gets data from the api
async function fetchData() {

    //sets page to show pikachu
    getJSON();

    // trys to get the data from api
    try {

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

// gets pikachu JSON file then displays pikachu's data
const getJSON = async function() {

    try {

        // get response
        const response = await fetch("/JSON/pikachu.json")

        // check response
        if (!response.ok) {

            throw new Error("response status =",response.status); 

        };

        // get pikachu data from JSON
        pokemonData = await response.json();

        // displays pikachu on the page
        populateUI();

    }

    // if there is an error getting the json
    catch(err) {

        console.error(err)
    
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

// --- Main content ---

// on button click
document.getElementById("container__inputBox__inputs__button").addEventListener("click", function() {

    // checks if you entered a valid pokemon name
    inputValue = document.getElementById("container__inputBox__inputs__text").value.toLowerCase();

    // finds the pokemon entered
    findPokemon(inputValue);

});

// on textbox enter
document.getElementById("container__inputBox__inputs__text").addEventListener("keydown", function(e) {

    // enter key is pressed
    if (e.key == "Enter") {

        // checks if you entered a valid pokemon name
        inputValue = document.getElementById("container__inputBox__inputs__text").value.toLowerCase();

        // finds the pokemone entered
        findPokemon(inputValue);

    };

});

// finds if the pokemon entered is valid
const findPokemon = function(inputValue) {

    // sets found to false
    let foundPokemon = false

    // for number of pokemon
    for (let i = 0; i < apiData.results.length; i++) {

        // check if input is a real pokemon
        if (inputValue == apiData.results[i].name) {

            // if match is found
            foundPokemon = true;
            currentPokemon = apiData.results[i].name;
            document.getElementById("container__inputBox__inputs__text").value = "";
            fetchPokemonURL();

        };

    };

};

// gets the url of the specific pokemon user enters
const fetchPokemonURL = async function() {

    // trys to get the data from specific pokemon
    try {

        // species data

        // get response
        const response = await fetch(`${apiURL}/${currentPokemon}`);

        // check response
        if (!response.ok) {

            throw new Error("response status =",response.status);

        };

        // load data
        pokemonData = await response.json();

        // displays the pokemon on the page
        populateUI();

    }

    // if there is an error getting the api
    catch(err) {

        console.error(err);

    };

};

// displays pokemon info on the page
const populateUI = function() {

    // infobox image

    // gets pokemon ID as string
    pokemonID = pokemonData.id.toString();
    
    // adds 0s to fit image format
    for (i = (3 - pokemonID.length); i > 0; i--) {

       pokemonID = "0" + pokemonID;

    };

    // display image
    document.getElementById("container__infoBox__image__img").src = `https://www.serebii.net/pokemon/art/${pokemonID}.png`;

    // infobox text
    document.getElementById("container__infoBox__text").innerHTML = `${pokemonData.name} - ${pokemonData.types[0].type.name}`;

    // infobox 2nd type
    if (pokemonData.types.length == 2) {

        document.getElementById("container__infoBox__text").innerHTML += ` / ${pokemonData.types[1].type.name}`;

    };

    // get pokemon stats
    let pokemonStats = []
    let pokemonStatsTotal = 0;

    // get each stat
    for (i = 0; i <= 5; i++) {

        pokemonStats[i] = pokemonData.stats[i].base_stat;
        pokemonStatsTotal += pokemonData.stats[i].base_stat;

    };

    highestStat = Math.max(...pokemonStats)

    // save total stats
    pokemonStats[6] = pokemonStatsTotal;

    // sets the bar to use pokemon's stats
    setBarChart(pokemonStats, highestStat);

};

// displays stats on the bar chart
setBarChart = function(pokemonStats, highestStat) {

    // barchart elements
    const barChartBars = document.querySelectorAll(".container__statsBox__graphBox__statBox__barBox__bar");
    const barChartBarsP = document.querySelectorAll(".container__statsBox__graphBox__statBox__barBox__bar p");

    // for stats (not total)
    for (i = 0; i <= 5; i++) {

        //calculate bar width and display stat numeber
        barChartBars[i].style.width = `${(100/highestStat)*pokemonStats[i]}%`;
        barChartBarsP[i].innerHTML = pokemonStats[i];

    };

    // total bar
    let totalWidth = pokemonStats[6]

    // ensure it dosent exceed 100%
    if (totalWidth > 600) {

        totalWidth = 600;

    }

    // set to a percentage of 600;
    totalWidth = totalWidth / 6

    barChartBars[6].style.width = `${totalWidth}%`;
    barChartBarsP[6].innerHTML = pokemonStats[6];

};

