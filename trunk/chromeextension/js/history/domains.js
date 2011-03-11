var DomainManager = {};

(function(){
	var m = DomainManager;
	var domains = new Array();

	m.addDomains = function(input){
		for(var i in input){
			m.addDomain(input[i].url, input[i].name);
		}
	}
	m.addDomain = function(url, name){
		var index = getDomainIndex(name);
		if(index==-1){
			domains[domains.length] = {url: url, name: name, rating: 1};
		}else{
			var domain = domains[index];
			domains[index] = {url: url, name: name, rating: domain.rating+1};
			if(domain.rating+1>best) best = domain.rating+1;
		}
	}

	function sortFunction(a, b){
		return b.rating-a.rating;
	}

	m.display = function(){
		domains.sort(sortFunction);
		$("#contentFilters").html("");
		for(var i in domains){
			displayDomain(domains[i].url, domains[i].name, domains[i].rating);
		}
	}

	var best = 1; //dummy. To be overwritten before first call
	function displayDomain(icon, title, rating){
		var img = IconFactory.createIcon(icon, title);
		img.css("opacity", Helper.decay(rating, 1, best));
		$("#contentFilters").append(img.addClass("favicon"));
		img.click(function(){
			var label = "<img class='favicon' src='"+$(this).attr("src")+"' />";
			FilterManager.addFilter("domain", title, label);
		});
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
		$("#contentFilters").append(img.addClass("favicon"));
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
		$("#contentFilters").html("");
	}
})();
