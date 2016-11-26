

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
	var sibIndex = this.tile.siblings.indexOf(tile);
	this.timeUntilNextAction = Math.ceil(this.moveTime * this.tile.getMoveWeight(sibIndex));
	this.tile.setActor(false);
	this.tile = tile;
	this.tile.setActor(this);
}



Unit.prototype.moveTowards = function(tile)
{
	var closestOpenTile = tile.getClosestOpenTile(this.tile);
	//If it's closer than the actor is, move to it
	if (closestOpenTile.getDistance(tile) < this.tile.getDistance(tile))
	{
		var nextT = this.tile.getNextTileOnPath(closestOpenTile);
		this.move(nextT);
	}
	else//stay where we are
	{
		return;
	}
}


Unit.prototype.moveRandomly = function()
{
	var sibs = getShuffledArray(this.tile.siblings);
	for (var i in sibs)
	{
		var sib = sibs[i];
		if (sib === false)
			continue;
		if (sib.blocksMovement() === false && sib.terrain !== "WATER")
		{
			this.move(sib);
		}
	}
}



Unit.prototype.initialize = function(team, division, tile)
{
	this.standardInitialization(team, tile);
	division.addUnit(this);
	this.division = division;
}




