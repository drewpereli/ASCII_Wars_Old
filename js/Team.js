
"use strict";

function Team()
{
	this.number;
	this.divisions = [];
	this.buildings = [];
	this.commandCenter;

	this.territory = [];
}


Team.prototype.addBuilding = function(building)
{
	this.buildings.push(building);
}



Team.prototype.addTileToTerritory = function(tile)
{
	if (this.territory.indexOf(tile) === -1)
	{
		this.territory.push(tile);
		tile.setTerritory(this);
	}
}





Team.prototype.initialize = function(number)
{
	this.number = number;
	//Create divisions
	for (var d = 0 ; d < g.constants.MAX_DIVISIONS ; d++)
	{
		var division = new Division(this, d);
		this.divisions.push(division);
		division.initialize();
	}
}