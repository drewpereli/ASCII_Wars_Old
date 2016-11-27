
"use strict";

function GlobalVariables(){
	this.game;
	this.input;
	this.rand;
	this.view;

	this.fontSize = 8;
	this.fontFamily = 'sans-serif';



	this.constructors = 
	{
		buildings: {
		},

		units: {
		}
	}


	this.colors = {
		canvasBase: "#ddd",
		border: 'black',
		selectedTile: "yellow",
		grassland: "green",
		water: "blue",
		defaultColor: 'black',
		team: [
			"cyan",//Team 0
			"black",//Team 1
		]
	}

	this.chars = {
	}


	this.constants = {
		MAP_WIDTH: 30,
		MAP_HEIGHT: 30,
		VIEW_WIDTH: 20, //In tiles
		VIEW_HEIGHT: 20, 
		VIEW_CELL_LENGTH: 25,
		ANIMATION_FRAME_TIME: 40, //Time between animation frames in milliseconds
		BASE_MOVE_INCREMENT: 4,
		PRODUCTION_TIME_INCREASE_RATE: 2,
		TICK_INTERVAL: 300,
		MAX_DIVISIONS: 50,
		MAX_ZOOM: 10,
		MIN_ZOOM: 1,
	}

	this.terrains = [
		"GRASSLAND",
		"WATER",
	]
	
}


GlobalVariables.prototype.initialize = function()
{
	this.rand = new Random(Math.floor(Math.random() * 100));
	this.input = new Input();
	this.game = new Game(this.constants.MAP_WIDTH, this.constants.MAP_HEIGHT);
	this.view = new View(this.constants.VIEW_WIDTH, this.constants.VIEW_HEIGHT);

	this.game.initialize(2);
	this.view.initialize();
	this.input.initialize();
}

var g = new GlobalVariables();






