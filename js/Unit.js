

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

