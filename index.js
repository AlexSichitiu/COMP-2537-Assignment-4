let candidatePokemon = [];
let difficulty = 0;
let difficultyMap = [6, 12, 24];

const setup = async () => {
    let fetch = await axios.get('https://pokeapi.co/api/v2/pokemon?offset=0&limit=493');
    candidatePokemon = fetch.data.results;

    $('#start').on('click', () => {
        start();
    })
}

function start(){
    var cardNum = difficultyMap[difficulty];
    var pokemon = [];
    for (var i = 0; i < cardNum; i++){
        var index = Math.floor((Math.random() * candidatePokemon.length));
        pokemon.push(candidatePokemon[index]);
    }
    loadCards(pokemon);
}

async function loadCards(pokemon){
    for (var i = 0; i < pokemon.length; i++){
        var givenPokemon = await axios.get(pokemon[i].url);
        var card = `<div class="card" style="width: 18rem;">
                        <img src="${givenPokemon.data.sprites.front_default}" class="front">
                        <img src="${givenPokemon.data.sprites.back_default}" class="back">
                    </div>`
        $('#gamespace').append(card);
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


$(document).ready(setup)
