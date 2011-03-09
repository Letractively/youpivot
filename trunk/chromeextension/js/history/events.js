var EventManager = {};

(function(){
	var m = EventManager;

	m.add = function(time, icon, color, name, id){
		var offset = getOffset(time);
		addIcon(offset, icon, color, name, id);
	}

	function addIcon(offset, icon, color, name, id){
		var img = IconFactory.createIcon(icon, name).addClass("eventIcon");
		img.attr("id", "event_"+id);
		img.css("left", offset);
		img.css("border-color", color);
		$("#events").append(img);
		img.mouseover(function(){
			$(this).addClass("active");
			HighlightManager.highlightDomain(id, false);
			HighlightManager.scrollToItem(id, 500);
		});
		img.mouseout(function(){
			if(!$(this).hasClass("highlight")){
				$(this).removeClass("active");
			}
			HighlightManager.lowlightDomain(id, false);
			HighlightManager.cancelScroll(id);
		});
		img.click(function(){
			$(this).toggleClass("highlight");
			var toggle = $(this).hasClass("highlight");
			toggleItemHighlight(id, toggle);
			HighlightManager.scrollToItem(id, 0);
		});
		m.scaleIcons();
	}

	m.scaleIcons = function(pos){
		if(!pos) pos = GraphManager.getGraphPos();
		var xScale = 0.1/pos.scale;
		$(".eventIcon").css("-webkit-transform", "scaleX("+1/xScale+")");
	}

	m.highlight = function(id, persistent){
		var item = $("#event_"+id);
		if(persistent) item.addClass("highlight");
		item.addClass("active");
	}
	m.lowlight = function(id, clearPersistent){
		var item = $("#event_"+id);
		if(clearPersistent || !item.hasClass("highlight")){
			item.removeClass("active highlight");
		}
	}
	m.clear = function(){
		$("#events").html("");
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
