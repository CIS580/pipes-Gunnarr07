(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

/* Classes */
const Game = require('./game');
const MS_PER_FRAME = 1000/1;

/* Global variables */
var canvas = document.getElementById('screen');
var game = new Game(canvas, update, render);
var image = new Image();
image.src = 'assets/pipes.png';

var placePipe = new Audio();
placePipe.src = 'assets/placePipe.wav';
var rotate = new Audio();
rotate.src = 'assets/rotate.wav';

var music = new Audio();
music.src = 'assets/8-bit Detective.wav'
// music.loop = true;
// music.play();

var debug = true;

// If the next pip has been placed on the board
var placed = false; 
var state = "left click";
var timer = 0;

// Counter for rotating pipes
var counter = 0;

// Array of pipes to use and the board they will be placed on
var pipes = [];

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

// Array of pipes and empty grides to start the game, length of 156 blocks
var board = new Array(169);
var waterPipe = [];

var nextPipe = pipes[Math.floor(Math.random() * pipes.length)];

var startPipe = shorts[0];
var endPipe = shorts[0];
var startIndex = Math.floor(Math.random() * (board.length - 1));
var endIndex = Math.floor(Math.random() * (board.length - 1));
var currIndex = startIndex;
var previousIndex;

board[startIndex] = { pipe: startPipe, index: startIndex, water: { startX: 0, startY: 30, width: 10, height: 10, filled: false, initalized: true } };
board[endIndex] = { pipe: endPipe, index: endIndex, water: { startX: 0, startY: 30, width: 0, height: 0, filled: false, initalized: false } };

canvas.onclick = clickhandler;
function clickhandler(event) {
    event.preventDefault();
    // TODO: Place or rotate pipe tile
    var x = Math.floor((event.offsetX - 150) / 64);
    var y = Math.floor((event.offsetY - 20) / 64);
    if (!board[y * 13 + x]) {
        placed = true;
        board[y * 13 + x] = {
            pipe: nextPipe,
            index: y * 13 + x,
            water: {
                startX: 0,
                startY: 0,
                width: 0,
                height: 0,
                filled: false,
                initalized: false
            }
        };
        placePipe.play();
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
    if (board[y * 13 + x] && !board[y * 13 + x].water.filled) {
        rotate.play();
        var pipe = board[y * 13 + x].pipe;
        if(pipe.type == "elbow") {
            if (counter <= elbows.length - 1) {
                board[y * 13 + x] = {
                    pipe: elbows[counter],
                    index: y * 13 + x,
                    water: {
                        startX: 0,
                        startY: 0,
                        width: 0,
                        height: 0,
                        filled: false,
                        initalized: false
                    }
                };
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
                board[y * 13 + x] = {
                    pipe: tees[counter],
                    index: y * 13 + x,
                    water: {
                        startX: 0,
                        startY: 0,
                        width: 0,
                        height: 0,
                        filled: false,
                        initalized: false
                    }
                };
                counter++;
            }
            else{
                counter = 0;
            }
        }
        else if (pipe.type == "short") {
            if (counter <= shorts.length - 1) {
                board[y * 13 + x] = {
                    pipe: shorts[counter],
                    index: y * 13 + x,
                    water: {
                        startX: 0,
                        startY: 0,
                        width: 0,
                        height: 0,
                        filled: false,
                        initalized: false
                    }
                };
                if (debug) {
                    console.log("rotate short, counter: " + counter);
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
            var index = y * 13 + x;
            //console.log("index: " + index);
            if (board[index]) {
                var pipe = board[index].pipe;
                var water = board[index].water;
                if (debug) {
                    //console.log("index: " + index);
                    //console.log("previousIndex: " + previousIndex);
                }
                timer += elapsedTime;
                if (index == currIndex && !water.filled && timer > MS_PER_FRAME) {
                    timer = 0;
                    //console.log("moving water");
                    if (pipe.type == "elbow") {
                        if (pipe.rotation == 0) {
                            if(!water.initalized) {
                                water.startX = 30;
                                water.width = 10;
                                water.height = 10;
                                water.initalized = true;
                            }
                            if (water.startX != 54 && !water.filled) {
                                water.startX++;
                                water.startY--;
                                //water.startX++;
                            }
                            else{
                                water.filled = true;
                            }
                        }
                        else if (pipe.rotation == 1) {
                            if(!water.initalized) {
                                water.startY = 30;
                                water.width = 10;
                                water.height = 10;
                                water.initalized = true;
                            }
                            if (water.startY != 54 && !water.filled) {
                                // water.width++;
                                // water.height++;
                                water.startX++;
                                water.startY++;
                            }
                            else{
                                water.filled = true;
                            }
                        }
                        else if (pipe.rotation == 2) {
                            if(!water.initalized) {
                                water.startX = 30;
                                water.width = 10;
                                water.height = 10;
                                water.initalized = true;
                            }
                            if (water.startY != 54 && !water.filled) {
                                //water.width++;
                                water.startX++;
                                water.startY++;
                            }
                            else{
                                water.filled = true;
                            }
                        }
                        else if (pipe.rotation == 3) {
                            if(!water.initalized) {
                                water.startX = 30;
                                water.width = 10;
                                water.height = 10;
                                water.initalized = true;
                            }
                            if (water.startY != 30 && !water.filled) {
                                water.startX--;
                                water.startY++;
                            }
                            else{
                                water.filled = true;
                            }
                        }
                    }
                    if (pipe.type == "tee") {
                        if (pipe.rotation == 0) {
                            if (water.width != 54 && !water.filled) {
                                water.width++;
                                water.startX++;
                            }
                            else{
                                water.filled = true;
                            }
                        }
                        else if (pipe.rotation == 1) {
                            if (water.width != 54 && !water.filled) {
                                water.width++;
                                water.startX++;
                            }
                            else{
                                water.filled = true;
                            }
                        }
                        else if (pipe.rotation == 2) {
                            if (water.width != 54 && !water.filled) {
                                water.width++;
                                water.startX++;
                            }
                            else{
                                water.filled = true;
                            }
                        }
                        else if (pipe.rotation == 3) {
                            if (water.width != 54 && !water.filled) {
                                water.width++;
                                water.startX++;
                            }
                            else{
                                water.filled = true;
                            }
                        }
                    }
                    if (pipe.type == "short") {
                        if (pipe.rotation == 0) {
                            if(!water.initalized) {
                                water.startY = 30;
                                water.width = 10;
                                water.height = 10;
                                water.initalized = true;
                            }
                            if (water.width != 54 && !water.filled) {
                                water.width++;
                            }
                            else{
                                water.filled = true;
                                console.log("pipe filled: ");
                            }
                        }
                        else if (pipe.rotation == 1) {
                            if(!water.initalized) {
                                water.startX = 30;
                                water.width = 10;
                                water.height = 10;
                                water.initalized = true;
                            }
                            if (water.height != 54 && !water.filled) {
                                water.height++;
                                //water.startY++;
                            }
                            else {
                                water.filled = true;
                            }
                        }
                    }
                }
                else if (index == currIndex && water.filled) {
                    var nextIndex;
                    if (x + 1 < 13) {
                        nextIndex = y * 13 + (x + 1);
                    }
                    else {
                        nextIndex = (y + 1) * 13 + 0;
                    }
                    
                    if (board[nextIndex]){
                        currIndex = nextIndex;
                        previousIndex = index;
                        console.log("next pipe: " + nextIndex);
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
            if (board[y * 13 + x]){
                var pipe = board[y * 13 + x].pipe;
                var water = board[y * 13 + x].water;
                // render water
                ctx.fillStyle = "#3333ff";
                ctx.fillRect((x * 64 + 150) + water.startX, (y * 64 + 20) + water.startY, water.width, water.height);
                ctx.drawImage(image,
                    // Source rect
                    pipe.x, pipe.y, pipe.width, pipe.height,
                    // Dest rect
                    x * 64 + 150, y * 64 + 20, 64, 64
                );
            }
            else{
                ctx.fillStyle = "grey";
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
