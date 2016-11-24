

function Division(team, number)
{
	this.team = team;
	this.number = number;
	this.units = [];
}




Division.prototype.addUnit = function(unit)
{
	this.units.push(unit);
}



Division.prototype.initialize = function()
{
	this.team.divisions[this.number] = this;
}