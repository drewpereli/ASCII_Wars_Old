

function Producer()
{
	this.unitConstructor;
	this.productionTimeInit;
	this.productionTime;
	this.timeUntilProduction;
	this.unitsProduced = 0;
	this.producing = true;
}

Producer.prototype = new Building();

Producer.prototype.tick = function()
{
	this.timeUntilProduction--;
	if (this.timeUntilProduction <= 0)
	{
		if (this.producing)
		{
			var succesful = this.produceUnit();
			if (succesful)
			{
				this.setProductionTime();
				this.timeUntilProduction = this.productionTime;
			}
			//If not succesful, it's because there isn't an open tile. Try again next round
		}
	}
}

Producer.prototype.produceUnit = function()
{
	var unit = new this.unitConstructor();
	//Get open tile
	var sibs = getShuffledArray(this.tile.siblings);
	for (var i in sibs)
	{
		var t = sibs[i];
		if (t.actor === false && t.blocksMovement === false)
		{
			unit.initialize(this.team, this.team.divisions[0], t);
			this.unitsProduced++;
			return true;
		}
	}
	return false;
}

Producer.prototype.setProductionTime = function()
{
	this.productionTime = Math.round(this.productionTimeInit * Math.pow(g.constants.PRODUCTION_TIME_INCREASE_RATE, this.unitsProduced));
}


Producer.prototype.toggle = function()
{
	this.producing = !this.producing;
}


Producer.prototype.initialize = function(team, tile)
{
	this.standardInitialization(team, tile);
	g.view.addBuildingToTable(this);
}






