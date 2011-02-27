var ItemManager = {};

(function(){
	var m = ItemManager;
	var list = new Array();
	var counter = 0;

	/*m.getItems = function(){
		var output = new Array();
		for(var i in list){
			var items = list[i].items;
			for(var j in items){
				output[output.length] = items[j];
			}
		}
		return output;
	}*/

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
			items[i].id = counter++;
			addItem(items[i], domain);
		}
		DomainManager.addDomain(favUrl, name);
	}

	function addItem(item, domain){
		var title = item.title;
		var url = item.url;
		var keywords = item.keywords;
		var importance = item.importance;
		var events = item.events;
		var startTime = item.startTime;
		var id = item.id;
		delete domain["items"]; //prevent recursive data structure
		item.domain = domain;
		TermManager.addTerms(keywords);
		TableManager.addItem(id, startTime, title, domain.color, url, domain.favUrl, item);
		if(importance && importance.length>0){ 
			//Is this the correct approach? Or should I check the time?
			GraphManager.addLayer(domain.color, importance, id);
		}else{
			EventManager.add(startTime, domain.favUrl, domain.color, title, id);
		}
	}
})();
