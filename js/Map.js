
function Map(width, height){
	
	this.width = width;
	this.height = height;

	this.tiles = [];

	this.items = [];
	this.guns = [];
	this.initialEnemies = [];
	this.numberOfEnemies = 0;

	//this.roomCenters = [];

	this.spawnTile = false;

	this.generationParamateters = 
	{
		numFunctions: 100,
		numRandomIterations: 0,
		multiplierMin: .01,
		multiplierMax: .25,
		seaLevel: 80,
	}
}



Map.prototype.generate = function()
{
	g.view.setLoadingMessage("Generating map...");
	var gPs = this.generationParamateters;
	var elevations = [];
	//Initialize elevations
	for (var x = 0 ; x < this.width ; x++)
	{
		elevations.push([]);
		for (var y = 0 ; y < this.height ; y++)
		{
			elevations[x].push(0);
		}
	}

	for (var i = 0 ; i <= gPs.numFunctions ; i++)
	{
		var xOffset = g.rand.next(0, 2 * Math.PI);
		var multiplier = g.rand.next(gPs.multiplierMin, gPs.multiplierMax);
		var rotationOffset = g.rand.next(0, 2 * Math.PI);
		var useXNotY = g.rand.nextInt(0, 2) === 0 ? true : false;
		for (var x = 0 ; x < this.width ; x++)
		{
			for (var y = 0 ; y < this.height ; y++)
			{
				//rotationOffset = 0;
				//xOffset = 0;
				//multiplier = 1;
				//Rotate the coordinate
				x1 = (x + xOffset) * multiplier * Math.cos(rotationOffset) - y * multiplier * Math.sin(rotationOffset);
				y1 = multiplier * y * Math.cos(rotationOffset) + multiplier * (x + xOffset) * Math.sin(rotationOffset);
				var z;
				z = useXNotY ? Math.sin(x1) : Math.sin(y1); //Between -1 and 1
				//Normalize z to between 0 and 1
				z = (z + 1) / 2;
				elevations[x][y] += z;
			}
		}
	}

	var xOffset;
	var multiplier;
	var rotationOffset;

	var processFunctions = function(iteration)
	{
		if (iteration === gPs.numFunctions)
		{
			finishGeneration();
			return;
		}

		if (iteration % 15 === 0)
		{
			g.view.setLoadingMessage(Math.round(100 * iteration / gPs.numFunctions) + "% done");
		}

		xOffset = g.rand.next(0, 2 * Math.PI);
		multiplier = g.rand.next(.05, 1);
		rotationOffset = g.rand.next(0, 2 * Math.PI);
		for (var x = 0 ; x < this.width ; x++)
		{
			for (var y = 0 ; y < this.height ; y++)
			{
				//rotationOffset = 0;
				//xOffset = 0;
				//multiplier += Math.random;
				//Rotate the coordinate
				x1 = (x + xOffset) * multiplier * Math.cos(rotationOffset) - y * Math.sin(rotationOffset);
				//y1 = y * Math.cos(rotationOffset) + (x + xOffset) * Math.sin(rotationOffset);
				var z = Math.sin(x1); //Between -1 and 1
				//Normalize z to between 0 and 1
				z = (z + 1) / 2;
				elevations[x][y] += z;
			}
		}

		window.setTimeout(function(){processFunctions(iteration + 1)}, 1);

	}

	/*
	for (var i = 0 ; i < gPs.numRandomIterations ; i++)
	{
		for (var x in elevations)
		{
			for (var y in elevations[x])
			{
				elevations[x][y] += g.rand.next(0, 1);
			}
		}
	}
	*/

	var finishGeneration = function()
	{
		//Get max and min of elevation
		var max = 0;
		var min = 99999999999999999;
		$(elevations).each(function(x, elevationArray){
			$(elevationArray).each(function(y, elevation)
			{
				if (elevation < min)
				{
					min = elevation;
				}
				if (elevation > max)
				{
					max = elevation;
				}
			});
		});

		$(g.game.map.tiles).each(function(x, tileArray)
		{
			$(tileArray).each(function(y, tile)
			{
				var elevation = elevations[x][y];
				var maxElevation = 99;
				var minElevation = -1 * gPs.seaLevel;
				elevation = (elevation - min) * ((maxElevation - minElevation) / (max - min)) + minElevation;
				if (g.game.DEBUG.flatMap)
				{
					tile.elevation = 50;
				}
				else
				{
					tile.elevation = Math.round(elevation);	
				}
				if (tile.elevation <= 0)
				{
					tile.setTerrain("WATER");
				}
				else
				{
					tile.setTerrain("OPEN");//This isn't necessary if the map gen works the first time, but if it doesn't,
						//Then there may be tiles that were previously set to water that are now above sea level, so we have to 
						//set them back
				}
			});
		});

		//Place command centers
		for (var i in g.game.teams)
		{
			var tile;
			i = Number(i);
			if (i === 0)
			{
				tile = g.game.map.getRandomUnoccupiedTileWithin(3, 3, (g.game.map.width / 4), (g.game.map.height / 2) - 2);
			}
			else if (i === 1)
			{
				tile = g.game.map.getRandomUnoccupiedTileWithin((3 * g.game.map.width / 4), 3, g.game.map.width - 3, g.game.map.height - 3);
				//console.log((g.game.map.width / 2) + 2, (g.game.map.height / 2) + 2, g.game.map.width - 2, g.game.map.height - 2);
				//console.log(tile.x, tile.y);
			}
			if (tile === false)
			{
				g.game.map.generate();
				return;
			}
			var team = g.game.teams[i];
			var cC = new CommandCenter();
			cC.initialize(team, tile);
		}

		g.view.hideLoadingMessage();
		g.view.setAll();
		g.game.changedTiles = [];
	}


	processFunctions(0);

}







Map.prototype.getTile = function(x, y)
{
	if (x < 0 || x >= this.width || y < 0 || y >= this.height)
	{
		return false;
	}
	
	return this.tiles[x][y];
}



Map.prototype.getRandomUnoccupiedTile = function()
{
	var tiles = this.getShuffledTiles();
	for (var i in tiles)
	{	
		if (tiles[i].actor === false && tiles[i].terrain === "OPEN")
		{
			return tiles[i];
		}
	}

	return false;
}


Map.prototype.getRandomUnoccupiedTileWithin = function(x1, y1, x2, y2)
{
	var tiles = this.getShuffledTiles();
	for (var i in tiles)
	{	
		var t = tiles[i];
		if (t.actor === false && t.terrain === "OPEN")
		{
			if (Number(t.x) >= x1 && Number(t.y) >= y1 && Number(t.x) < x2 && Number(t.y) < y2)
			{
				return t;
			}
		}
	}

	return false;
}


/*
Map.prototype.floodFillFromTile = function(tile)
{
	var queue = [];
	var processed = [];
	queue.push(tile);
	while (queue.length > 0)
	{
		var tile = queue[0];
		queue.splice(0, 1);
		if (tile.terrain === 'OPEN' && tile.filled === false)
		{
			tile.filled = true;
			processed.push(tile);
			//For each sibling
			for (var i = 0 ; i < tile.siblings.length ; i++)
			{
				var currSibling = tile.siblings[i];
				if (currSibling)
				{
					if (currSibling.filled === false)
					{
						queue.push(currSibling);
					}
				}
			}	
		}
	}
	return processed;
}
*/


Map.prototype.setTileSiblings = function(){
	for (var x = 0 ; x < this.width ; x++)
	{
		for (var y = 0 ; y < this.height ; y++)
		{
			var tile = this.getTile(x, y);
			tile.setSiblings();
		}
	}
}



Map.prototype.getTiles = function()
{
	var tiles = [];
	for (var x = 0 ; x < this.width ; x++)
	{
		for (var y = 0 ; y < this.height ; y++)
		{
			var tile = this.getTile(x, y);
			tiles.push(tile);
		}
	}
	return tiles;
}


Map.prototype.getShuffledTiles = function()
{
	var tiles = this.getTiles();
	var randTiles = [];
	while (tiles.length > 0)
	{
		var index = g.rand.nextInt(0, tiles.length);
		var t = tiles[index];
		randTiles.push(t);
		tiles.splice(index, 1);
	}

	return randTiles;
}


Map.prototype.reinitialize = function()
{
	this.tiles = [];
	for (var x = 0 ; x < this.width ; x++)
	{
		this.tiles.push([]);
		for (var y = 0 ; y < this.height ; y++)
		{
			var tile = new Tile(x, y);
			this.tiles[x].push(tile);
		}
	}
	this.setTileSiblings();
}



//f is a function that should be applies to all tiles
Map.prototype.forAllTiles = function(f)
{
	for (var x = 0 ; x < this.width ; x++)
	{
		for (var y = 0 ; y < this.height ; y++)
		{
			var tile = this.getTile(x, y);
			var keepGoing = f(tile);
			if (keepGoing === false)
				return;
		}
	}
}


Map.prototype.initialize = function()
{
	for (var x = 0 ; x < this.width ; x++)
	{
		this.tiles.push([]);
		for (var y = 0 ; y < this.height ; y++)
		{
			var tile = new Tile(x, y);
			this.tiles[x].push(tile);
		}
	}
	this.setTileSiblings();
	//TEST
	//this.INITIALIZETESTTABLE();
	//TEST
	this.generate(); //Make the map
}




