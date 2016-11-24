
function GlobalVariables(){
	this.game;
	this.input;
	this.rand;
	this.view;

	this.fontSize = 10;
	this.fontFamily = 'sans-serif';



	this.constructors = 
	{
		buildings: {
		},

		units: {
		}
	}


	this.colors = {
		border: 'black',
		selectedTile: "yellow",
		water: "blue",
		defaultColor: 'black',
		team: [
			"blue",//Team 0
			"black",//Team 1
		]
	}

	this.chars = {
	}


	this.constants = {
		BASE_MOVE_INCREMENT: 4,
		PRODUCTION_TIME_INCREASE_RATE: 2,
		TICK_INTERVAL: 300,
		MAX_DIVISIONS: 50,
		MAX_ZOOM: 10,
		MIN_ZOOM: 1,
	}

	this.terrains = [
		"OPEN",
		"WATER",
	]
	
}


GlobalVariables.prototype.initialize = function()
{
	this.rand = new Random(Math.floor(Math.random() * 100));
	this.input = new Input();
	this.game = new Game(100, 100);
	this.view = new View(20, 20);

	this.game.initialize(2);
	this.view.initialize();
	this.input.initialize();
}

var g = new GlobalVariables();