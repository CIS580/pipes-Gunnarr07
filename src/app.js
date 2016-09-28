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

// The cross pipe
var cross = [{ x: 0, y: 0, width: 32, height: 32 }];
pipes.push(cross);

// Array holding the different rotations of elbo pipes
var elbos = [
    { x: 32, y: 32, width: 32, height: 32 },
    { x: 64, y: 32, width: 32, height: 32 },
    { x: 32, y: 64, width: 32, height: 32 },
    { x: 64, y: 64, width: 32, height: 32 }
];
pipes.push(elbos);

// Array holding the different rotations of T pipes
var tees = [
    { x: 32, y: 96, width: 32, height: 32 },
    { x: 64, y: 96, width: 32, height: 32 },
    { x: 32, y: 128, width: 32, height: 32 },
    { x: 64, y: 128, width: 32, height: 32 }
];
pipes.push(tees);

// Array holding the different rotations of short straight pipes
var shorts = [
    { x: 96, y: 32, width: 32, height: 32 },
    { x: 90, y: 64, width: 32, height: 32 }
];
pipes.push(shorts);

// Array holding the different rotations of long straight pipes
var longs = [
    { x: 32, y: 0, width: 32, height: 96 },
    { x: 0, y: 32, width: 32, height: 96 }
];
pipes.push(longs);

// Array of pipes and empty grides to start the game
var board = [];


// Set up board with 2 random pipes a starting pipe and ending pipe
var startPipe = Math.floor(Math.random() * (pipes.length - 1));
var endPipe = Math.floor(Math.random() * (pipes.length - 1));


canvas.onclick = function(event) {
    event.preventDefault();
    // TODO: Place or rotate pipe tile
    switch (event.which) {
        case 1:
            // Left mouse click
            // Place pipe tile
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

    // TODO: Render the board
  for (var y = 0; y < 5; y++) {
      for (var x = 0; x < 6; x++) {
          //var i = y * 6 + x;
          // draw the back of the card (160x160px)
          ctx.fillStyle = "#3333ff";
          // 165 allows 2px of space between each card
          ctx.fillRect(x * 165 + 20, y * 165 + 20, 160, 160);
      }
  }
}
