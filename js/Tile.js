
function Tile(x, y){
	this.x = x;
	this.y = y;
	this.siblings = [false, false, false, false, false, false, false, false]; //Up, right, down, left. Will be set later
	this.actor = false;
	this.elevation = false;	
	this.terrain = "OPEN";
	this.territory = false;
	this.selected = false;

	this.blocksVision = false;

	this.seenByPlayer = false;

	this.pF = {
		checked: false,
		pathLengthFromTarget: false,
		eucDistanceFromOrigin: false,
		score: false //low score === good candidate
	}

	this.DEBUG = {
		highlight: false,
		char: false
	}
}














//Sets or clears the unit from the tile
Tile.prototype.setActor = function(actor)
{
	this.actor = actor;

	g.game.changedTiles.push(this);
}


Tile.prototype.setTerritory = function(team)
{
	this.territory = team;
	g.game.changedTiles.push(this);
}


Tile.prototype.setTerrain = function(terrain)
{
	this.terrain = terrain;
	g.game.changedTiles.push(this);
}


Tile.prototype.blocksMovement = function()
{
	return (this.actor || this.terrain === "WATER");
}




//Returns the path from this tile to 'tile'
Tile.prototype.getNextTileOnPath = function(tile)
{
	//Unhighlight all tiles

	var tiles = g.game.map.getTiles();
	if (g.game.DEBUG.highlightPathfinding)
	{
		for (var tI in tiles)
		{
			var t = tiles[tI];
			if (t.DEBUG.highlight)
			{
				tiles[tI].DEBUG.highlight = false;
				tiles[tI].DEBUG.char = false;
				g.game.changedTiles.push(t);
			}
		}
	}
	
	if (tile === this)
		return this;
	//var pFDistanceMultiplier = 1; //How important a low move-weight is to determining which tile to search next
		//If I undersatnd correctly, the lower this is, the faster the algorithm is. The higher it is, the more likely it is that the most effective path will be returned.
	//var eucDistanceMultiplier = 0; //How important short euclidean distance is to determinign whcih tile to search next
		//Behaves opposite to weightMultiplier when increased/decreased
	var checked = []; //Tiles that have already been checked.
	tile.pF.pathLengthFromTarget = 0;
	var toCheck = [tile]; //A stack of tiles to be checked. The stack pops the last element in the array
	while(toCheck.length > 0)
	{
		if (toCheck.length > tiles.length)
		{
			var e = new Error("pathfinding broken");
			throw(e);
			return false;
		}

		//Check the tile with the lowest pF distance to target
		var minDistance = 9999999999999999999;
		var closestTile = false
		for (var tI in toCheck)
		{
			t = toCheck[tI];
			if (t.pF.pathLengthFromTarget < minDistance)
			{
				minDistance = t.pF.pathLengthFromTarget;
				closestTile = t;
			}
		}
		var tileBeingChecked = closestTile;
		toCheck.splice(toCheck.indexOf(closestTile), 1); //Pop the element 
		//push each sib that is valid and hasn't been checked yet
		for (var sibIndex in tileBeingChecked.siblings)
		{
			var currentSib = tileBeingChecked.siblings[sibIndex];
			if (currentSib === false)
				continue;
			//If the current sibling is this tile, return the sibling with the shortest pathLengthtoTarget
			if (currentSib === this)
			{
				//Clear the pF data from all the tiles
				for (var i in checked)
				{
					var t = checked[i];
					//Debug
					if (g.game.DEBUG.highlightPathfinding)
					{
						g.game.changedTiles.push(t);
						t.DEBUG.highlight = true;
						t.DEBUG.char = t.pF.pathLengthFromTarget.toFixed(1);
					}
					for (var pFAttr in t.pF)
					{
						t.pF[pFAttr] = false;
					}
				}
				//Take away the path finding info in "to check" as well (beacuse pFDistances were set in that array)
				for (var i in toCheck)
				{
					var t = toCheck[i];
					for (var pFAttr in t.pF)
					{
						t.pF[pFAttr] = false;
					}
				}
				//Take away the pathfinding info on "tileBeingChecked", whic isn't in either array.
				var t = tileBeingChecked;
				for (var pFAttr in t.pF)
				{
					t.pF[pFAttr] = false;
				}
				return tileBeingChecked;
			}
			if (currentSib.blocksMovement())
				continue;
			var weight = currentSib.getMoveWeight(currentSib.siblings.indexOf(tileBeingChecked));
			var pathLength = tileBeingChecked.pF.pathLengthFromTarget + weight;
			//If the tile has been checked before, and the path we're on now isn't more efficient than the one taken to get there the last time
			if (currentSib.pF.pathLengthFromTarget !== false && currentSib.pF.pathLengthFromTarget <= pathLength)
				continue;
			currentSib.pF.pathLengthFromTarget = pathLength;
			//currentSib.pF.eucDistanceFromOrigin = currentSib.getDistance(this);
			//Add current sib to the "to check" array
			//If it's not already in the "toCheck" array, add it
			if (toCheck.indexOf(currentSib) === -1)
			{
				toCheck.push(currentSib);
			}
		}
		//Add the tile we just checked to the "checked" array, and set it's checked attribute to "true"
		checked.push(tileBeingChecked);
		tileBeingChecked.pF.checked = true;
	}
	//If it gets here, no path to the target was found
	return false;
}




//Returns the multiplier for moving from this tile into the sibling tile (index) fed to it
Tile.prototype.getMoveWeight = function(sibIndex)
{
	var weight = 1;
	var sib = this.siblings[sibIndex];
	var elDiff = sib.elevation - this.elevation;
	var isDiagonal = sibIndex % 2 === 1; //If sib index is odd, the sib is diagonal
	if (isDiagonal)
		weight *= Math.sqrt(2);
	weight *= Math.exp(elDiff/7);
	return weight;
}




Tile.prototype.getDistance = function(tile)
{
	var x1 = this.x;
	var y1 = this.y;
	var x2 = tile.x;
	var y2 = tile.y;
	var dY = y2 - y1;
	var dX = x2 - x1;
	var distance = dY * dY + dX * dX;
	return Math.sqrt(distance);
}





Tile.prototype.setSiblings = function(){
	for (var i = 0 ; i < 8 ; i++){
		var xDiff = 0;
		var yDiff = 0;
		switch (i)
		{
			case 0:
				yDiff = -1;
				break;
			case 1:
				yDiff = -1;
				xDiff = 1;
				break;
			case 2:
				xDiff = 1;
				break;
			case 3:
				yDiff = 1;
				xDiff = 1;
				break;
			case 4:
				yDiff = 1;
				break;
			case 5:
				yDiff = 1;
				xDiff = -1;
				break;
			case 6:
				xDiff = -1;
				break;
			case 7:
				xDiff = -1;
				yDiff = -1;
				break;
		}
		var sibling = g.game.map.getTile(this.x + xDiff, this.y + yDiff);
		this.siblings[i] = sibling; //getTile will return false if the sibling doesn't exist
	}
}



