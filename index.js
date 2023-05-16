let candidatePokemon = [];
let difficulty = 0;
let difficultyMap = [{cards:3, time:120}, {cards:6, time:90}, {cards:12, time:60}];

const setup = async () => {
    let fetch = await axios.get('https://pokeapi.co/api/v2/pokemon?offset=0&limit=493');
    candidatePokemon = fetch.data.results;
}

async function start(){
    var cardNum = difficultyMap[difficulty].cards;
    var timeLimit = difficultyMap[difficulty].time;
    var pokemon = [];
    for (var i = 0; i < cardNum; i++){
        var index = Math.floor((Math.random() * candidatePokemon.length));
        pokemon.push(candidatePokemon[index]);
        pokemon.push(candidatePokemon[index]);
    }
    await loadCards(pokemon);
    const date = new Date;
    var startTime = Date.now();
    var timeElapsed;
    $('#timer').empty().append(`<h1> 0 / ${timeLimit}s Remaining</h1>`);
    setInterval(() => {
        timeElapsed = (Date.now() - startTime) / 1000;
        $('#timer').empty().append(`<h1>${Math.floor(timeElapsed)} / ${timeLimit}s Remaining</h1>`);
        if (timeElapsed >= timeLimit){
            alert('Game Over!');
        }
    }, 1000)

    let firstCard = undefined;
    let secondCard = undefined;
    var inProgress = false;
    $('.card').on('click', function() {
        if (firstCard == undefined){
            firstCard = $(this).find(".front")[0];
            $(this).toggleClass('flip');
        } else if (secondCard == undefined && $(this).find(".front")[0] != firstCard){
            secondCard = $(this).find(".front")[0];
            $(this).toggleClass('flip');
        }
        if (firstCard && secondCard && !inProgress){
            if (firstCard.src == secondCard.src){
                $(`#${firstCard.id}`).parent().off("click");
                $(`#${secondCard.id}`).parent().off("click");
                firstCard = undefined;
                secondCard = undefined;
            } else {
                inProgress = true;
                setTimeout(() => {
                    $(`#${firstCard.id}`).parent().toggleClass("flip");
                    $(`#${secondCard.id}`).parent().toggleClass("flip");
                    firstCard = undefined;
                    secondCard = undefined;
                    inProgress = false;
                }, 1000)
            }
        }
    })
}

async function loadCards(pokemon){
    $('#gamespace').empty();
    while (pokemon.length != 0){
        var i = Math.floor((Math.random() * pokemon.length));
        var givenPokemon = await axios.get(pokemon[i].url);
        var card = `<div class="card">
                        <img src="${givenPokemon.data.sprites.front_default}" class="front" id="${givenPokemon.data.name + pokemon.length}">
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
