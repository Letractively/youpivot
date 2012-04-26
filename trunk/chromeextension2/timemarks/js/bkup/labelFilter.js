include("/js/views/filterlist.js");
include("/js/utilities.js");

var TMLabelManager = new (function _TMLabelManager(){
    var self = this;

    var filterList;

    $(function(){
        filterList = $("#tm-labelFilters").FilterList();
        filterList.setTypeName("label");
        filterList.addScaleStyle("opacity");
        filterList.onAttached(function(item, scale){
            item.css("font-size", scale * 20 + "px");
            item.find("a").css("opacity", scale);
        });
        //filterList.addScaleStyle("font-size", function(scale){ return scale * 20 + "px"; });
        filterList.setMenuTitle(function(html, title, value){
            return value;
        });
        $("#tm-labelFilters").bind("includefilter", function(e, obj, value){
            THFilterManager.filter.addFilter("label", value, value);
        }).bind("excludefilter", function(e, obj, value){
            THFilterManager.filter.addOutcast("label", value, value);
        });
    });

	//add an array of terms
	self.addTerms = function(texts){
		for(var i in texts){
			self.addTerm(texts[i]);
		}
	}
	self.addTerm = function(text){
        if(!text || text == "") return;
        var html = '<div class="term"><a href="javascript:filter" class="termAnchor filterHandle">'+Utilities.htmlEntities(text)+'</a></div>';
        filterList.addItem(html, "", text.toLowerCase(), true);
	}
	self.display = function(){
        filterList.display();
	}

	self.clearTerms = function(retainOrder){
        if(filterList)
            filterList.clearFilters(retainOrder);
	}
})();
