let candidatePokemon = [];
let difficulty = 0;
let difficultyMap = [{cards:3, time:120}, {cards:6, time:90}, {cards:12, time:60}];
var timer, pairManager;
var clickCount = 0;
var poweredUp = false;

const setup = async () => {
    let fetch = await axios.get('https://pokeapi.co/api/v2/pokemon?offset=0&limit=493');
    candidatePokemon = fetch.data.results;
}

function initHeadsUp(timeLimit){
    clickCount = 0;
    $('#clickCounter').empty().append(`Total Clicks: ${clickCount}`);
    clearInterval(timer);
    var startTime = Date.now();
    var timeElapsed = 0;
    $('#timer').empty().append(`<h1> 0 / ${timeLimit}s Remaining</h1>`);
    timer = setInterval(() => {
        timeElapsed = (Date.now() - startTime) / 1000;
        $('#timer').empty().append(`<h1>${Math.floor(timeElapsed)} / ${timeLimit}s Remaining</h1>`);
        if (timeElapsed >= timeLimit){
            alert('Game Over!');
            resetGame();
        }
        var timeRemaining = timeLimit - timeElapsed;
        if (timeRemaining > 14 && timeRemaining <= 15){
            powerUp();
        }
    }, 1000)
}

async function start(){
    var cardNum = difficultyMap[difficulty].cards;
    var pairsMatched = 0;
    var timeLimit = difficultyMap[difficulty].time;
    var pokemon = [];
    for (var i = 0; i < cardNum; i++){
        var index = Math.floor((Math.random() * candidatePokemon.length));
        pokemon.push(candidatePokemon[index]);
        pokemon.push(candidatePokemon[index]);
    }
    await loadCards(pokemon);
    initHeadsUp(timeLimit);

    pairManager = setInterval(() => {
        var html = `
            <div>Total # of Pairs: ${cardNum}</div>
            <div>Pairs Matched: ${pairsMatched}</div>
            <div>Pairs Remaining: ${cardNum - pairsMatched}</div>`
        $('#pairStats').empty().append(html);
        if (pairsMatched >= cardNum){
            alert('You Won!');
            resetGame();
        }
    }, 100) 
    
    let firstCard = undefined;
    let secondCard = undefined;
    var inProgress = false;
    $('.card').on('click', function() {
        if (poweredUp) {return;}
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
                $(`#${firstCard.id}`).parent().css({'background-color': 'green'});
                $(`#${secondCard.id}`).parent().off("click");
                $(`#${secondCard.id}`).parent().css({'background-color': 'green'});
                firstCard = undefined;
                secondCard = undefined;
                pairsMatched++;
            } else {
                inProgress = true;
                $(`#${firstCard.id}`).parent().css({'background-color': 'red'});
                $(`#${secondCard.id}`).parent().css({'background-color': 'red'});
                setTimeout(() => {
                    $(`#${firstCard.id}`).parent().toggleClass("flip");
                    $(`#${secondCard.id}`).parent().toggleClass("flip");
                    $(`#${secondCard.id}`).parent().css({'background-color': 'white'});
                    $(`#${firstCard.id}`).parent().css({'background-color': 'white'});
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

$('#reset').on('click', resetGame);

function resetGame(){
    console.log('reset')
    clearInterval(timer);
    clearInterval(pairManager);
    $('#headsup').children().empty();
    $('#gamespace').empty();
}


$('#gamespace').on('click', () => {
    clickCount++;
    $('#clickCounter').empty().append(`Total Clicks: ${clickCount}`);
})

$('#darkmode').on('click', () => {
    $('body').css({'background-color': 'darkslategray', 'color': 'white'});
    $('button').toggleClass('btn-dark btn-light');
})

$('#lightmode').on('click', () => {
    $('body').css({'background-color': 'white', 'color': 'black'});
    $('button').toggleClass('btn-dark btn-light');
})

function powerUp(){
    if (!poweredUp) {
        poweredUp = true;
        $('#gamespace').find('.card:not(.flip)').toggleClass('powered-up flip');
        setTimeout(() => {
            $('#gamespace').find('.powered-up').toggleClass('powered-up flip');
            poweredUp = false;
        }, 1000)
    }
}

$(document).ready(setup)
