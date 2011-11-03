include("js/utilities.js");
include("/traditional/js/sidebar.js");
var THFilterManager = {};

(function(){
	var m = THFilterManager;
	var domains = new Array();

    // add a batch of domains in one function call. For convenience
	m.addDomains = function(input){
		for(var i in input){
			m.addDomain(input[i].url, input[i].name);
		}
	}

    // add a domain to the list, adjusting the the best values. 
    // note that this have no effect on the display until display() is called. 
	m.addDomain = function(url, name, data, visitCount){
        if(visitCount === undefined) visitCount = 1;
		var index = getDomainIndex(name);
		if(index==-1){
			domains[domains.length] = {url: url, name: name, rating: visitCount, data: data};
			if(visitCount>best) best = visitCount;
		}else{
			var domain = domains[index];
            var newRating = domain.rating + visitCount;
			domains[index] = {url: url, name: name, rating: newRating, data: data};
			if(newRating>best) best = newRating;
		}
	}

	function sortFunction(a, b){
		return b.rating-a.rating;
	}

	m.display = function(){
		domains.sort(sortFunction);
		$("#historyFilters").html("");
		for(var i in domains){
			displayDomain(domains[i].url, domains[i].name, domains[i].rating, domains[i].data);
		}
	}

	var best = 1; //dummy. To be overwritten before first call
	function displayDomain(icon, title, rating, data){
		var tImg = IconFactory.createTextIcon(icon, title, "wrap");
		var img = $(tImg);
		img.css("opacity", Utilities.decay(rating, 1, best));
		$("#historyFilters").append(img);
		img.data("title", title);
        img.data("data", data);
		img.click(function(e){
			if(e.which!==3){
				includeFilter(this);
			}
		});
		img.contextMenu("domain_menu", {
			"Include this domain": {
				click: includeFilter
			},
			/*"Exclude this domain": {
				click: excludeFilter
			}*/
		}, 
		{ title: tImg+"<span>"+title+"<span>" });
		function includeFilter(obj){
			//var label = IconFactory.createTextIcon($(obj).attr("src"), "click to remove", "wrap");
			//FilterManager.addFilter("domain", $(obj).data("title"), label);
            filterClicked({data: $(obj).data("data")});
		}
		function excludeFilter(obj){
			//var label = IconFactory.createTextIcon($(obj).attr("src"), "click to remove", "wrap");
			//FilterManager.addOutcast("domain", $(obj).data("title"), label);
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

	m.addUrlDomain = function(url, name){
		var img = IconFactory.createFavicon(url, name);
		$("#historyFilters").append(img.addClass("favicon"));
	}

	m.clearDomains = function(retainOrder){
		if(!retainOrder){
			domains = [];
		}else{
			for(var i in domains){
				domains[i].rating = 0;
			}
		}
		best = 1;
		$("#historyFilters").html("");
	}
})();
