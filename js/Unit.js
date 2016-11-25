

function Unit()
{
	this.type = "UNIT";
	this.division;

	this.moveTime;
}

Unit.prototype = new Actor();



Unit.prototype.takeAction = function()
{
	if (this.division.behavior.action === "MOVING")
	{
		if (this.division.behavior.tile)
			this.moveTowards(this.division.behavior.tile);
		else
			this.moveRandomly();
	}
}


Unit.prototype.move = function(tile)
{
	if (tile.blocksMovement())
		return false;
	this.tile.setActor(false);
	this.tile = tile;
	this.tile.setActor(this);
}



Unit.prototype.moveTowards = function(tile)
{
	var nextT = this.tile.getNextTileOnPath(tile);
	if (nextT)
		this.move(nextT);
	else
		this.moveRandomly();
}


Unit.prototype.moveRandomly = function()
{
	var sibs = getShuffledArray(this.tile.siblings);
	for (var i in sibs)
	{
		var sib = sibs[i];
		if (sib.blocksMovement() === false && sib.terrain !== "WATER")
		{
			this.move(sib);
			this.timeUntilNextAction = this.moveTime;
			return;
		}
	}
}



Unit.prototype.initialize = function(team, division, tile)
{
	this.standardInitialization(team, tile);
	division.addUnit(this);
	this.division = division;
}




