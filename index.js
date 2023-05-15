let candidatePokemon = [];
let difficulty = 0;
let difficultyMap = [3, 6, 12];

const setup = async () => {
    let fetch = await axios.get('https://pokeapi.co/api/v2/pokemon?offset=0&limit=493');
    candidatePokemon = fetch.data.results;


}

async function start(){
    var cardNum = difficultyMap[difficulty];
    var pokemon = [];
    for (var i = 0; i < cardNum; i++){
        var index = Math.floor((Math.random() * candidatePokemon.length));
        pokemon.push(candidatePokemon[index]);
        pokemon.push(candidatePokemon[index]);
    }
    await loadCards(pokemon);

    var firstCard = null, secondCard = null;
    $('.card').on('click', function() {
        $(this).toggleClass('flip');
        firstCard == null ? firstCard = $(this).find(".front") : secondCard = $(this).find(".front");
        if (firstCard && secondCard){
            if (firstCard.src == secondCard.src){
                console.log('match');
                $(`#${firstCard.name}`).parent().off("click");
                $(`#${secondCard.name}`).parent().off("click");
            } else {
                console.log('mismatch');
                $(`#${firstCard.name}`).toggleClass('flip');
                $(`#${secondCard.name}`).toggleClass('flip');
            }
            firstCard = null;
            secondCard = null;
        }
    })
}

async function loadCards(pokemon){
    $('#gamespace').empty();
    while (pokemon.length != 0){
        var i = Math.floor((Math.random() * pokemon.length));
        var givenPokemon = await axios.get(pokemon[i].url);
        var card = `<div class="card" name="${givenPokemon.data.name}">
                        <img src="${givenPokemon.data.sprites.front_default}" class="front">
                        <img src="Poke_Ball.webp" class="back">
                    </div>`
        $('#gamespace').append(card);
        pokemon.splice(i, 1);
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

$('#start').on('click', () => {
    start();
})

$(document).ready(setup)
