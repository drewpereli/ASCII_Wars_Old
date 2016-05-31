
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



