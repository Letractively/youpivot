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
		var index = getDomainIndex(url);
		if(index==-1){
			domains[domains.length] = {url: url, name: name, rating: 1};
		}else{
			var domain = domains[index];
			domains[index] = {url: url, name: name, rating: domain.rating+1};
		}
		domains.sort(sortFunction);
		m.display();
	}

	function sortFunction(a, b){
		return b.rating-a.rating;
	}

	m.display = function(){
		$("#contentFilters").html("");
		for(var i in domains){
			displayDomain(domains[i].url, domains[i].name, i);
		}
	}

	function displayDomain(icon, title, order){
		var img = IconFactory.createIcon(icon, title);
		img.css("opacity", decay(order, 0.15));
		$("#contentFilters").append(img.addClass("favicon"));
		img.click(function(){
			var label = "<img class='favicon' src='"+$(this).attr("src")+"' />";
			FilterManager.addFilter("domain", title, label);
		});
	}

	//return an exponentially decaying number (0-1)
	function decay(num, rate){
		//exponential decay
		return Math.pow(2, num*-rate);
	}

	function getDomainIndex(domain){
		for(var i in domains){
			if(domains[i].url == domain){
				return i;
			}
		}
		return -1;
	}

	m.addUrlDomain = function(url, name){
		var img = IconFactory.createFavicon(url, name);
		$("#contentFilters").append(img.addClass("favicon"));
	}

	m.clearDomains = function(){
		$("#contentFilters").html("");
	}
})();
