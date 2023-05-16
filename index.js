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
