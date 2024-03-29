
function Input()
{

}

Input.prototype.initialize = function()
{
	$(document).keydown(function(event)
	{
		var shiftDown = event.shiftKey;
		switch(event.keyCode)
		{
			case 38:
				g.view.move("UP");
				break;
			case 39:
				g.view.move("RIGHT");
				break;
			case 40:
				g.view.move("DOWN");
				break;
			case 37:
				g.view.move("LEFT");
				break;
			case 61: //= / +
				g.view.zoomIn();	
				break;
			case 173:
				g.view.zoomOut();
				break;
		}
	});


	$("#select-canvas").click(function(event){
		//Only do it if we're all the way zoomed in
		if (g.view.zoom === g.view.MAX_ZOOM)
			g.game.clickCanvasPixel(event.offsetX, event.offsetY);
	});


	//Time control buttons
	$("#play-pause-button").click(function(){
		g.game.playOrPause();
	});
	$("#next-button").click(function(){
		g.game.next();
	});

	//Can't click select lists unless you're in the default state
	$("select").on("mousedown", function(event)
	{
		if (g.game.state !== "DEFAULT")
		{
			event.preventDefault();
			this.blur();
			window.focus();
		}
	});

	//Set select list inputs
	$("#team-select").change(function(){
		var selectedTeam = $(this).val();
		g.view.selectTeam(selectedTeam);
	});

	//Control area select list inputs
	$(".sub-control-area-select").change(function()
	{
		var selected = $(this).val();
		g.view.selectControlArea(selected);
	});

	//Building area select list inputs
	$(".buildings-select").change(function()
	{
		var selected = $(this).val();
		g.view.selectBuildingControlArea(selected);
	});



	//Construction buttons inputs
	$(".construct-button").click(function()
	{
		var building = $(this).attr("data-tag");
		g.game.clickConstructButton(building);
	});
}






