include_("Utilities");
include_("THFilterManager");
include_("IconFactory");
include_("FilterList");

var THDomainManager = new (function _THDomainManager(){
    var self = this;
    var filterList;

    self.init = function(){
        filterList = $("#th-contentFilters").FilterList();
        filterList.setTypeName("domain");
        filterList.addScaleStyle("opacity");
        filterList.setMenuTitle(function(html, title, value){ return html+"<span>"+title+"</span>"; });
        $("#th-contentFilters").bind("includefilter", function(e, obj, value){
            var label = IconFactory.createTextIcon($(obj).attr("src"), value + " (click to remove)", "wrap");
            THFilterManager.filter.addFilter("domain", value, label);
            analytics("Traditional History", "Filter: include domain: "+value, {action: "filter", filtertype: "domain", value: value});
        }).bind("excludefilter", function(e, obj, value){
            var label = IconFactory.createTextIcon($(obj).attr("src"), value + " (click to remove)", "wrap");
            THFilterManager.filter.addOutcast("domain", value, label);
            analytics("Traditional History", "Filter: exclude domain: "+value, {action: "filter", filtertype: "domain", value: value});
        });

        filterList.setNewItemFactory(createNewItem);
    }

    function createNewItem(){
        return $(IconFactory.createTextIcon("", "", "wrap"));
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
        filterList.addItem2(function(item){
            item.attr("src", url);
            item.attr("title", name);
            return item;
        }, icon, name, name, true);
	}

	self.display = function(){
        filterList.display(true);
	}

	self.clearDomains = function(retainOrder){
        filterList.clearFilters(retainOrder);
	}
})();
