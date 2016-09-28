"use strict";

/* Classes */
const Game = require('./game');

/* Global variables */
var canvas = document.getElementById('screen');
var game = new Game(canvas, update, render);
var image = new Image();
image.src = 'assets/pipes.png';

// Array of pipes to use and the board they will be placed on
var pipes = [];

var startPipes = [];

// The cross pipe
var cross = { x: 0, y: 0, width: 32, height: 32 };
pipes.push(cross);

// Array holding the different rotations of elbo pipes
var elbos = [
    { x: 31, y: 31, width: 32, height: 32 },
    { x: 62, y: 31, width: 32, height: 32 },
    { x: 32, y: 64, width: 32, height: 32 },
    { x: 64, y: 64, width: 32, height: 32 }
];
elbos.forEach(function(elbo){
    pipes.push(elbo);
    //startPipes(elbo);
});

// Array holding the different rotations of T pipes
var tees = [
    { x: 32, y: 96, width: 32, height: 32 },
    { x: 64, y: 96, width: 32, height: 32 },
    { x: 32, y: 128, width: 32, height: 32 },
    { x: 64, y: 128, width: 32, height: 32 }
];
tees.forEach(function(tee){
    pipes.push(tee);
});

// Array holding the different rotations of short straight pipes
var shorts = [
    { x: 96, y: 32, width: 32, height: 32 },
    { x: 90, y: 64, width: 32, height: 32 }
];
pipes.push(shorts[0]);
pipes.push(shorts[1]);

// Array holding the different rotations of long straight pipes
var longs = [
    { x: 30, y: 0, width: 97, height: 32 },
    { x: 0, y: 31, width: 30, height: 97 }
];
pipes.push(longs[0]);
pipes.push(longs[1]);

// Array of pipes and empty grides to start the game, length of 156 blocks
var board = new Array(156);
/*
while (pipes.length > 0) {
    var index = Math.floor(Math.random() * (pipes.length - 1));
    board.push({ pipes: pipes[index]});
    pipes.splice(index, 1);
}
*/

//var nextPipe = pipes[Math.floor(Math.random() * (pipes.length - 1))];
var i = 0;
var nextPipe = pipes[i];

// Set up board with 2 random pipes a starting pipe and ending pipe
var startPipe = Math.floor(Math.random() * (pipes.length - 1));
var endPipe = Math.floor(Math.random() * (pipes.length - 1));
var startIndex = Math.floor(Math.random() * (board.length - 1));
var endIndex = Math.floor(Math.random() * (board.length - 1));

board[startIndex] = pipes[startPipe];
board[endIndex] = pipes[endPipe];
/*
board.push({ pipe: pipes[startPipe], index: startIndex });
board.push({ pipe: pipes[endIndex], index: endIndex });
*/

canvas.onclick = function(event) {
    event.preventDefault();
    // TODO: Place or rotate pipe tile
    switch (event.which) {
        case 1:
            // Left mouse click
            // Place pipe tile
            /*
                x = mouse.x/64
                y = mouse.y/64
                board[y * 14 - x] = nextPipe
            */
            if(i < pipes.length){
                nextPipe = pipes[i];
                i++;
            }
            else{
                i = 0;
            }

            break;
        case 3:
            // Right mouse click
            // Rotate the pipe tile
            break;
    }
}

/**
 * @function masterLoop
 * Advances the game in sync with the refresh rate of the screen
 * @param {DOMHighResTimeStamp} timestamp the current time
 */
var masterLoop = function(timestamp) {
  game.loop(timestamp);
  window.requestAnimationFrame(masterLoop);
}
masterLoop(performance.now());


/**
 * @function update
 * Updates the game state, moving
 * game objects and handling interactions
 * between them.
 * @param {DOMHighResTimeStamp} elapsedTime indicates
 * the number of milliseconds passed since the last frame.
 */
function update(elapsedTime) {
   // nextPipe = pipes[Math.floor(Math.random() * (pipes.length - 1))];
  // TODO: Advance the fluid
}

/**
  * @function render
  * Renders the current game state into a back buffer.
  * @param {DOMHighResTimeStamp} elapsedTime indicates
  * the number of milliseconds passed since the last frame.
  * @param {CanvasRenderingContext2D} ctx the context to render to
  */
function render(elapsedTime, ctx) {
    ctx.fillStyle = "#777777";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(image,
        // Source rect
        nextPipe.x, nextPipe.y, nextPipe.width, nextPipe.height,
        // Dest rect
        0, 100, 64, 64
    );

    // TODO: Render the board
    for (var y = 0; y < 12; y++) {
        for (var x = 1; x < 14; x++) {
            //var i = y * 6 + x;
            var pipe = board[y * 14 + x];
            if(pipe){
                ctx.drawImage(image,
                    // Source rect
                    pipe.x, pipe.y, pipe.width, pipe.height,
                    // Dest rect
                    x * 69 + 20, y * 69 + 20, 64, 64
                );
            }
            else{
                // draw the back of the card (160x160px)
                ctx.fillStyle = "#3333ff";
                // 165 allows 2px of space between each card
                ctx.fillRect(x * 69 + 20, y * 69 + 20, 64, 64);
            }
        }
    }

}
