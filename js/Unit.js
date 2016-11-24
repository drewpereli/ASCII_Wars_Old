

function Unit()
{
	this.type = "UNIT";
	this.division;

	this.moveTime;
}

Unit.prototype = new Actor();




Unit.prototype.move = function(tile)
{
	this.tile.setActor(false);
	this.tile = tile;
	this.tile.setActor(this);
}



Unit.prototype.moveRandomly = function()
{
	console.log("in here");
	var sibs = getShuffledArray(this.tile.siblings);
	for (var i in sibs)
	{
		var sib = sibs[i];
		if (sib.blocksMovement === false && sib.terrain !== "WATER")
		{
			this.move(sib);
			this.timeUntilNextAction = this.moveTime;
			return;
		}
	}
}
