include_("IconFactory");
include_("HighlightManager");

var EventManager = new (function _EventManager(){
	var self = this;

	self.add = function(time, icon, color, name, id, loadedRange, displayRange){
		var offset = getOffset(time, loadedRange);
		addIcon(offset, icon, color, name, id, displayRange);
	}

	function addIcon(offset, icon, color, name, id, displayRange){
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
		self.scaleIcons(displayRange);
	}

	self.scaleIcons = function(pos){
		var xScale = 0.1/pos.scale;
		$(".eventIcon").css("-webkit-transform", "scaleX("+1/xScale+")");
	}

	self.highlight = function(id, persistent){
		var item = $("#event_"+id);
		if(persistent) item.addClass("highlight");
		item.addClass("active");
	}
	self.lowlight = function(id, clearPersistent){
		var item = $("#event_"+id);
		if(clearPersistent || !item.hasClass("highlight")){
			item.removeClass("active highlight");
		}
	}
	self.clear = function(){
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
	function getOffset(time, loadedRange){
		//var range = GraphManager.getLoadedRange();
		var range = loadedRange;
		var offset = (time-range.start)/(range.end-range.start);
		var w = $("#events").width();
		offset *= w;
		//if(offset > w+25) offset = -20;
		if(offset > w) offset = w;
		return offset - favWidth/2;
	}
})();
