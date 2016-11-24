

function CommandCenter()
{
	this.name = "COMMAND_CENTER";
	this.text = "Command Center";
	this.char = "\u2605";
}

CommandCenter.prototype = new Building();

CommandCenter.prototype.takeAction = function(){}


/*
g.constructors.buildings.WORKER_BUILDING = function()
{
	this.name = "WORKER_BUILDING";
	this.text = "Worker School";
	this.unitConstructor = g.constructors.units.WORKER;
	this.productionTimeInit = 5;
	this.productionTime = 5;
	this.timeUntilProduction = 5;
}




g.constructors.buildings.LIGHT_INFANTRY_BUILDING = function()
{
	this.name = "LIGHT_INFANTRY_BUILDING";
	this.text = "Light Infantry School";
	this.unitConstructor = g.constructors.units.LIGHT_INFANTRY;
	this.productionTimeInit = 5;
	this.productionTime = 5;
	this.timeUntilProduction = 5;
}

//g.constructors.buildings.LIGHT_INFANTRY_BUILDING.prototype = new Producer();


for (var name in g.constructors.buildings)
{
	g.constructors.buildings[name].prototype = new Producer();
}
*/


