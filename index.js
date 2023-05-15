let candidatePokemon = [];
let difficulty = 0;
let difficultyMap = [6, 12, 24];

const setup = async () => {
    let fetch = await axios.get('https://pokeapi.co/api/v2/pokemon?offset=0&limit=810');
    candidatePokemon = fetch.data.results;
}

function start(){
    var cardNum = difficultyMap[difficulty];
    var pokemon = [];
    for (var i = 0; i < cardNum; i++){
        var index = Math.floor((Math.random() * candidatePokemon.length));
        pokemon.push(candidatePokemon[index]);
        console.log(candidatePokemon[index]);
    }
}

$('#easy').on('click', () => {
    difficulty = 0;
})

$('#medium').on('click', () => {
    difficulty = 1;
})

$('#hard').on('click', () => {
    difficulty = 2;
})

$('#start').on('click', () => {
    start();
})

$(document).ready(setup)
