

"use strict";

function Division(team, number)
{
	this.team = team;
	this.number = number;
	this.units = [];
	this.behavior = {
		action: "MOVING",
		tile: false,
	}
}




Division.prototype.addUnit = function(unit)
{
	this.units.push(unit);
}

Division.prototype.removeUnit = function(unit)
{
	var i = this.units.indexOf(unit);
	if (i !== -1)
		this.units.splice(index, 1);
}

/*Behavior stuff*/
Division.prototype.moveToTile = function(tile)
{
	this.behavior.action = "MOVING";
	this.behavior.tile = tile;
}



Division.prototype.initialize = function()
{
	//this.behavior.tile = this.team.commandCenter;
}