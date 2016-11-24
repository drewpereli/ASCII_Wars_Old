
function Actor()
{
	this.team;
	this.tile;
	this.name;
	this.type;

	this.health;

	this.timeUntilNextAction = 0;
	this.uniqueId;
}


//Actor.prototype.act = function(){}

Actor.prototype.initialize = function(team, tile)
{
	this.standardInitialization(team, tile);
}

Actor.prototype.standardInitialization = function(team, tile)
{
	this.team = team;
	this.tile = tile;
	this.tile.setActor(this);
	this.uniqueId = g.game.getNextUniqueId();
	g.game.actors.push(this);
}