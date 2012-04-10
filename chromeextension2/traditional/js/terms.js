include_("FilterList");
include_("Utilities");
include_("THFilterManager");

var THTermManager = new (function _THTermManager(){
    var self = this;

    var filterList;

    self.init = function(){
        filterList = $("#th-termFilters").FilterList();
        filterList.setTypeName("term");
        filterList.addScaleStyle("opacity");
        filterList.onAttached(function(item, scale){
            item.css("font-size", scale * 20 + "px");
            item.find("a").css("opacity", scale);
        });
        //filterList.addScaleStyle("font-size", function(scale){ return scale * 20 + "px"; });
        filterList.setMenuTitle(function(html, title, value){
            return value;
        });
        $("#th-termFilters").bind("includefilter", function(e, obj, value){
            THFilterManager.filter.addFilter("term", value, value);
            analytics("filter", "filter in history term", value);
        }).bind("excludefilter", function(e, obj, value){
            THFilterManager.filter.addOutcast("term", value, value);
            analytics("filter", "filter out history term", value);
        });
    }

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
