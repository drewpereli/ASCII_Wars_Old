
"use strict";

function Cell(x, y){
	this.x = x;
	this.y = y;
	this.xPx = this.x * g.view.cellLength;
	this.yPx = this.y * g.view.cellLength;

	this.cellLength;

	this.ctxs = {};
}




Cell.prototype.fillRect = function(color, ctxName)
{
	var ctx = this.ctxs[ctxName];
	ctx.fillStyle = color;
	ctx.fillRect(this.xPx, this.yPx, this.cellLength, this.cellLength);
}



Cell.prototype.fillText = function(character, color, ctxName)
{
	var ctx = this.ctxs[ctxName];
	ctx.fillStyle = color;
	ctx.fillText(character, this.xPx + this.cellLength / 2, this.yPx + this.cellLength / 2);
}




Cell.prototype.strokeRect = function(color, ctxName)
{
	var ctx = this.ctxs[ctxName];
	ctx.strokeStyle = color;
	ctx.strokeRect(this.xPx + 1, this.yPx + 1, this.cellLength - 2, this.cellLength - 2);
}



Cell.prototype.clearRect = function(ctxName)
{
	var ctx = this.ctxs[ctxName];
	ctx.clearRect(this.xPx, this.yPx, this.cellLength, this.cellLength);
}


Cell.prototype.fullClear = function()
{
	for (var name in this.ctxs)
	{
		this.clearRect(name);
	}
}




Cell.prototype.initialize = function()
{
	for (name in g.view.canvases)
	{
		var canvas = g.view.canvases[name];
		this.ctxs[name] = canvas;//.getContext('2d');
		this.ctxs[name].font = g.fontSize + 'pt ' + g.fontFamily;
	}


	this.cellLength = g.view.cellLength;
}


