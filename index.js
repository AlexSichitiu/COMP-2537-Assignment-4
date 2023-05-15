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

async function start(){
    var cardNum = difficultyMap[difficulty];
    var pokemon = [];
    for (var i = 0; i < cardNum; i++){
        var index = Math.floor((Math.random() * candidatePokemon.length));
        pokemon.push(candidatePokemon[index]);
    }
    await loadCards(pokemon);

    $('.card').on('click', function() {
        $(this).toggleClass('flip');
    })
}

async function loadCards(pokemon){
    $('#gamespace').empty();
    for (var i = 0; i < pokemon.length; i++){
        var givenPokemon = await axios.get(pokemon[i].url);
        var card = `<div class="card" name="${givenPokemon.data.name}">
                        <img src="${givenPokemon.data.sprites.front_default}" class="front">
                        <img src="Poke_Ball.webp" class="back">
                    </div>`
        $('#gamespace').append(card);
    }
}

$('#easy').on('click', function() {
    difficulty = 0;
})

$('#medium').on('click', function() {
    difficulty = 1;
})

$('#hard').on('click', function() {
    difficulty = 2;
})


$(document).ready(setup)
