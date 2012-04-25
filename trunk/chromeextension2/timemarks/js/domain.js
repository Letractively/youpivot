include_("IconFactory");
include_("Utilities");
include_("TMFilterManager");
//include("/timemarks/js/filters.js");

var TMDomainManager = new (function _TMDomainManager(){
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
		$("#tm-contentFilters").html("");
		for(var i in domains){
			displayDomain(domains[i].url, domains[i].name, domains[i].rating);
		}
	}

	self.addUrlDomain = function(url, name){
		var img = IconFactory.createFavicon(url, name);
		$("#tm-contentFilters").append(img.addClass("favicon"));
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
		$("#tm-contentFilters").html("");
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
		$("#tm-contentFilters").append(img);
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
			}/*,
			"Exclude this domain": {
				click: excludeFilter
			}*/
		}, 
		{ title: tImg+"<span>"+title+"<span>" });
		function includeFilter(obj){
			var label = IconFactory.createTextIcon($(obj).attr("src"), "click to remove", "wrap");
			TMFilterManager.addFilter("domain", $(obj).data("title"), label);
		}
		function excludeFilter(obj){
			var label = IconFactory.createTextIcon($(obj).attr("src"), "click to remove", "wrap");
			TMFilterManager.addOutcast("domain", $(obj).data("title"), label);
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
