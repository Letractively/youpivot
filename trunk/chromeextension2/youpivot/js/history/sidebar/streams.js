include("/js/iconfactory.js");
include("/js/views/filterlist.js");
var StreamManager = new (function _StreamManager(){
    var self = this;
    var filterList;

    $(function(){
        filterList = $("#streamFilters").FilterList();
        filterList.addScaleStyle("opacity");
        filterList.setMenuTitle(function(html, title, value){ return html+"<span>"+title+"</span>"; });
        $("#streamFilters").bind("includefilter", function(e, obj, value){
            var label = IconFactory.createTextIcon($(obj).attr("src"), value + " (click to remove)", "wrap");
            FilterManager.addFilter("stream", value, label);
        }).bind("excludefilter", function(e, obj, value){
            var label = IconFactory.createTextIcon($(obj).attr("src"), value + " (click to remove)", "wrap");
            FilterManager.addOutcast("stream", value, label);
        });
    });

	self.addStreams = function(input){
		for(var i in input){
			self.addStream(input[i].name);
		}
	}
	self.addStream = function(name){
		var iconimg = getStreamIcon(name);
        var icon = IconFactory.createTextIcon(iconimg, name, "wrap");
        filterList.addItem(icon, name, name, true);
	}

	self.display = function(){
        filterList.display();
	}

	function getStreamIcon(name){
		switch(name){
			case "chrometab":
				return "youpivot/images/streams/chrome.png";
			case "timemark":
				return "images/timemark.png";
			default: // FIXME make this extensible
				console.log("Unknown stream: "+name);
				return "";
		}
	}

	self.clearStreams = function(retainOrder){
        filterList.clearFilters(retainOrder);
	}
})();
