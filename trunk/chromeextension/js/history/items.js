var ItemManager = {};

(function(){
	var m = ItemManager;
	m.list = new Array();
	var counter = 0;

	m.addItems = function(items){
		SortManager.sortItems(items);
		for(var i in items){
			var id = counter++;
			addItem(id, items[i]);
			m.list[id] = items[i];
		}
		DomainManager.display();
		TermManager.display();
	}

	m.clear = function(){
		counter = 0;
		m.list = [];
		TableManager.clearItems();
		GraphManager.clear();
		EventManager.clear();
		DomainManager.clearDomains();
		TermManager.clearTerms();
	}

	/*m.getDomainItemsById = function(id){
		var domain = m.list[id].domain.name;
		m.getDomainItems(domain);
	}

	m.getDomainItems = function(domain){
		var output = [];
		for(var i in m.list){
			if(m.list[i].domain.name == domain){
				output[output.length] = m.list[i];
			}
		}
		return output;
	}*/

	var domains = new Array();
	function addToDomainList(domain, color){
		for(var i in domains){
			if(domains[i] == domain){
				return i;
			}
		}
		var output = domains.length;
		domains[output] = domain;
		return output;
	}

	m.getDomainId = function(domain){
		for(var i in domains){
			if(domains[i] == domain){
				return i;
			}
		}
	}

	function addItem(id, item){
		var domain = item.domain;
		item.id = id;
		item.domain.id = addToDomainList(domain.name, domain.color);
		TermManager.addTerms(item.keywords);
		TableManager.addItem(item);
		DomainManager.addDomain(domain.favUrl, domain.name);
		var importance = item.importance;
		if(importance && importance.length>0){ 
			GraphManager.addLayer(item.domain.color, item.importance, item.id, item.startTime, domain.name);
		}else{
			EventManager.add(item.startTime, domain.favUrl, domain.color, item.title, item.id);
		}
	}
})();
