
function Team()
{
	this.number;
	this.divisions = [];
	this.buildings = [];
	this.commandCenter;

	this.territory = [];
}


Team.prototype.spawnActor = function(actor)
{
	if (actor.type === "UNIT")
	{

	}
	else if (actor.type === "BUILDING")
	{
		this.buildings.push(actor);
		if (actor.name === "COMMAND_CENTER")
		{
			this.spawnCommandCenter(actor);
		}
	}
}

Team.prototype.spawnCommandCenter = function(cC)
{
	this.commandCenter = cC;

	//Initialize cc territory
	for (var x = -3 ; x <= 3 ; x++)
	{
		for (var y = -3 ; y <= 3 ; y++)
		{
			if (Math.abs(x) === 3 && Math.abs(y) === 3)
			{
				continue;
			}

			var tile = g.game.map.getTile(cC.tile.x + x, cC.tile.y + y);
			this.addTileToTerritory(tile);
		}
	}
}

Team.prototype.addTileToTerritory = function(tile)
{
	if (this.territory.indexOf(tile) === -1)
	{
		this.territory.push(tile);
		tile.setTerritory(this.number);
	}
}





Team.prototype.initialize = function(number)
{

	this.number = number;
}