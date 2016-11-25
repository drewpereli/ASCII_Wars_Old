
function Building()
{
	this.type = "BUILDING";
}

Building.prototype = new Actor();

Building.prototype.initialize = function(team, tile)
{
	this.standardInitialization(team, tile);
	if (this.name === "COMMAND_CENTER")
	{
		//Initialize com center territory
		for (var x = -3 ; x <= 3 ; x++)
		{
			for (var y = -3 ; y <= 3 ; y++)
			{
				if (Math.abs(x) === 3 && Math.abs(y) === 3)
				{
					continue;
				}
				var tile = g.game.map.getTile(this.tile.x + x, this.tile.y + y);
				this.team.addTileToTerritory(tile);
			}
		}
		this.team.commandCenter = this;
	}
}