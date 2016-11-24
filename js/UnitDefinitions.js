







g.constructors.units.WORKER = function()
{
	this.name = "WORKER";
	this.text = "Worker";
	this.char = "w";
	this.moveTime = 3;
	this.producer = {
		productionTime: 5
	}
}


g.constructors.units.WORKER.prototype.takeAction = function()
{
	this.moveRandomly();
}





g.constructors.units.LIGHT_INFANTRY = function()
{
	this.name = "LIGHT_INFANTRY";
	this.text = "Light Infantry";
	this.char = "i";
	this.moveTime = 5;
	this.producer = {
		productionTime: 5
	}
}





g.constructors.units.LIGHT_INFANTRY.prototype.takeAction = function()
{
	this.moveRandomly();
}


//For each unit type
for (var name in g.constructors.units)
{
	var unitMethod = g.constructors.units[name];
	//Set the prototype to new Unit
	g.constructors.units[name].prototype = new Unit();
	//Create a sample unit to play with
	var unit = new unitMethod();
	console.log(unit);
	//Create a new producer for it
	var producer = //String representation of the new constructor
	`
		this.name = "${unit.name}_BUILDING";
		this.text = "${unit.text} School";
		this.char = "${unit.char}";
		this.unitConstructor = ${unitMethod};
		this.productionTimeInit = ${unit.producer.productionTime};
		this.productionTime = ${unit.producer.productionTime};
		this.timeUntilProduction = ${unit.producer.productionTime};
		//this.unitConstructor.prototype = new Unit();
	`;
	producer = new Function(producer);
	producer.prototype = new Producer();
	//Add it to the building constructor list
	g.constructors.buildings[unit.name + "_BUILDING"] = producer;

}











