
g.constructors.units.LIGHT_INFANTRY = function()
{
	this.name = "LIGHT_INFANTRY";
	this.text = "Light Infantry";
	this.moveTime = 5;
}

g.constructors.units.LIGHT_INFANTRY.prototype = new Unit();

g.constructors.units.LIGHT_INFANTRY.prototype.act = function()
{
	this.timeUntilNextAction--;
	if (this.timeUntilNextAction <= 0)
	{
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
}