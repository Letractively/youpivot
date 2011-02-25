var ItemManager = {};

(function(){
	var m = ItemManager;
	var list = new Array();

	m.getItems = function(){
		var output = new Array();
		for(var i in list){
			var items = list[i].items;
			for(var j in items){
				output[output.length] = items[j];
			}
		}
		return output;
	}

	m.addDomains = function(domains){
		for(var i in domains){
			m.addDomain(domains[i]);
		}
	}

	m.addDomain = function(domain){
		list[list.length] = domain;
		var color = domain.color;
		var favUrl = domain.favUrl;
		var name = domain.name;
		var items = domain.items;
		for(var i in items){
			addItem(items[i], domain);
		}
		DomainManager.addDomain(favUrl, name);
	}

	// deprecated
	function getDomainImportance(items){
		var output = new Array();
		for(var j=0; j<758; j++){
			var value = 0;
			var populated = false;
			for(var i in items){
				if(items[i].importance[j]!=undefined){
					value += items[i].importance[j];
					populated = true;
				}
			}
			if(populated){
				output[j] = value;
			}else{
				break;
			}
		}
		return output;
	}

	function addItem(item, domain){
		var title = item.title;
		var url = item.url;
		var keywords = item.keywords;
		var importance = item.importance;
		var events = item.events;
		var startTime = item.startTime;
		TermManager.addTerms(keywords);
		TableManager.addItem(startTime, title, domain.color, url, domain.favUrl);
		GraphManager.addLayer(domain.color, importance);
		console.log("additem", item);
	}
})();
