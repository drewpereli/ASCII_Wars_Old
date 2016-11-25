

function View(width, height){
	
	this.widthInCells = width;
	this.heightInCells = height;

	this.cells = [];

	this.viewX = 0; //Relative to the map
	this.viewY = 0;

	this.cellLength = g.constants.VIEW_CELL_LENGTH;

	this.widthInPixels = this.widthInCells * this.cellLength;
	this.heightInPixels = this.heightInCells * this.cellLength;

	this.selectedTeam;
	this.selectedDivision;

	this.zoom = g.constants.MAX_ZOOM; //10 is max zoom
	this.MAX_ZOOM = g.constants.MAX_ZOOM;
	this.MIN_ZOOM = g.constants.MIN_ZOOM;

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

	var tiles = this.getTilesFromCell(cell);
	if (tiles.length > 0)
	{
		cellAttribute = { //After looking at all the tiles represented by the cell, these attributes are set to the most commonly occuring corresponding attribute of the tiles
			terrain: false,
			territory: false,
			actor: false,
			elevation: false,
		}

		var counts = {
			terrain: [],
			elevation: [],
			territory: [],
			actor: [],
		}

		//Set the cell attributes
		for (var i = 0 ; i < tiles.length ; i++)
		{
			var t = tiles[i];
			var terrain = t.terrain;
			var territory = t.territory;
			var actor = t.actor;
			var elevation = t.elevation;
			counts.terrain.push(terrain);
			counts.elevation.push(elevation);
			counts.territory.push(territory);
			counts.actor.push(actor);
		}

		cellAttribute.terrain = find_mode(counts.terrain);
		cellAttribute.territory = find_mode(counts.territory);
		cellAttribute.actor = find_mode(counts.actor);
		cellAttribute.elevation = find_mode(counts.elevation);

		var color;
	
		//Go through the canvases
		//Terrain
		if (cellAttribute.terrain === "OPEN")
		{
			color = this.getColorFromElevation(cellAttribute.elevation);
		}
		else if (cellAttribute.terrain === "WATER")
		{
			color = g.colors.water;
		}
		cell.fillRect(color, "terrain");
		//cell.strokeRect(g.colors.border, "terrain");
		
		//Terrirory
		if (cellAttribute.territory !== false)
		{
			color = g.colors.team[cellAttribute.territory];
			cell.fillRect(color, "territory");
		}

		//Actors
		if (cellAttribute.actor)
		{
			var char = cellAttribute.actor.char;
			var color = g.colors.team[cellAttribute.actor.team.number];
			cell.fillText(char, color, "actors");
			if (cellAttribute.actor.type === "BUILDING")
				cell.strokeRect(color, "actors");
		}
		
		if (this.zoom === this.MAX_ZOOM)
		{
			//Select
			if (tiles[0].selected)
			{
				color = g.colors.selectedTile;
				cell.strokeRect(color, "select");
			}
			//If highlighted
			if (tiles[0].DEBUG.highlight)
			{
				cell.fillRect("yellow", "terrain");
				cell.fillText(tiles[0].DEBUG.char, "black", "select");
			}
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
	var mI = g.constants.BASE_MOVE_INCREMENT * Math.pow(2, (this.MAX_ZOOM - this.zoom));

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



View.prototype.zoomIn = function()
{
	if (this.zoom === this.MAX_ZOOM)
		return;
	this.zoom++;
	this.setAll();
}


View.prototype.zoomOut = function()
{
	if (this.zoom === this.MIN_ZOOM)
		return;
	this.zoom--;
	this.setAll();
}







View.prototype.updateTicks = function()
{
	$("#ticks").html(g.game.ticks);
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
View.prototype.getTilesFromCell = function(cell)
{
	var currX = cell.x;
	var currY = cell.y;

	/*
	if (this.zoom = MAX_ZOOM) //If there's just one tile per cell
	{
		var tileX = this.viewX + x;
		var tileY = this.viewY + y;
		if (tileX < 0 || tileX >= g.game.map.width || tileY < 0 || tileY >= g.game.map.height)
		{
			return false;
		}
		return [g.game.map.getTile(tileX, tileY)];
	}
	*/

	var returnArray = [];

	//number of tiles per cell = 4 ^ (max_zoom - zoom)
	var tilesPerEdge = Math.pow(2, (this.MAX_ZOOM - this.zoom));
	var tilesPerCell = tilesPerEdge * tilesPerEdge;
	var currViewX = this.viewX - (this.viewX % tilesPerEdge); //ViewX, viewX should be multiples of tiles per edge. That way, each tile group stays the same regardless of where the map is centered
	var currViewY = this.viewY - (this.viewY % tilesPerEdge);
	var x = currX * tilesPerEdge; //X and Y should be multiplied by tile edge. Because if we're zoomed in, each cell represents more than one tile
	var y = currY * tilesPerEdge;

	for (var tileX = currViewX + x ; tileX < currViewX + x + tilesPerEdge ; tileX++)
	{
		for (var tileY = currViewY + y ; tileY < currViewY + y + tilesPerEdge ; tileY++)
		{
			if (tileX < 0 || tileX >= g.game.map.width || tileY < 0 || tileY >= g.game.map.height)
			{
				continue;
			}
			returnArray.push(g.game.map.getTile(tileX, tileY));
		}
	}


	return returnArray;
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
	var team = building.team.number;
	var table = $("#control-area-" + team).find(".buildings-table");
	var row = $(table).find(".buildings-table-entry-template").clone();
	$(row).attr("id", "building-table-row_" + building.uniqueId);
	$(row).removeClass("display-none").removeClass("buildings-table-entry-template");
	//Add checkbox event listener
	$(row).find(".producer-switch").change(function()
	{
		var pId = $(this).parent().parent().attr("id").split("_")[1];
		var p = g.game.getActorById(pId);
		p.toggle();
	})
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
	if (typeof t !== "object")
	{
		var e = new Error("Team in g.view.selectTeam must be a team object");
		console.log(e.stack);
		throw(e);
		return;
	}
	$(".control-area").each(function(index, element)
		{
			if (index == t.number)
			{
				$(this).removeClass("display-none");
			}
			else
			{
				$(this).addClass("display-none");
			}
		});
}



View.prototype.selectDivision = function(d)
{
	this.selectedDivision = d;
	$("#control-area-" + this.selectedTeam.number).find(".units-control-area").each(function(index, element)
	{
		if(index == d.number)
			$(element).removeClass("display-none");
		else
			$(element).addClass("display-none");
	})
}



View.prototype.selectControlArea = function(a)
{
	var currentControlArea = $("#control-area-" + this.selectedTeam.number);
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
	var currentControlArea = $("#control-area-" + this.selectedTeam.number);
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


		//Unit stuff
		//Then set the squad select list

		var unitControlArea = $(currentControlArea).find(".units-control-area-container");
		var divisionSelect = $(currentControlArea).find(".division-select");
		var aIContainerTemplateBase = $(currentControlArea).find(".units-control-area");//Clone the ai container template, which we then clone to populate each division's ai window
		var aIContainerTemplate = $(aIContainerTemplateBase).clone();
		$(aIContainerTemplateBase).remove();//Remove the existing template


		for (var d = 0 ; d < g.constants.MAX_DIVISIONS ; d++)
		{
			//Add an option in the division select dropdown menu
			$(divisionSelect).append('<option value="' + d + '">' + (d + 1) + '</option>');
			//Add an AI panel for this division
			var currAIContainer = $(aIContainerTemplate).clone();
			$(currAIContainer).find("input.move-to-selected-tile-btn")
				.attr("id", "move-to-selected-tile_" + i + "_" + d);
			$(unitControlArea).append(currAIContainer);
		}

		//Building stuff
		//Set up the building construct buttons
		var constructArea = $(currentControlArea).find(".buildings-construct");
		for (var name in g.constructors.buildings)
		{
			//Get the name and text
			var unit = new g.constructors.buildings[name]();
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
	//Set selected team
	this.selectTeam(g.game.teams[0]);
	this.selectControlArea("units");
	this.selectDivision(this.selectedTeam.divisions[0]);
}


View.prototype.initialize = function(){

	//Set canvas style
	$("canvas").css("position", "absolute")
				.attr("height", this.canvasStyle.height)
				.attr("width", this.canvasStyle.width);
				//.css("top", this.canvasStyle.top + "px")
				//.css("left", this.canvasStyle.left + "px")
				//.css("width", this.canvasStyle.width + "px")
				//.css("height", this.canvasStyle.height + "px")
	$("#territory-canvas").css("opacity", ".4");

	//Set canvas context stuff
	this.canvases.actors.textAlign = "center";
	this.canvases.actors.textBaseline = "middle";

	//Set canvas container style (to fill in the space to make the floats right)
	$("#canvases").css("width", this.widthInPixels + "px")
					.css("height", this.heightInPixels + "px")
					.css("background-color", "black");

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




View.prototype.DEBUG = {}

View.prototype.DEBUG.highlightTile = function(tile)
{
	var cell = g.view.getCellFromTile(tile);
	if (cell)
	{
		cell.fillRect("yellow", "terrain");
	}
}







