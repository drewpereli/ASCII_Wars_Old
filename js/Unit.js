
"use strict";

function Unit()
{
	this._type = "UNIT";
	this._division;
	
	this._moveTime;

	var _maxHealth = 100;
	this._health = _maxHealth;
	this._maxHealth = _maxHealth;
}

Unit.prototype = new Actor();
unitAddSettersAndGetters();

function unitAddSettersAndGetters()
{
	var u = new Unit();
	for (var attrName in u)
	{
		var attr = u[attrName];
		if (typeof attr !== "function") //Only add getters and setters for non-functions
		{
			var attrUppercase = attrName.charAt(1).toUpperCase() + attrName.slice(2);
			var getter = new Function(`
					return this.${attrName};
				`);
			Unit.prototype["get" + attrUppercase] = getter;
			var setter = new Function("val", 
				`
					this.${attrName} = val;
				`);
			Unit.prototype["set" + attrUppercase] = setter;
		}
	}
}



//Called when the unit is ready to take an action, such as moving or attacking something
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
	this.timeUntilNextAction = Math.ceil(this.getMoveTime() * this.tile.getMoveWeight(sibIndex));
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
		if (sib.blocksMovement() === false && sib.layers.base !== "WATER")
		{
			this.move(sib);
		}
	}
}



Unit.prototype.getMoveTime = function()
{
	return this.moveTime;
}




Unit.prototype.initialize = function(team, division, tile)
{
	this.standardInitialization(team, tile);
	division.addUnit(this);
	this.division = division;
}




