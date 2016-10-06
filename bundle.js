(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

/* Classes */
const Game = require('./game');

/* Global variables */
var canvas = document.getElementById('screen');
var game = new Game(canvas, update, render);
var image = new Image();
image.src = 'assets/pipes.png';

var debug = true;

// If the next pip has been placed on the board
var placed = false; 
var state = "left click";
var waterW;
var waterH;

// Counter for rotating pipes
var counter = 0;

// Array of pipes to use and the board they will be placed on
var pipes = [];

var water = [];

var startPipes = [];

// The cross pipe
var cross = { x: 0, y: 0, width: 32, height: 32, type: "cross" };
pipes.push(cross);
pipes.push(cross);

// Array holding the different rotations of elbo pipes
var elbows = [
    { x: 31.5, y: 31.5, width: 32, height: 32, type: "elbow", rotation: 0 },
    { x: 63, y: 31.5, width: 32, height: 32, type: "elbow", rotation: 1 },
    { x: 31.5, y: 63, width: 32, height: 32, type: "elbow", rotation: 2 },
    { x: 63, y: 63, width: 32, height: 32, type: "elbow", rotation: 3 }
];
elbows.forEach(function(elbow){
    pipes.push(elbow);
    //startPipes(elbo);
});

// Array holding the different rotations of T pipes
var tees = [
    { x: 31.5, y: 94.5, width: 32, height: 32, type: "tee", rotation: 0 },
    { x: 63, y: 94.5, width: 32, height: 32, type: "tee", rotation: 1 },
    { x: 31.5, y: 126, width: 32, height: 32, type: "tee", rotation: 2 },
    { x: 63, y: 126, width: 32, height: 32, type: "tee", rotation: 3 }
];
tees.forEach(function(tee){
    pipes.push(tee);
});

// Array holding the different rotations of short straight pipes
var shorts = [
    { x: 94.5, y: 31.5, width: 32, height: 32, type: "short", rotation: 0 },
    { x: 94.5, y: 63, width: 32, height: 32, type: "short", rotation: 1 }
];
pipes.push(shorts[0]);
pipes.push(shorts[1]);
pipes.push(shorts[0]);
pipes.push(shorts[1]);

var i, j, temp;
for (i= pipes.length; i; i--) {
    j = Math.floor(Math.random() * i);
    temp = pipes[i - 1];
    pipes[i - 1] = pipes[j];
    pipes[j] = temp;
}

// Array holding the different rotations of long straight pipes
// var longs = [
//     { x: 30, y: 0, width: 97, height: 32, type: "long" },
//     { x: 0, y: 31, width: 30, height: 97, type: "long" }
// ];
// pipes.push(longs[0]);
// pipes.push(longs[1]);

// Array of pipes and empty grides to start the game, length of 156 blocks
var board = new Array(169);

var nextPipe = pipes[Math.floor(Math.random() * pipes.length)];

// Set up board with 2 random pipes a starting pipe and ending pipe
// var startPipe = Math.floor(Math.random() * (pipes.length - 1));
// var endPipe = Math.floor(Math.random() * (pipes.length - 1));
var startPipe = shorts[0];
var endPipe = shorts[0];
var startIndex = Math.floor(Math.random() * (board.length - 1));
var endIndex = Math.floor(Math.random() * (board.length - 1));

// board[startIndex] = pipes[startPipe];
// board[endIndex] = pipes[endPipe];
board[startIndex] = startPipe;
board[endIndex] = endPipe;

/*
board.push({ pipe: pipes[startPipe], index: startIndex });
board.push({ pipe: pipes[endIndex], index: endIndex });
*/

canvas.onclick = clickhandler;
function clickhandler(event) {
    event.preventDefault();
    // TODO: Place or rotate pipe tile
    var x = Math.floor((event.offsetX - 150) / 64);
    var y = Math.floor((event.offsetY - 20) / 64);
    // var pipe = board[y * 13 - x];
    //event.which 1=left, 3=right
    switch (event.which) {
        case 1:
            // Left mouse click
            // Place pipe tile
            if (!board[y * 13 + x]) {
                placed = true;
                board[y * 13 + x] = nextPipe;
                console.log("x: " + x + "y: " + y);
            }

            break;
        case 2:
            // Right mouse click
            // Rotate the pipe tile
            if (debug) {
                console.log("rotate pipe");
            }
            if(pipe.type == "elbow") {
                elbows.forEach(function(elbow){
                    pipe = elbow;
                });
            }
            break;
    }
}

canvas.oncontextmenu = function (event) {
    event.preventDefault();
    state = "right click";
    canvas.onclick = clickhandler;
    if (debug) {
        console.log("context menu event");
        console.log(state);
    }
    var x = Math.floor((event.offsetX - 150) / 64);
    var y = Math.floor((event.offsetY - 20) / 64);
    var pipe = board[y * 13 + x];
    if (pipe) {
        if(pipe.type == "elbow") {
            if (counter <= elbows.length - 1) {
                board[y * 13 + x] = elbows[counter];
                counter++;
                if (debug) {
                    console.log("counter: " + counter);
                }
            }
            else {
                counter = 0;
            }
        }
        else if (pipe.type == "tee") {
            if (counter <= tees.length - 1) {
                board[y * 13 + x] = tees[counter];
                counter++;
            }
            else{
                counter = 0;
            }
        }
        else if (pipe.type == "short") {
            if (counter <= shorts.length - 1) {
                board[y * 13 + x] = shorts[counter];
                if (debug) {
                    console.log("rotate short counter: " + counter);
                }
                counter++;
            }
            else{
                counter = 0;
            }
        }
    }
}

var currentIndex, currentX, currentY;
canvas.onmousemove = function(event) {
  event.preventDefault();
  currentX = event.offsetX;
  currentY = event.offsetY;
  var x = Math.floor((currentX - 150) / 64);
  var y = Math.floor((currentY - 20) / 64);
  currentIndex = y * 13 + x;
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
    // Check if pipe has been placed if so generate next random pipe
    if (placed) {
        nextPipe = pipes[Math.floor(Math.random() * pipes.length)];
        placed = false;
    }

    // TODO: Advance the fluid
    for (var y = 0; y < 13; y++) {
        for (var x = 0; x < 13; x++) {
            var pipe = board[y * 13 + x];
            if (pipe) {
                if (pipe.type == "elbow") {
                    if (pipe.rotation == 0) {

                    }
                    else if (pipe.rotation == 1) {

                    }
                    else if (pipe.rotation == 2) {

                    }
                    else if (pipe.rotation == 3) {

                    }
                }
                if (pipe.type == "tee") {
                    if (pipe.rotation == 0) {

                    }
                    else if (pipe.rotation == 1) {

                    }
                    else if (pipe.rotation == 2) {

                    }
                    else if (pipe.rotation == 3) {

                    }
                }
                if (pipe.type == "short") {
                    if (pipe.rotation == 0) {
                        
                    }
                    else if (pipe.rotation == 1) {

                    }
                }
            }
        }
    }
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
        15, 100, 64, 64
    );

    // TODO: Render the board
    for (var y = 0; y < 13; y++) {
        for (var x = 0; x < 13; x++) {
            ctx.strokeStyle = '#333333';
            ctx.strokeRect(x * 64 + 150, y * 64 + 20, 64, 64);
            var pipe = board[y * 13 + x];
            if(pipe){
                // render water
                ctx.fillStyle = "#3333ff";
                ctx.fillRect((x * 64 + 150), (y * 64 + 20) + 30, 30, 10);
                
                ctx.drawImage(image,
                    // Source rect
                    pipe.x, pipe.y, pipe.width, pipe.height,
                    // Dest rect
                    x * 64 + 150, y * 64 + 20, 64, 64
                );
            }
            else{
                // draw the back of the card (160x160px)
                 // ctx.fillStyle = "#3333ff";
                ctx.fillStyle = "grey";
                // 165 allows 2px of space between each card
                ctx.fillRect(x * 64 + 150, y * 64 + 20, 64, 64);
            }
        }
    }

    if(debug){
        var x = currentIndex % 13;
        var y = Math.floor(currentIndex / 13);

        ctx.fillStyle = "#ff0000";
        ctx.beginPath();
        ctx.arc(currentX, currentY, 3, 0, 2*Math.PI);
        ctx.rect(x * 64 + 150, y * 64 + 20, 64, 64);
        ctx.stroke();
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
