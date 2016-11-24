
function Game(width, height){

	this.state = "DEFAULT";
	this.lastState = "DEFAULT";
	this.timeState = "PAUSED";

	this.map;
	this.actors = [];
	this.teams = [];

	//this.tilesBetween = []; //Tiles in between selectedTile and player.tile. Used for aiming info and graphics

	this.width = width;
	this.height = height;

	this.ticks = 0;
	this.changedTiles = [];

	this.selectedTile = false;

	this.interval = false;

	this.lastUniqueId = 0;
}


Game.prototype.changeState = function(state)
{
	this.lastState = this.state;
	this.state = state;

	if (state === "DEFAULT")
	{
		if (this.lastState === "CONSTRUCTING")
			$("body").css("cursor", "default");
	}
	else if (state === "CONSTRUCTING")
	{
		$("body").css("cursor", "cell");
	}
	
}





Game.prototype.tick = function()
{
	for (var i in this.actors)
	{
		this.actors[i].tick();
	}
	g.view.set();
	this.changedTiles = [];
	this.ticks++;
	g.view.updateTicks();
}


/*
Game.prototype.setAllTilesToChanged = function()
{
	for (var x = 0 ; x < this.level.width ; x++)
	{
		for (var y = 0 ; y < this.level.height ; y++)
		{
			this.level.getTile(x, y).changed = true;
		}
	}
}


Game.prototype.setAllTilesToUnchanged = function()
{
	var t = this.level.getTiles();
	for (var i = 0 ; i < t.length ; i++)
	{
		t[i].changed = false;
	}
}
*/


Game.prototype.spawnActor = function(actor, team, tile)
{
	actor.initialize(team, tile);
	this.actors.push(actor);
	this.teams[team].spawnActor(actor);
}

Game.prototype.killActor = function(actor)
{
	//Tick is set up to simply go to the next unit in the array, not the next index, so we don't have to worry about removing things from the array
	var index = this.actors.indexOf(unit);
	this.actors.splice(index, 1);
	delete unit;
}


Game.prototype.getNextUniqueId = function()
{
	this.lastUniqueId++;
	return this.lastUniqueId;
}

//Converst 'LEFT', 'RIGHT', etc. to 3, 1, etc.
Game.prototype.directionStringToIndex = function(direction)
{
	var moveIndex;
	if (direction === "UP")
	{
		moveIndex = 0;
	}
	else if (direction === "RIGHT")
	{
		moveIndex = 1;
	}
	else if (direction === "DOWN")
	{
		moveIndex = 2;
	}
	else if (direction === "LEFT")
	{
		moveIndex = 3;
	}

	return moveIndex;
}


Game.prototype.toggleSelectTile = function(tile)
{
	if (tile === this.selectedTile)
	{
		tile.selected = false;
		this.selectedTile = false;
	}
	else
	{
		if (this.selectedTile)
		{
			var oldSelectedTile = this.selectedTile;
			this.selectedTile.selected = false;
			g.view.setTile(oldSelectedTile);
		}
		this.selectedTile = tile;
		tile.selected = true;
	}
	g.view.setTile(tile);
	g.view.setTileInfo();
}


Game.prototype.clickCanvasPixel = function(x, y)
{
	var tileClicked = this.getTileFromPixels(x, y);
	if (this.state === "DEFAULT")
	{
		this.toggleSelectTile(tileClicked);
	}
	else if (this.state === "CONSTRUCTING")
	{
		if (tileClicked.blocksMovement === false && tileClicked.terrain !== "WATER")
			this.constructSelectedConstruction(tileClicked);
	}
}


Game.prototype.constructSelectedConstruction = function(tile)
{
	var constructor = g.constructors.buildings[this.selectedConstruction];
	var building = new constructor();
	building.initialize(g.view.selectedTeam, tile);
	g.view.setTile(tile);
	this.changeState("DEFAULT");
}


Game.prototype.clickConstructButton = function(buildingName)
{
	//First check that there are sufficient resources
	this.pause;
	this.selectedConstruction = buildingName;
	this.changeState("CONSTRUCTING");
}


Game.prototype.getTileFromPixels = function(x, y)
{
	var tileX = Math.floor(x / g.view.cellLength) + g.view.viewX;
	var tileY = Math.floor(y / g.view.cellLength) + g.view.viewY;

	return this.map.getTile(tileX, tileY);
}


Game.prototype.pause = function()
{
	if (this.interval)
	{
		window.clearInterval(this.interval);
		this.timeState = "PAUSED";
		$("#play-pause-button").html("&#9193;");
	}
}

Game.prototype.play = function()
{
	this.interval = window.setInterval(function(){g.game.tick();}, g.constants.TICK_INTERVAL);
	this.timeState = "PLAYING";
	$("#play-pause-button").html("&#9208;")
}

Game.prototype.playOrPause = function()
{
	if (this.timeState === "PLAYING")
		this.pause();
	else
		this.play();
}

Game.prototype.next = function()
{
	this.tick();
}


Game.prototype.initialize = function(numTeams)
{
	//Initialize the teams
	for (var i = 0 ; i < numTeams ; i++)
	{
		this.teams.push(new Team());
		this.teams[i].initialize(i);
		//Initialize divisions for each team
		for (var d in g.constants.MAX_DIVISIONS)
		{
			var division = new Division(this.teams[i], d);
			division.initialize();
		}
	}

	this.map = new Map(this.width, this.height);
	this.map.initialize(i);	
}

