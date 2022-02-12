var highScore = window.localStorage.getItem('score');
var marray = ['~','!','@','#','$','%','^','&','*','(',')','-','~','!','@','#','$','%','^','&','*','(',')','-'];
var shuffled_array = [];
var tiles_flipped = 0;
var flipped_values = [];
var flipped_values_id = [];
const maxTime = 300;
const maxMoves = 300;

function shuffle(array){
    let copy = [], n = array.length;

    while(n){
        let i = Math.floor(Math.random()*array.length);
        copy.push(array[i]);
        array.splice(i, 1);
        n--;
    }
    return copy;
}

function resetHighScore(){
    window.localStorage.setItem('score', 0);
    window.location.reload();
}

function insertScore(){
    if(!Number.isInteger(parseInt(highScore))){
        highScore = '0';
    }
    let node = document.createTextNode(highScore);
    document.getElementById('score').appendChild(node);
}

function gameLostMovesOver(){
    alert("You have lost. Moves over.");
    window.location.reload();
}

function gameLostTimeUp(){
    alert("You have lost. Time's up!");
    window.location.reload();
}

function gameWon(score){
    let prevHighScore = parseInt(highScore);
    if(score > prevHighScore){
        window.localStorage.setItem('score', score);
    }
    alert("You have won! Score:" + score);
    window.location.reload();
}

function scoring(m, t){
    const f = 0.5;
    let newScore = (1 - t/maxTime)*f + (1 - m/maxMoves)*(1-f);
    newScore *= 1000;
    newScore = Math.round(newScore);
    return newScore;
}

function time(){
    let currTime = parseInt(document.getElementById('time').innerHTML);
    if(currTime == 0){
        gameLostTimeUp();
    }
    document.getElementById('time').innerHTML = currTime - 1;
}

function newGame(){
    document.getElementById("start").style.display = "none";

    document.getElementById("memory").style.display = "block";
    document.getElementById("timer").style.display = "block";

    document.getElementById("moves").innerHTML = 0;
    document.getElementById("time").innerHTML = maxTime;

    shuffled_array = shuffle(marray);
    console.log(shuffled_array.length);

    setInterval(time, 1000);

    let insert = '';
    for(let i = 0; i < shuffled_array.length; i++){
        insert += `<div id="tile_${i}" onclick="flipTile(this, '${shuffled_array[i]}')"></div>`;
    }
    document.getElementById('memory').innerHTML = insert;
}

function flipTile(tile, val){
    if(tile.innerHTML == "" && flipped_values.length < 2){
        let currMoves = parseInt(document.getElementById("moves").innerHTML);
        document.getElementById("moves").innerHTML = currMoves + 1;
        tile.style.background = 'white';
        tile.innerHTML = val;
        if(flipped_values.length == 0){
            flipped_values.push(val);
            flipped_values_id.push(tile.id);
        }
        else if(flipped_values.length == 1){
            flipped_values.push(val);
            flipped_values_id.push(tile.id);

            if(flipped_values[0] == flipped_values[1]){
                tiles_flipped += 2;
                flipped_values = [];
                flipped_values_id = [];

            }
            else{
                function flipBack(){
                    document.getElementById(flipped_values_id[0]).style.background = 'url(assets/q.jpg) no-repeat center';
                    document.getElementById(flipped_values_id[1]).style.background = 'url(assets/q.jpg) no-repeat center';
                    document.getElementById(flipped_values_id[0]).innerHTML = "";
                    document.getElementById(flipped_values_id[1]).innerHTML = "";
                    document.getElementById(flipped_values_id[0]).style.backgroundSize = "contain";
                    document.getElementById(flipped_values_id[1]).style.backgroundSize = "contain";

                    flipped_values = [];
                    flipped_values_id = [];
                }
                setTimeout(flipBack, 1000);
            }

            if(tiles_flipped == shuffled_array.length){
                let time = parseInt(document.getElementById('time').innerHTML);
                let score = scoring(currMoves+1, time);
                gameWon(score);
            }
            else if(currMoves+1 == maxMoves){
                gameLostMovesOver();
            }
        }
    }
}
