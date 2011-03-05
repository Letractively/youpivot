var TableManager = {};

//This class is using the structure itemtable.js as backbone
(function(){
	var m = TableManager;

	m.reload = function(){
		m.clearItems();
		var list = ItemManager.list;
		SortManager.sortItems(list);
		for(var i in list){
			m.addItem(list[i]);
		}
	}

	m.loadFilters = function(){
		// load back filters from pivot view
		DomainManager.clearDomains();
		TermManager.clearTerms();
		$("#textContent .itemTable .item:not(.out)").each(function(){
			var item = $(this).data("item");
			DomainManager.addDomain(item.domain.favUrl, item.domain.name);
			TermManager.addTerms(item.keywords);
		});
		DomainManager.display();
		TermManager.display();
	}

	m.addItem = function(item){
		var obj = {id: item.id, date: item.startTime, name: item.title, color: item.domain.color, url: item.url, favUrl: item.domain.favUrl, domain: item.domain.name};
		var row = $("#textContent").itemTable("addItem", obj, item);
		row.mouseenter(function(e){
			HighlightManager.highlightLayer(item.id, false);
		});
		row.mouseleave(function(e){
			HighlightManager.lowlightLayer(item.id, false);
		});
	}

	m.clearItems = function(){
		$("#textContent").itemTable("clear");
	}
})();
