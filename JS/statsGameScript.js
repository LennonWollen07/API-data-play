// ----- SETUP -----

// --- API / API data ---
const apiPokemonURL = "https://pokeapi.co/api/v2/pokemon";
const apiSpeciesURL = "https://pokeapi.co/api/v2/pokemon-species";
let apiData = [];

// loads api on entering the website
window.addEventListener("DOMContentLoaded", initialise);

// variables
let gameMode = "HP";
let score = 0;
let answerClicked = false;
let PokemonData = [];
let pokemonStats = [];

// ----- FUNCTIONS -----

// --- ON START ---

// gets both api links, enables links, and gets 2 pokemon for the game
async function initialise() {

    // fetches the pokemon URL
    await fetchData(apiPokemonURL, 0);

    // fetches the pokemon species url
    await fetchData(apiSpeciesURL, 1);

    // enable the links in the header
    await enableLinks();

    //initilize the pokemon being used for the game
    await switchPokemon();

};

// 
const fetchData = async function(API, num) {

    // trys to get the data from api
    try {

        // get response
        const response = await fetch(`${API}?limit=10000`);

        // check response
        if (!response.ok) {

            throw new Error("response status =",response.status); 

        };

        // load data
        apiData[num] = await response.json();

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

// gets 2 pokemon for the game
const getPokemon = async function() {

    // while array holding pokemon data does not have 2 pokemon
    while (PokemonData.length < 2) {

        // gets a number between 1 and 1025
        let ID = Math.floor(Math.random() * (apiData[1].count - 1) + 1).toString()

        // tries to reach the api
        try {

            // get response
            response = await fetch(`${apiPokemonURL}/${ID}`)

            // checks if response is ok
            if (!response.ok) {

                throw new Error("response status =",response.status);

            };

            // put current pokemon in an array
            const currentPokemon = await response.json();
            PokemonData[PokemonData.length] = currentPokemon;

        }

        catch(err) {

            console.error(err);

        };

    };

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

        switchPokemon();

        // change text in the columns
        document.querySelectorAll(".container__gameSpace__column__stat").forEach(text => {

            text.innerHTML = `${gameMode} - ?`

        })

        // reset score
        score = 0;
        document.getElementById("container__points__score").innerHTML = `Points: ${score}`

        // change question at the bottom
        document.getElementById("container__bottom__text").innerHTML = `Who has a higher ${gameMode} stat?`

    });

});

// switch the pokemon currently being used for the game
const switchPokemon = async function() {

    // has a valid pair been found
    pokemonFound = false;

    
    while(!pokemonFound) {

        // reset pokemon data
        PokemonData = [];

        // get the 2 pokemon
        await getPokemon();

        // find the pokemon's stats
        findUsedStat();
        
        // a valid pair has been found
        pokemonFound = true

    };

    //changes each pokemon image
    document.querySelectorAll(".container__gameSpace__column__image__img").forEach((image, i) => {

        // finds the pokemon's id
        let pokemonID = PokemonData[i].id.toString();
    
        // adds 0s to fit image format
        for (let j = (3 - pokemonID.length); j > 0; j--) {

            pokemonID = "0" + pokemonID;

        };

        // changes image
        image.src = `https://www.serebii.net/pokemon/art/${pokemonID}.png`

    });

    // change the name
    document.querySelectorAll(".container__gameSpace__column__name").forEach((text, i) => {

        text.innerHTML = PokemonData[i].name;

    });

};

// finds the number of the stat being currently used
const findUsedStat = function() {

    // if the game mode is not total
    if (gameMode !== "TOTAL") {

        // defining variables to help find what stat we are using
        const statsTypes = ["HP","ATK","DEF","S.ATK","S.DEF","SPD"];
        let index = 0

        // iterate through each stat
        for (i = 0; i <= 5; i++) {

            // find the index of the stat we are using 
            if (statsTypes[i] == gameMode) {

                // set the index to the loop number
                index = i;

            };

        };

        // add the stats to an array
        for (let i = 0; i < 2; i++) {

            // reset old stat
            pokemonStats[i] = 0

            // add new stat
            pokemonStats[i] = PokemonData[i].stats[index].base_stat;

        };

    }

    // if game mode is total
    else {

        // loop twice for each pokemon
        for (let i = 0; i < 2; i++) {

            // resst old stat
            pokemonStats[i] = 0

            // for number of stats
            for (let j = 0; j < 6; j++) {

                // add all stats together
                pokemonStats[i] += PokemonData[i].stats[j].base_stat;

            };

        };

    };

    // if both pokemon have the same stats reswitch
    if (pokemonStats[0] == pokemonStats[1]) {

        switchPokemon();

    }

};

// when image is clicked check if the right image was clicked
document.querySelectorAll(".container__gameSpace__column__image__img").forEach((image, i) => {

    image.addEventListener("click", () => {

        // stops users from clicking before new pair is loaded
        if (answerClicked) {

            return;

        };

        // displays answer info
        displayAnswerInfo(image, i);

        // wait 4 seconds before next game
        setTimeout(() => {

            // remove colour classes
            image.classList.remove("U-correct");
            image.classList.remove("U-incorrect");

            // change the name
            document.querySelectorAll(".container__gameSpace__column__stat").forEach((text) => {

                text.innerHTML = `${gameMode} - ?`;

            });

            // reset if images can be clicked
            answerClicked = false;

            // switch pokemon
            switchPokemon();
        
        }, 4000);

    });

});

// displays answer info after setting it up
displayAnswerInfo = function(image, i) {

    //find correct answer
    let isCorrect = false;

    // checks the clicked pokemon against the non-clicked to see if clicked is higher
    if (pokemonStats[i] > pokemonStats[(i + 1) % 2]) {

        isCorrect = true;

    };

    // if correct answer is clicked
    if (isCorrect) {

        // add score
        score++;
        document.getElementById("container__points__score").innerHTML = `Points: ${score}`;

        // show image clicked on was correct
        image.classList.add("U-correct");

    }

    // if wrong answer is clicked 
    else {

        // subtract score
        score--;
        document.getElementById("container__points__score").innerHTML = `Points: ${score}`;

        // show image clicked on was incorrect
        image.classList.add("U-incorrect");

    };

    // stops answers from being clicked on multiple times
    answerClicked = true;

    // displays pokemon stats
    document.querySelectorAll(".container__gameSpace__column__stat").forEach((text, j) => {

        text.innerHTML = `${gameMode} - ${pokemonStats[j]}`;

    });

};