
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
			LIGHT_INFANTRY_BUILDING: false,
			//HEAVY_INFANTRY: false,
			//TANK: false,
		},

		units: {
			LIGHT_INFANTRY: false,
			//HEAVY_INFANTRY: false,
			//TANK: false,
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
		COMMAND_CENTER: "\u2605",
		LIGHT_INFANTRY_BUILDING: "i",
		LIGHT_INFANTRY: "i",
	}


	this.constants = {
		MOVE_INCREMENT: 3,
		PRODUCTION_TIME_INCREASE_RATE: 2,
		TICK_INTERVAL: 300,
		MAX_DIVISIONS: 50,
	}
	
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