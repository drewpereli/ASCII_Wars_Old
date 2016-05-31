

function View(width, height){
	
	this.widthInCells = width;
	this.heightInCells = height;

	this.cells = [];

	this.viewX = 0; //Relative to the map
	this.viewY = 0;

	this.cellLength = 22;

	this.widthInPixels = this.widthInCells * this.cellLength;
	this.heightInPixels = this.heightInCells * this.cellLength;

	this.selectedTeam = 0;

	this.canvases = {
		terrain: $("#terrain-canvas")[0].getContext("2d"),
		territory: $("#territory-canvas")[0].getContext("2d"),
		actors: $("#actors-canvas")[0].getContext("2d"),
		vision: $("#vision-canvas")[0].getContext("2d"),
		seen: $("#seen-canvas")[0].getContext("2d"),
		select: $("#select-canvas")[0].getContext("2d"),
	};


	this.canvasStyle = {
		width: this.cellLength * this.widthInCells,
		height: this.cellLength * this.heightInCells,
		top: 15,
		left: 250
	}
	
}


//Sets the entire view
View.prototype.setAll = function()
{	
	for (var x = 0 ; x < this.widthInCells ; x++)
	{
		for (var y = 0 ; y < this.heightInCells ; y++)
		{
			var cell = this.getCell(x, y);
			this.setCell(cell);
		}
	}

}




View.prototype.set = function()
{
	for (var i in g.game.changedTiles)
	{
		var cell = this.getCellFromTile(g.game.changedTiles[i]);
		if (cell)
			this.setCell(cell);
	}
}






//Set all the canvases for an individual cell
View.prototype.setCell = function(cell)
{
	cell.fullClear();

	var tile = this.getTileFromCell(cell);
	var color;
	if (tile)
	{
		//Go through the canvases
		//Terrain
		if (tile.terrain === "OPEN")
		{
			color = this.getColorFromElevation(tile.elevation);
		}
		else if (tile.terrain === "WATER")
		{
			color = g.colors.water;
		}
		cell.fillRect(color, "terrain");
		//cell.strokeRect(g.colors.border, "terrain");
		
		//Terrirory
		if (tile.territory !== false)
		{
			color = g.colors.team[tile.territory];
			cell.fillRect(color, "territory");
		}

		//Actors
		if (tile.actor)
		{
			var char = g.chars[tile.actor.name];
			var color = g.colors.team[tile.actor.team];
			cell.fillText(char, color, "actors");
			if (tile.actor.type === "BUILDING")
				cell.strokeRect(color, "actors");
		}
		
		//Select
		if (tile.selected)
		{
			color = g.colors.selectedTile;
			cell.strokeRect(color, "select");
		}
	}
}


View.prototype.setTile = function(tile)
{
	var cell = this.getCellFromTile(tile);
	if (cell)
		this.setCell(cell);
}




View.prototype.clearCell = function(cell)
{
	/*for (cName in this.canvases)
	{
		var c = this.canvases[cName];
		ctx = c.getContext('2d');
		ctx.clearRect(cell.xPx, cell.yPx, this.cellLength, this.cellLength);
	}*/

	cell.fullClear();
}






















//Centers the view on tile
View.prototype.centerOnTile = function(tile)
{
	this.centerOn(tile.x, tile.y);
}



//Centers the view on (x, y)
View.prototype.centerOn = function(x, y){
	//Get top left corner x and y
	var widthHalf = Math.round(this.widthInCells / 2);
	var heightHalf = Math.round(this.heightInCells / 2);

	var newX = x - widthHalf;
	var newY = y - heightHalf;

	
	if(newX < 0)
	{
		newX = 0;
	}
	if(newY < 0)
	{
		newY = 0;
	}
	if(newX > g.game.map.width - this.widthInCells)
	{
		newX = g.game.map.width - this.widthInCells;
	}
	if (newY > g.game.map.height - this.heightInCells)
	{
		newY = g.game.map.height - this.heightInCells;
	}	

	if (this.viewX === newX && this.viewY === newY)
		return;

	this.viewX = newX;
	this.viewY = newY;
	this.setAll();
}


View.prototype.move = function(direction)
{
	var index = ["UP", "RIGHT", "DOWN", "LEFT"].indexOf(direction);
	var newX = this.viewX + Math.round(this.widthInCells / 2);
	var newY = this.viewY + Math.round(this.heightInCells / 2);
	var mI = g.constants.MOVE_INCREMENT;

	switch (index)
	{
		case 0:
			newY -= mI;
			break;
		case 1:
			newX += mI;
			break;
		case 2:
			newY += mI;
			break;
		case 3:
			newX -= mI;
			break;
	}


	this.centerOn(newX, newY);
}








//Returns the cell object corresponding to the tile object. Retursn false if the tile is out of the view range
View.prototype.getCellFromTile = function(tile){
	var x = tile.x;
	var y = tile.y;
	if (x < this.viewX || x >= this.viewX + this.widthInCells)
	{
		return false;
	}
	if (y < this.viewY || y >= this.viewY + this.heightInCells)
	{
		return false;
	}
	//If it's in the view range
	return this.getCell(x - this.viewX, y - this.viewY);
}


//Returns the tile object corresponding to the cell object if it exists.
View.prototype.getTileFromCell = function(cell)
{
	var x = cell.x;
	var y = cell.y;
	var tileX = this.viewX + x;
	var tileY = this.viewY + y;
	if (tileX < 0 || tileX >= g.game.map.width || tileY < 0 || tileY >= g.game.map.height)
	{
		return false;
	}
	return g.game.map.getTile(tileX, tileY);
}


View.prototype.getCell = function(x, y)
{
	if (x < 0 || x >= this.widthInCells)
	{
		return false;
	}
	if (y < 0 || y >= this.heightInCells)
	{
		return false;
	}
	return this.cells[x][y];
}








//Elevation is between 1 and 99 I guess
View.prototype.getColorFromElevation = function(elevation)
{
	var red = Math.round(125 - (1.5 * elevation) + 50);
	var green = Math.round(1.5 * elevation + 50);

	return "rgb(" + red + ", " + green + ", 0)";
}





View.prototype.addBuildingToTable = function(building)
{
	var team = building.team;
	var table = $("#control-area-" + team).find(".buildings-table");
	var row = $(table).find(".buildings-table-entry-template").clone();
	$(row).attr("id", "building-table-row-" + building.uniqueId);
	$(row).removeClass("display-none").removeClass("buildings-table-entry-template");
	$(table).append(row);
}





//Sets the tile info window when a tile is selected or unselected
View.prototype.setTileInfo = function()
{
	var t = g.game.selectedTile;

	if (t)
	{
		$("#tile-info-inner").removeClass("hidden");
		$("#tile-info-x").html(t.x);
		$("#tile-info-y").html(t.y);
		$("#tile-info-elevation").html(t.elevation);
		if (t.territory !== false)
			$("#tile-info-owner").html("Team " + t.territory + "'s");
		else
			$("#tile-info-owner").html("Neutral");
	}
	else
		$("#tile-info-inner").addClass("hidden");
}



View.prototype.setLoadingMessage = function(message)
{
	$("#loadingMessage").html(message);
}

View.prototype.hideLoadingMessage = function()
{
	$("#loadingMessage").css("display", "none");
}








View.prototype.selectTeam = function(t)
{
	this.selectedTeam = t;
	$(".control-area").each(function(index, element)
		{
			if (index == t)
			{
				$(this).removeClass("display-none");
			}
			else
			{
				$(this).addClass("display-none");
			}
		});
}


View.prototype.selectControlArea = function(a)
{
	var currentControlArea = $("#control-area-" + this.selectedTeam);
	$(currentControlArea).find(".buildings-control-area-container").addClass("display-none");
	$(currentControlArea).find(".units-control-area-container").addClass("display-none");
	$(currentControlArea).find(".research-control-area-container").addClass("display-none");
	if (a === "buildings")
	{
		$(currentControlArea).find(".buildings-control-area-container").removeClass("display-none");
	}
	else if (a === "units")
	{
		$(currentControlArea).find(".units-control-area-container").removeClass("display-none");
	}
	else if (a === "research")
	{
		$(currentControlArea).find(".research-control-area-container").removeClass("display-none");
	}
}


View.prototype.selectBuildingControlArea = function(a)
{
	var currentControlArea = $("#control-area-" + this.selectedTeam);
	$(currentControlArea).find(".buildings-construct").addClass("display-none");
	$(currentControlArea).find(".buildings-list").addClass("display-none");
	if (a === "construct")
	{
		$(currentControlArea).find(".buildings-construct").removeClass("display-none");
	}
	else if (a === "building-list")
	{
		$(currentControlArea).find(".buildings-list").removeClass("display-none");
	}
}








View.prototype.initiatlizeControlArea = function()
{
	var controlArea = $(".control-area")[0];
	for (var i = 0 ; i < g.game.teams.length ; i++)
	{
		//First, add a select option to the team list
		$("#team-select").append('<option value="' + i + '">Team ' + (Number(i) + 1) + '</option>');
		//Then, set the ids of the control areas
		var currentControlArea = $(controlArea).clone();
		$(currentControlArea).attr("id", "control-area-" + i);
		//$(currentControlArea).css("background-color", g.colors.team[i]);
		$("#control-area-container").append(currentControlArea);
		//Then set the squad select list
		var divisionSelect = $(currentControlArea).find(".division-select");
		for (var d = 0 ; d < g.constants.MAX_DIVISIONS ; d++)
		{
			$(divisionSelect).append('<option value="' + d + '">' + (d + 1) + '</option>');
		}
		//Set up the building construct buttons
		var constructArea = $(currentControlArea).find(".buildings-construct");
		for (var name in g.constructors.buildings)
		{
			//Get the name and text
			var unit = new g.constructors.buildings[name]()
			var text = unit.text;
			var name = unit.name;
			//Create the button
			$(constructArea).append('<span class="construct-button" data-tag="' + name + '">' + text + '</span>');
		}
		//Set up building table entry template
		var tableEntryTemplate = $(currentControlArea).find(".buildings-table-entry-template");
		for (var table = 1 ; table <= 2 ; table++)
		{
			var select = $(tableEntryTemplate).find(".squad-produce-select-" + table)[0];
			for (var d = 0 ; d < g.constants.MAX_DIVISIONS ; d++)
			{
				$(select).append('<option value="' + d + '">' + (d + 1) + '</option>');
			}
		}
	}
	$(controlArea).remove();
	$("#control-area-0").removeClass("display-none");
}


View.prototype.initialize = function(){

	//Set canvas style
	$("canvas").css("position", "absolute")
				//.css("top", this.canvasStyle.top + "px")
				//.css("left", this.canvasStyle.left + "px")
				//.css("width", this.canvasStyle.width + "px")
				//.css("height", this.canvasStyle.height + "px")
				.attr("width", this.canvasStyle.width)
				.attr("height", this.canvasStyle.height);
	$("#territory-canvas").css("opacity", ".4");

	//Set canvas context stuff
	this.canvases.actors.textAlign = "center";
	this.canvases.actors.textBaseline = "middle";

	//Set canvas container style (to fill in the space to make the floats right)
	$("#canvases").css("width", this.widthInPixels + "px")
					.css("height", this.heightInPixels + "px");

	//Fill cell array
	var width = this.widthInCells;
	var height = this.heightInCells;
	for (var x = 0 ; x < width ; x++)
	{
		this.cells.push([]);
		for (var y = 0 ; y < height ; y++)
		{
			var cell = new Cell(x, y);
			cell.initialize();
			this.cells[x].push(cell);
		}
	}

	//Set loading message css
	$("#loadingMessage").css("width", "100%")
		.css("margin", "0 auto")
		.css("text-align", "center");

	this.initiatlizeControlArea();
}








