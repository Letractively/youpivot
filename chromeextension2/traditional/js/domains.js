include("/js/utilities.js");
include("/traditional/js/historyfilter.js");

var THDomainManager = new (function _THDomainManager(){
    var self = this;
    var filterList;

    $(function(){
        filterList = $("#th-contentFilters").FilterList();
        filterList.addScaleStyle("opacity");
        filterList.setMenuTitle(function(html, title, value){ return html+"<span>"+title+"</span>"; });
        $("#th-contentFilters").bind("includefilter", function(e, obj, value){
            var label = IconFactory.createTextIcon($(obj).attr("src"), value + " (click to remove)", "wrap");
            THFilterManager.filter.addFilter("domain", value, label);
        }).bind("excludefilter", function(e, obj, value){
            var label = IconFactory.createTextIcon($(obj).attr("src"), value + " (click to remove)", "wrap");
            THFilterManager.filter.addOutcast("domain", value, label);
        });
    });

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
        filterList.display();
	}

	self.addUrlDomain = function(url, name){
        throw "deprecated";
		var img = IconFactory.createFavicon(url, name);
		$("#th-contentFilters").append(img.addClass("favicon"));
	}

	self.clearDomains = function(retainOrder){
        filterList.clearFilters(retainOrder);
	}
})();
