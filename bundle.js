(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
var cross = { x: 0, y: 0, width: 32, height: 32 };
pipes.push(cross);

// Array holding the different rotations of elbo pipes
var elbos = [
    { x: 32, y: 32, width: 32, height: 32 },
    { x: 64, y: 32, width: 32, height: 32 },
    { x: 32, y: 64, width: 32, height: 32 },
    { x: 64, y: 64, width: 32, height: 32 }
];
elbos.forEach(function(elbo){
    pipes.push(elbos);
});

// Array holding the different rotations of T pipes
var tees = [
    { x: 32, y: 96, width: 32, height: 32 },
    { x: 64, y: 96, width: 32, height: 32 },
    { x: 32, y: 128, width: 32, height: 32 },
    { x: 64, y: 128, width: 32, height: 32 }
];
tees.forEach(function(tee){
    pipes.push(tees);
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
    { x: 32, y: 0, width: 30, height: 96 },
    { x: 0, y: 32, width: 30, height: 96 }
];
pipes.push(longs[0]);
pipes.push(longs[1]);

// Array of pipes and empty grides to start the game, length of 25 blocks
var board = [];
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


canvas.onclick = function(event) {
    event.preventDefault();
    // TODO: Place or rotate pipe tile
    switch (event.which) {
        case 1:
            // Left mouse click
            // Place pipe tile
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
            // draw the back of the card (160x160px)
            ctx.fillStyle = "#3333ff";
            // 165 allows 2px of space between each card
            ctx.fillRect(x * 69 + 20, y * 69 + 20, 64, 64);
        }
    }

}

},{"./game":2}],2:[function(require,module,exports){
"use strict";

/**
 * @module exports the Game class
 */
module.exports = exports = Game;

/**
 * @constructor Game
 * Creates a new game object
 * @param {canvasDOMElement} screen canvas object to draw into
 * @param {function} updateFunction function to update the game
 * @param {function} renderFunction function to render the game
 */
function Game(screen, updateFunction, renderFunction) {
  this.update = updateFunction;
  this.render = renderFunction;

  // Set up buffers
  this.frontBuffer = screen;
  this.frontCtx = screen.getContext('2d');
  this.backBuffer = document.createElement('canvas');
  this.backBuffer.width = screen.width;
  this.backBuffer.height = screen.height;
  this.backCtx = this.backBuffer.getContext('2d');

  // Start the game loop
  this.oldTime = performance.now();
  this.paused = false;
}

/**
 * @function pause
 * Pause or unpause the game
 * @param {bool} pause true to pause, false to start
 */
Game.prototype.pause = function(flag) {
  this.paused = (flag == true);
}

/**
 * @function loop
 * The main game loop.
 * @param{time} the current time as a DOMHighResTimeStamp
 */
Game.prototype.loop = function(newTime) {
  var game = this;
  var elapsedTime = newTime - this.oldTime;
  this.oldTime = newTime;

  if(!this.paused) this.update(elapsedTime);
  this.render(elapsedTime, this.frontCtx);

  // Flip the back buffer
  this.frontCtx.drawImage(this.backBuffer, 0, 0);
}

},{}]},{},[1]);
