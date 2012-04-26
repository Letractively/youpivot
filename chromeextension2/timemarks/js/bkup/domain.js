include("/js/utilities.js");
include("/timemarks/js/timemarkfilters.js");

var TMDomainManager = new (function _TMDomainManager(){
    var self = this;
    var filterList;

    $(function(){
        filterList = $("#tm-contentFilters").FilterList();
        filterList.setTypeName("domain");
        filterList.addScaleStyle("opacity");
        filterList.setMenuTitle(function(html, title, value){ return html+"<span>"+title+"</span>"; });
        $("#tm-contentFilters").bind("includefilter", function(e, obj, value){
            var label = IconFactory.createTextIcon($(obj).attr("src"), value + " (click to remove)", "wrap");
            TMFilterManager.filter.addFilter("domain", value, label);
        }).bind("excludefilter", function(e, obj, value){
            var label = IconFactory.createTextIcon($(obj).attr("src"), value + " (click to remove)", "wrap");
            TMFilterManager.filter.addOutcast("domain", value, label);
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
		$("#tm-contentFilters").append(img.addClass("favicon"));
	}

	self.clearDomains = function(retainOrder){
        filterList.clearFilters(retainOrder);
	}
})();
