
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
	this.blocksMovement = false;

	this.seenByPlayer = false;

	this.pF = {
		checked: false,
		pathLengthFromTarget: false,
	}
}














//Sets or clears the unit from the tile
Tile.prototype.setActor = function(actor)
{
	this.actor = actor;
	this.blocksMovement = actor !== false ? true : false;
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



//Returns the path from this tile to 'tile'
Tile.prototype.getNextTileOnPath = function(tile)
{
	var weightMultiplier = 1; //How important a low move-weight is to determining which tile to search next
		//If I undersatnd correctly, the lower this is, the faster the algorithm is. The higher it is, the more likely it is that the most effective path will be returned.
	var distanceMultiplier = 1; //How important short euclidean distance is to determinign whcih tile to search next
		//Behaves opposite to weightMultiplier when increased/decreased
	var checked = []; //Tiles that have already been checked.
	tile.pF.pathLengthFromTarget = 0;
	var toCheck = [tile]; //A stack of tiles to be checked. The stack pops the last element in the array
	while(toCheck.length > 0)
	{
		var tileBeingChecked = toCheck[toCheck.length - 1];
		toCheck.splice(-1); //Pop the element 
		//push sibs in order of proximity to this (depth first)
		var distances = [];
		var weights = [];
		var scores = [];
		var sibIndeces = [];//To keep track of whcih distances/weights correspond to wich siblings while 
		//For each sibling of the tile we're checking
		for (var sibIndex in tileBeingChecked.siblings)
		{
			var currentSib = tileBeingChecked.siblings[sibIndex];
			if (currentSib === false)
				continue;
			//If the current sibling is this tile, return the sibling with the shortest pathLengthtoTarget
			if (currentSib === this)
			{
				var returnTile = getSibWithShortestPath(this);
				//Clear the pF data from all the tiles
				for (var i in checked)
				{
					var t = checked[i];
					for (var pFAttr in t.pF)
					{
						t.pF[pFAttr] = false;
					}
				}
				return returnTile;
			}
			var weight = currentSib.getMoveWeight(currentSib.siblings.indexOf(tileBeingChecked));
			var pathLength = tileBeingChecked.pF.pathLengthFromTarget + weight;
			//If the tile has been checked before, and the path we're on now isn't more efficient than the one taken to get there the last time
			if (currentSib.pF.checked && currentSib.pF.pathLengthFromTarget <= pathLength)
				continue;
			currentSib.pF.pathLengthFromTarget = pathLength;
			distances.push(tileBeingChecked.getDistance(currentSib));
			weights.push(weight);
			sibIndeces.push(sibIndex);
		}
		var minDistanceInit = Math.min.apply(null, distances); //The minimum distance before any items are taken from the array.
			//This number is subtracted from all the distances during the weighing process.

		//generate a "best path likelihood" score for each sibling (low scores are better)
		for (var sibIndex in sibIndeces)
		{
			var distanceComponent = (distances[sibIndex] - minDistanceInit) * distanceMultiplier;
			var weightComponent = weights[sibIndex] * weightMultiplier;
			scores[sibIndex] = distanceComponent + weightComponent;
		}

		//While scores still has items in it, add the tile with the worst score to the top of the stack. 
		while (scores.length > 0)
		{
			var maxScore = Math.max.apply(null, scores);
			var maxScoreIndex = scores.indexOf(maxScore);
			var sibIndex = sibIndeces[maxScoreIndex];
			var worstTile = tileBeingChecked.siblings[sibIndex];
			//Add the worst tile (the one with the highest score) to the stack (end of the array)
			toCheck.push(worstTile);
			//Remove the score and corresponding sib from the respective arrays
			scores.splice(maxScoreIndex, 1);
			sibIndeces.splice(maxScoreIndex, 1);
		}
		//Add the tile we just checked to the "checked" array, and set it's checked attribute to "true"
		checked.push(tileBeingChecked);
		tileBeingChecked.pF.checked = true;
	}
	//If it gets here, no path to the target was found
	return false;

	function getSibWithShortestPath(tile)
	{
		var lengths = [];
		var sibIndeces = []
		for (var sibIndex in tile.siblings)
		{
			var currentSib = tile.siblings[sibIndex];
			if (currentSib === false || currentSib.pF.pathLengthFromTarget === false)
				continue;
			lengths.push(currentSib.pF.pathLengthFromTarget);
			sibIndeces.push(sibIndex);
		}
		//Return tile with shortest length
		var shortestLengthIndex = lengths.indexOf(Math.min.apply(null, lengths));
		return tile.siblings[sibIndeces[shortestLengthIndex]];
	}
}




//Returns the multiplier for moving from this tile into the sibling tile (index) fed to it
Tile.prototype.getMoveWeight = function(sibIndex)
{
	var weight = 1;
	var sib = this.siblings[sibIndex];
	var elDiff = sib.elevation - this.elevation;
	var isDiagonal = sibIndex % 2 === 0; //If sib index is even, the sib is diagonal
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



