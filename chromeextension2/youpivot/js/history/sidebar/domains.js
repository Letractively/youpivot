include_("IconFactory");
include_("FilterList");
include_("HighlightManager");

var DomainManager = new (function _DomainManager(){
    var self = this;
    var filterList;

    self.init = function(){
        filterList = $("#contentFilters").FilterList();
        filterList.setTypeName("domain");
        filterList.addScaleStyle("opacity");
        filterList.setMenuTitle(function(html, title, value){ return html+"<span>"+title+"</span>"; });
        $("#contentFilters").bind("mouseoverfilter", function(e, obj, value){
            HighlightManager.highlightActiveTableDomain(value);
        }).bind("mouseoutfilter", function(e, obj, value){
            HighlightManager.lowlightActiveTableDomain(value);
        }).bind("includefilter", function(e, obj, value){
            var label = IconFactory.createTextIcon($(obj).attr("src"), value + " (click to remove)", "wrap");
            FilterManager.filter.addFilter("domain", value, label);
            analytics("filter", "filter in youpivot domain", value);
        }).bind("excludefilter", function(e, obj, value){
            var label = IconFactory.createTextIcon($(obj).attr("src"), value + " (click to remove)", "wrap");
            FilterManager.filter.addOutcast("domain", value, label);
            analytics("filter", "filter out youpivot domain", value);
        });
    }

    // add a batch of domains in one function call. For convenience
	self.addDomains = function(input){
		for(var i in input){
			self.addDomain(input[i].url, input[i].name);
		}
	}

    // add a domain to the list, adjusting the the best values. 
    // note that this have no effect on the display until display() is called. 
	self.addDomain = function(url, name){
        var icon = IconFactory.createTextIcon(url, name, "wrap");
        filterList.addItem(icon, name, name, true);
	}

	self.display = function(){
        if(filterList)
            filterList.display();
	}

	self.clearDomains = function(retainOrder){
        if(filterList)
            filterList.clearFilters(retainOrder);
	}
})();
