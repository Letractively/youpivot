include("/js/iconfactory.js");

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
            HighlightManager.mouseEnterGraph(id);
			//HighlightManager.highlightDomain(id, {persistent: false});
			//HighlightManager.scrollToItem(id, 500);
		})
        .mouseout(function(){
			if(!$(this).hasClass("highlight")){
				$(this).removeClass("active");
			}
            HighlightManager.mouseLeaveGraph(id);
			//HighlightManager.lowlightDomain(id, {clearPersistent: false});
			//HighlightManager.cancelScroll(id);
		})
        .click(function(){
            HighlightManager.clickOnGraph(id);
			//$(this).toggleClass("highlight");
			//var toggle = $(this).hasClass("highlight");
			//toggleItemHighlight(id, toggle);
			//HighlightManager.scrollToItem(id, 0);
		});
		m.scaleIcons();
	}

	m.scaleIcons = function(pos){
		if(!pos) pos = GraphManager.getDisplayRange();
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
			HighlightManager.highlightDomain(id, {persistent: true});
		else
			HighlightManager.lowlightDomain(id, {clearPersistent: true});
	}

	var favWidth = 22;
	function getOffset(time){
		var range = GraphManager.getLoadedRange();
		var offset = (time-range.start)/(range.end-range.start);
		var w = $("#events").width();
		offset *= w;
		//if(offset > w+25) offset = -20;
		if(offset > w) offset = w;
		return offset - favWidth/2;
	}
})();
