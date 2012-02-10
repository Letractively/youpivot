include("/js/iconfactory.js");
include("/js/utilities.js");
include("/traditional/js/filters.js");

var THDomainManager = new (function _THDomainManager(){
    var self = this;
	var domains = new Array();

    // add a batch of domains in one function call. For convenience
	self.addDomains = function(input){
		for(var i in input){
			self.addDomain(input[i].url, input[i].name);
		}
	}

    // add a domain to the list, adjusting the the best values. 
    // note that this have no effect on the display until display() is called. 
	self.addDomain = function(url, name){
		var index = getDomainIndex(name);
		if(index==-1){
			domains[domains.length] = {url: url, name: name, rating: 1};
		}else{
			var domain = domains[index];
			domains[index] = {url: url, name: name, rating: domain.rating+1};
			if(domain.rating+1>best) best = domain.rating+1;
		}
	}

	self.display = function(){
		domains.sort(sortFunction);
		$("#th-contentFilters").html("");
		for(var i in domains){
			displayDomain(domains[i].url, domains[i].name, domains[i].rating);
		}
	}

	self.addUrlDomain = function(url, name){
		var img = IconFactory.createFavicon(url, name);
		$("#th-contentFilters").append(img.addClass("favicon"));
	}

	self.clearDomains = function(retainOrder){
		if(!retainOrder){
			domains = [];
		}else{
			for(var i in domains){
				domains[i].rating = 0;
			}
		}
		best = 1;
		$("#th-contentFilters").html("");
	}

    /********* Private Functions **************/

	function sortFunction(a, b){
		return b.rating-a.rating;
	}

	var best = 1; //dummy. To be overwritten before first call
	function displayDomain(icon, title, rating){
		var tImg = IconFactory.createTextIcon(icon, title, "wrap");
		var img = $(tImg);
		img.css("opacity", Utilities.decay(rating, 1, best));
		$("#th-contentFilters").append(img);
		/*img.mouseover(function(){
			HighlightManager.highlightActiveTableDomain(title);
		}).mouseout(function(){
			HighlightManager.lowlightActiveTableDomain(title);
		});*/
		img.data("title", title);
		img.click(function(e){
			if(e.which!==3){
				includeFilter(this);
			}
		});
		img.contextMenu("domain_menu", {
			"Include this domain": {
				click: includeFilter
			},
			"Exclude this domain": {
				click: excludeFilter
			}
		}, 
		{ title: tImg+"<span>"+title+"<span>" });
		function includeFilter(obj){
			var label = IconFactory.createTextIcon($(obj).attr("src"), $(obj).data("title")+" (click to remove)", "wrap");
			THFilterManager.addFilter("domain", $(obj).data("title"), label);
		}
		function excludeFilter(obj){
			var label = IconFactory.createTextIcon($(obj).attr("src"), $(obj).data("title")+" (click to remove)", "wrap");
			THFilterManager.addOutcast("domain", $(obj).data("title"), label);
		}
	}

	function getDomainIndex(domain){
		for(var i in domains){
			if(domains[i].name == domain){
				return i;
			}
		}
		return -1;
	}

})();
