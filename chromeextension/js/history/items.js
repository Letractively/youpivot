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
	}

	function addItem(id, item){
		var domain = item.domain;
		item.id = id;
		TermManager.addTerms(item.keywords);
		TableManager.addItem(item);
		DomainManager.addDomain(domain.favUrl, domain.name);
		var importance = item.importance;
		if(importance && importance.length>0){ 
			GraphManager.addLayer(item.domain.color, item.importance, item.id, item.startTime);
		}else{
			EventManager.add(item.startTime, domain.favUrl, domain.color, item.title, item.id);
		}
	}
})();
