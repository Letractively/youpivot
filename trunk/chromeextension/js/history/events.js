var EventManager = {};

(function(){
	var m = EventManager;

	m.add = function(time, icon, color, name, id){
		var offset = getOffset(time);
		addIcon(offset, icon, color, name, id);
	}

	function addIcon(offset, icon, color, name, id){
		var img = IconFactory.createIcon(icon, name).addClass("eventIcon");
		img.css("left", offset);
		img.css("border-color", color);
		$("#events").append(img);
		img.mouseover(function(){
			$(this).addClass("active");
			HighlightManager.highlightDomain(id, false);
		});
		img.mouseout(function(){
			if(!$(this).hasClass("highlight")){
				$(this).removeClass("active");
			}
			HighlightManager.lowlightDomain(id, false);
		});
		img.click(function(){
			$(this).toggleClass("highlight");
			var toggle = $(this).hasClass("highlight");
			toggleItemHighlight(id, toggle);
		});
	}

	function toggleItemHighlight(id, toggle){
		console.log("toggle");
		var item = $("#item_"+id);
		if(toggle)
			HighlightManager.highlightDomain(id, true);
		else
			HighlightManager.lowlightDomain(id, true);
	}

	function getOffset(time){
		var startTime = GraphManager.getStartTime();
		var endTime = GraphManager.getEndTime();
		var offset = (time-startTime)/(endTime-startTime);
		var w = $("#events").width();
		offset *= w;
		if(offset > w-16) offset = w-16;
		return offset;
	}
})();
