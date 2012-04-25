include_("FilterList");
include_("Utilities");
include_("FilterManager");

var TermManager = new (function _TermManager(){
    var self = this;

    var filterList;

    self.init = function(){
        filterList = $("#terms").FilterList();
        filterList.setTypeName("term");
        //filterList.addScaleStyle("opacity");
        filterList.onAttached(function(item, scale){
            item.css("font-size", scale * 20 + "px");
            item.find("a").css("opacity", scale);
        });
        //filterList.addScaleStyle("font-size", function(scale){ return scale * 20 + "px"; });
        filterList.setMenuTitle(function(html, title, value){
            return value;
        });
        $("#terms").bind("includefilter", function(e, obj, value){
            FilterManager.filter.addFilter("name", value, value);
            analytics("YouPivot", "Filter: include term: "+value, {action: "filter", filtertype: "term", value: value});
        }).bind("excludefilter", function(e, obj, value){
            FilterManager.filter.addOutcast("name", value, value);
            analytics("YouPivot", "Filter: exclude term: "+value, {action: "filter", filtertype: "term", value: value});
        });

        filterList.setNewItemFactory(createNewItem);
    }

    function createNewItem(){
        return $('<div class="term"><a href="javascript:filter" class="termAnchor filterHandle"></a></div>');
    }

	//add an array of terms
	self.addTerms = function(texts){
		for(var i=0; i<texts.length; i++){
			self.addTerm(texts[i]);
		}
	}
	self.addTerm = function(text){
        var html = '<div class="term"><a href="javascript:filter" class="termAnchor filterHandle">'+Utilities.htmlEntities(text)+'</a></div>';
        filterList.addItem2(function(item){
            item.children(".termAnchor").text(text);
        }, html, "", text.toLowerCase(), true);
	}
	self.display = function(){
        filterList.display(true);
	}

	self.clearTerms = function(retainOrder){
        // possibly unused
        if(filterList)
            filterList.clearFilters(retainOrder);
	}
})();
