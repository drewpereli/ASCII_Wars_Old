

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


/*Behavior stuff*/
Division.prototype.moveToSelectedTile = function()
{
	this.behavior.action = "MOVING";
	this.behavior.tile = g.game.selectedTile;
}



Division.prototype.initialize = function()
{
	this.behavior.tile = this.team.commandCenter;
}