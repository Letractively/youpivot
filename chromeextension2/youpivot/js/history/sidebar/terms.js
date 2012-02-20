include("/js/views/filterlist.js");
include("/js/utilities.js");

var TermManager = new (function _TermManager(){
    var self = this;

    var filterList;

    $(function(){
        filterList = $("#terms").FilterList();
        filterList.addScaleStyle("font-size", function(scale){ return scale * 20 + "px"; });
        filterList.setMenuTitle(function(html, title, value){
            return value;
        });
        $("#terms").bind("includefilter", function(e, obj, value){
            FilterManager.addFilter("name", value, value);
        }).bind("excludefilter", function(e, obj, value){
            FilterManager.addOutcast("name", value, value);
        });
    });

	//add an array of terms
	self.addTerms = function(texts){
		for(var i in texts){
			self.addTerm(texts[i]);
		}
	}
	self.addTerm = function(text){
        var html = '<div class="term"><a href="javascript:filter" class="termAnchor">'+Utilities.htmlEntities(text)+'</a></div>';
        filterList.addItem(html, "", text.toLowerCase(), true);
	}
	self.display = function(){
        filterList.display();
	}

	self.clearTerms = function(retainOrder){
        filterList.clearFilters(retainOrder);
	}
})();
